# -*- coding: utf-8 -*-
"""Portugués: lo que tools/lib/semanas_banco.py necesita para fechar el banco.

- grammar(texto, produce): la semana de la gramática del texto.  La verbal
  la lee tools/pt/sillabo.py (tense_weeks); acá se suma lo que no es un
  tiempo: presente irregular (6), estar + gerúndio (8), ir + infinitivo (8),
  contracciones (3), posesivos, demostrativos y dele/dela (10), clíticos
  (reflexivos 12, objeto 16), pra/tá/tô (8-9), números (7), interrogativos
  (8), comparativos (19), indefinidos (20), relativos (25), né/cadê (38).
  Las semanas son las del programa (tools/pt/curriculo.py, WEEKS).
- TAG_WEEK y ERR_CAT_WEEK: los de build_bank.py, con las categorías de
  error que faltaban.
- el léxico (tools/pt/lessico.py).
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)

import lessico  # noqa: E402
import sillabo  # noqa: E402

LEVEL_ENDS = (8, 16, 27, 40)       # docs/lang/pt/rules.js, banca.levels
LAST_WEEK = 48
UNSEEN_WEEK = 17                   # una palabra que no aparece en ningún lado

W = {
    "contracción": 3, "a gente": 5, "presente irregular": 6, "números": 7,
    "interrogativo": 8, "gerúndio": 8, "ir + infinitivo": 8, "tá / tô": 8, "pra": 9,
    "posesivo": 10, "demostrativo": 10, "dele / dela": 10, "reflexivo": 12,
    "clítico": 16, "comparativo": 19, "indefinido": 20, "relativo": 25, "né / cadê": 38,
}

_CONTR = {"no", "na", "nos", "nas", "do", "da", "dos", "das", "ao", "aos", "à", "às", "pelo", "pela",
          "pelos", "pelas", "num", "numa", "nuns", "numas", "dum", "duma"}
_POSS = {"meu", "minha", "meus", "minhas", "teu", "tua", "teus", "tuas", "seu", "sua", "seus", "suas",
         "nosso", "nossa", "nossos", "nossas", "vosso", "vossa", "vossos", "vossas"}
_DELE = {"dele", "dela", "deles", "delas"}
_DEM = re.compile(r"^(?:n|d|nd|à|a)?(?:est|ess|aquel)(?:e|a|es|as)$|^(?:n|d|à)?(?:isto|isso|aquilo)$|"
                  r"^(?:naquel|daquel|àquel)(?:e|a|es|as)$|^(?:naquilo|daquilo|àquilo)$")
_NUM = {"dois", "duas", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze",
        "doze", "treze", "catorze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito",
        "dezenove", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta",
        "noventa", "cem", "cento", "duzentos", "duzentas", "trezentos", "quinhentos", "mil",
        "milhão", "milhões"}
_INTERR = {"qual", "quais", "quanto", "quanta", "quantos", "quantas", "quem", "quando", "porque"}
_INDEF = {"ninguém", "nenhum", "nenhuma", "nenhuns", "nenhumas", "alguém", "algum", "alguma", "alguns",
          "algumas", "qualquer", "quaisquer"}
_CLIT = {"me", "te", "lhe", "lhes", "nos", "vos"}
_SUBJ = {"eu", "ele", "ela", "você", "nós", "eles", "elas", "vocês", "não", "já", "também", "que", "se"}
_TA = {"tá", "tô", "tava", "tavam", "tamos"}
# fórmulas de la semana 1: me chamo, meu nome é, com licença
_FORMULA = re.compile(r"\b(?:eu )?me chamo\b|\bchamo-me\b|\bse chama\b|\bte chamas\b|\bmeu nome\b|"
                      r"\bchama-se\b|\bcomo você se chama\b|\bo seu nome\b|\bseu nome\b|\bcomo se diz\b|\bmuito prazer\b|\bde nada\b")


def _lex():
    return sillabo.lexicon()


def _lemmas(tok):
    return _lex().get("lemmas", {}).get(tok, [])


def _is_verb(tok):
    _load_bank()
    if tok in sillabo.FIXED or tok in _NOMI:
        return False
    return bool(_lex()["simple"].get(tok))


def _is_inf(tok):
    return tok in _lemmas(tok)


def _reflexive(tok):
    _load_bank()
    return any(l.endswith("-se") or (l + "-se") in _REFL for l in _lemmas(tok))


_REFL = set()
_NOMI = set()


def _load_bank():
    import json
    if _REFL:
        return
    try:
        with open(os.path.join(sillabo.ROOT, "docs", "lang", "pt", "data", "bank.json"), encoding="utf-8") as fh:
            bank = json.load(fh)
        _REFL.update(v[0] for v in bank.get("verbs", []) if v[0].endswith("-se"))
        for n in bank.get("nouns", []):
            _NOMI.update(x.lower() for x in (n[0], n[2]) if x)
        for a in bank.get("adjectives", []):
            _NOMI.update(x.lower() for x in a[:4] if x)
    except (OSError, ValueError):
        pass
    _REFL.add("-")


def tokens(text):
    return re.findall(r"[a-zà-úç]+(?:-[a-zà-úç]+)*", str(text or "").lower())


def rasgos(text, produce):
    """{rasgo: semana} de la gramática que no es un tiempo verbal."""
    _load_bank()
    feats = {}

    def need(name):
        feats[name] = W[name]

    low = _FORMULA.sub(" ", str(text or "").lower())
    toks = tokens(low)
    lex = _lex()
    for i, t in enumerate(toks):
        nxt = toks[i + 1] if i + 1 < len(toks) else ""
        prev = toks[i - 1] if i else ""
        parts = t.split("-")
        if t in _CONTR:
            need("contracción")
        if t in _POSS:
            need("posesivo")
        if t in _DELE:
            need("dele / dela")
        if _DEM.match(t):
            need("demostrativo")
        if t in ("né", "cadê"):
            need("né / cadê")
        if t in _TA:
            need("tá / tô")
        if t in ("pra", "pro", "pras", "pros", "prum", "pruma"):
            need("pra")
        if t in _INDEF:
            need("indefinido")
        if t in ("cujo", "cuja", "cujos", "cujas") or (t in ("qual", "quais") and prev in ("o", "a", "os", "as",
                                                                                          "do", "da", "no", "na",
                                                                                          "pelo", "pela")):
            need("relativo")
        # comparativo: mais / menos ... (do) que, tão ... quanto, melhor, pior
        if t in ("mais", "menos") and ("que" in toks[i + 1:i + 6] or prev in ("o", "a", "os", "as")):
            need("comparativo")
        if t == "tão" and ("quanto" in toks[i + 1:i + 6] or "como" in toks[i + 1:i + 6]):
            need("comparativo")
        if t in ("melhor", "pior", "melhores", "piores", "maior", "menor", "maiores", "menores"):
            need("comparativo")
        # gerúndio (estar + gerúndio): semana 8
        if t in lex.get("gerunds", []) or (len(parts) > 1 and parts[0] in lex.get("gerunds", [])):
            need("gerúndio")
        # clíticos: me ajuda, te amo, lhe disse, chama-se, vi-o
        if len(parts) > 1 and parts[0] and _lex()["simple"].get(parts[0]) or len(parts) > 1 and _is_inf(parts[0]):
            if parts[-1] == "se" or _reflexive(parts[0]):
                need("reflexivo")
            elif parts[-1] in ("me", "te", "lhe", "lhes", "nos", "vos", "o", "a", "os", "as", "lo", "la",
                               "los", "las", "no", "na", "nos", "nas"):
                need("clítico")
        if t in _CLIT | {"se"} and nxt and lex["simple"].get(nxt) and nxt not in sillabo.FIXED:
            if t == "se" or _reflexive(nxt):
                need("reflexivo")
            else:
                need("clítico")
        if t in ("o", "a", "os", "as") and prev in _SUBJ and nxt and _is_verb(nxt) and not _is_inf(nxt):
            need("clítico")
        if not produce:
            continue
        # presente irregular (faço, vou, posso): semana 6; ser, estar, ter: 1
        if t in lex.get("irrPres", []) and "presente" in lex["simple"].get(t, []) and t not in sillabo.FIXED \
                and not set(_lemmas(t)) & {"ser", "estar", "ter"}:
            need("presente irregular")
        # ir + infinitivo: vou comer
        if t in ("vou", "vai", "vamos", "vão", "vais", "ia", "iam", "íamos") and nxt and _is_inf(nxt):
            need("ir + infinitivo")
        if t in _NUM or (t == "meia" and prev in ("e", "às", "as")):
            need("números")
        if t in _INTERR and "?" in str(text):
            need("interrogativo")
        if t == "gente" and prev == "a":
            need("a gente")
    return feats


def grammar(text, produce=True):
    return max(features(text, produce).values() or [1])


_NAME = re.compile(r"(?<=[\wà-úç,;] )[A-ZÀ-Ú][\wà-úç]+")


# Palabras que coinciden con una forma verbal pero acá son otra cosa.
_NOT_VERB = {"entre", "sobre", "como", "para", "casa", "fora", "meio", "caro", "cara"}
_SUBJ_V = {"eu", "você", "ele", "ela", "nós", "eles", "elas", "vocês", "gente", "não", "me", "te", "se",
           "lhe", "nos", "que", "também", "já", "tu"}


def _verbs_only(text):
    """El texto sin los sustantivos y adjetivos del banco que coinciden con
    una forma verbal (o telefone, o banco, a farmácia), salvo detrás de un
    sujeto o un pronombre (você me ajuda)."""
    _load_bank()
    lex = _lex()
    out, prev = [], ""
    for t in re.findall(r"[\wà-úç]+(?:-[\wà-úç]+)*|[^\wà-úç]+", text):
        low = t.lower()
        if (low in _NOMI or low in _NOT_VERB) and prev not in _SUBJ_V:
            out.append(" ")
        elif low in lex.get("participles", {}) and prev in lex.get("aux", {}):
            out.append(" ")          # foram entregues: participio, no subjuntivo
        else:
            out.append(t)
        if low.strip() and re.match(r"[\wà-úç]", low):
            prev = low
    return "".join(out)


def features(text, produce=True):
    # Rio, Paulo: un nombre en medio de la oración no es un verbo (rio = río);
    # lo que va entre comillas es otra lengua (como se diz «esquina»)
    text = _NAME.sub(" ", re.sub(r"«[^»]*»", " ", str(text or "")))
    feats = dict(sillabo.tense_weeks(_verbs_only(text)))
    if not produce:
        # lo que se lee: el presente se entiende desde el principio
        feats.pop("presente", None)
    feats.update({k: v for k, v in rasgos(text, produce).items() if v > feats.get(k, 0)})
    return feats


# Correspondencias portugués → castellano (las del Ponte, al revés), para
# reconocer una palabra transparente que no está en el banco.
_PONTE = [(r"ção$", "cion"), (r"ções$", "ciones"), (r"dade$", "dad"), (r"dades$", "dades"),
          (r"vel$", "ble"), (r"veis$", "bles"), (r"agem$", "aje"), (r"ência$", "encia"),
          (r"ância$", "ancia"), (r"ês$", "es"), (r"nh", "ñ"), (r"lh", "ll"), (r"ss", "s"), (r"ç", "z"),
          (r"ão$", "an"), (r"ões$", "ones"), (r"m$", "n")]


# Lo que no es vocabulario: los números los cuenta la gramática.
NOT_VOCAB = _NUM | {"meia", "um", "uma"}


def candidates(tok):
    out = {tok}
    b = tok
    for pat, rep in _PONTE:
        b = re.sub(pat, rep, b)
    out.add(b)
    out.add(re.sub(r"o$", "", b))
    return out


def is_name(tok, lm):
    g = lessico.glossary().get(tok)
    return bool(g and g[1] == "N")


# Etiqueta de oración → semana de su teoría (tools/pt/build_bank.py, TAG_WEEK,
# más las que faltaban).
def _add(t, more):
    for k, v in more.items():
        t.setdefault(k, v)


def _tag_week():
    import build_bank  # noqa: F401  (sus tablas)
    t = dict(build_bank.TAG_WEEK)
    _add(t, {"contracciones": 3, "posesivos": 10, "demostrativos": 10, "numeros": 7, "horas": 7,
              "irregulares": 6, "preposiciones": 9, "crase": 7})
    return t


def _err_week():
    import build_bank  # noqa: F401
    t = dict(build_bank.ERR_CAT_WEEK)
    _add(t, {"contraccion": 3, "articulo": 3, "genero": 2, "plural": 2, "concordancia": 4, "muito": 4,
              "persona": 5, "verbo_irregular": 6, "preposicion": 9})
    return t


class _Lazy(dict):
    def __init__(self, fn):
        super().__init__()
        self._fn = fn
        self._done = False

    def _load(self):
        if not self._done:
            self.update(self._fn())
            self._done = True

    def get(self, k, d=None):
        self._load()
        return super().get(k, d)


TAG_WEEK = _Lazy(_tag_week)
ERR_CAT_WEEK = _Lazy(_err_week)
