# -*- coding: utf-8 -*-
"""El vocabulario del curso: qué significa cada palabra portuguesa y desde
qué semana está en juego.

- index(): forma → (lema, semana, glosa), armado con el banco
  (docs/data/bank.json), las formas del conjugador (tools/forms_lexicon.js)
  y el glosario a mano (tools/bank/glossario.py).
- gloss_table(textos): el glosario para tocar una palabra en la app
  (docs/data/glossario.json): forma → [lema, español, semana].
- is_cognate(): palabra transparente para un hispanohablante (se comprueba
  con las reglas de correspondencia del laboratorio Ponte).
"""
import importlib.util
import json
import os
import re
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

LEVEL_WEEK = {"A1": 1, "A2": 9, "B1": 19, "B2": 31, "C1": 43}

_IDX = None
_GLOSS = None


def _load(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def glossary():
    """{forma: (glosa, nivel)} del glosario a mano; nivel «N» = nombre propio
    o palabra que no se glosa, «ES» = palabra española."""
    global _GLOSS
    if _GLOSS is None:
        _GLOSS = {}
        p = os.path.join(ROOT, "tools", "pt", "bank", "glossario.py")
        if os.path.exists(p):
            g = getattr(_load(p, "glossario_pt"), "GLOSS", {})
            for k, v in g.items():
                if isinstance(v, (list, tuple)):
                    _GLOSS[k.lower()] = (v[0], v[1] if len(v) > 1 else "A2")
                else:
                    _GLOSS[k.lower()] = (v, "A2")
    return _GLOSS


def _plural_forms(word):
    """Plurales regulares, para reconocer una forma flexionada de un lema del
    banco que no trae su plural (adjetivos invariables, palabras)."""
    out = {word + "s"}
    if word.endswith("ão"):
        out |= {word[:-2] + "ões", word[:-2] + "ães", word[:-2] + "ãos"}
    elif word.endswith("m"):
        out.add(word[:-1] + "ns")
    elif word.endswith("l"):
        out.add(word[:-1] + "is")
    elif re.search(r"[rsz]$", word):
        out.add(word + "es")
    return out


def index():
    global _IDX
    if _IDX is not None:
        return _IDX
    import sillabo
    with open(os.path.join(ROOT, "docs", "lang", "pt", "data", "bank.json"), encoding="utf-8") as fh:
        bank = json.load(fh)
    idx = {}

    def put(form, lemma, level, gloss):
        form = str(form).lower().strip()
        if not form:
            return
        wk = LEVEL_WEEK.get(level, 19)
        if form not in idx or idx[form][1] > wk:
            idx[form] = (lemma, wk, gloss)

    for n in bank.get("nouns", []):
        put(n[0], n[0], n[5], n[3])
        put(n[2], n[0], n[5], n[3])
    for a in bank.get("adjectives", []):
        for f in a[:4]:
            put(f, a[0], a[5], a[4])
    for w in bank.get("words", []):
        put(w[0], w[0], w[3], w[1])
    verbs = {v[0]: v for v in bank.get("verbs", [])}
    try:
        lemmas = sillabo.lexicon().get("lemmas", {})
    except Exception:          # sin node: solo los infinitivos
        lemmas = {}
    for form, infs in lemmas.items():
        for inf in infs:
            v = verbs.get(inf)
            put(form, inf, v[5] if v else "A2", v[1] if v else "")
    for v in bank.get("verbs", []):
        put(v[0], v[0], v[5], v[1])
    for form, (gloss, level) in glossary().items():
        if level in ("N", "ES"):
            idx[form] = (form, 0 if level == "ES" else 1, gloss)
        elif form not in idx:
            put(form, form, level, gloss)
    _IDX = idx
    return idx


# Palabras gramaticales: no se glosan ni cuentan como vocabulario.
FUNCTION = set("""
a o as os um uma uns umas de do da dos das em no na nos nas num numa ao aos à às
pelo pela pelos pelas por para pra pro com sem sob sobre entre até desde e ou mas
que se não sim eu tu ele ela você nós vós eles elas vocês me te lhe lhes nos vos
meu minha meus minhas teu tua seu sua seus suas nosso nossa dele dela deles delas
este esta isto esse essa isso aquele aquela aquilo neste nesta nesse nessa naquele
é são há tem foi era
""".split())


def lemma_of(tok):
    """(lema, semana, glosa) o None."""
    idx = index()
    t = tok.lower().strip("-")
    if t in idx:
        return idx[t]
    # clíticos pegados con guion: chama-se, dá-lo, fazê-lo, dir-lhe-ei
    if "-" in t:
        base = t.split("-")[0]
        for cand in (base, base + "r", re.sub(r"[áâ]$", "ar", base), re.sub(r"[êé]$", "er", base),
                     re.sub(r"í$", "ir", base)):
            if cand in idx:
                return idx[cand]
    # derivados: -mente, diminutivos, superlativos
    for suf, reps in (("amente", ("o",)), ("mente", ("", "e")), ("zinho", ("",)), ("zinha", ("",)),
                      ("inho", ("o", "e")), ("inha", ("a", "e")), ("íssimo", ("o", "e")),
                      ("íssima", ("a", "e")), ("inhos", ("os",)), ("inhas", ("as",))):
        if t.endswith(suf) and len(t) > len(suf) + 2:
            for rep in reps:
                c = t[: -len(suf)] + rep
                if c in idx:
                    return idx[c]
    return None


def words_of(text):
    """Palabras de contenido de un texto portugués (sin nombres propios,
    números ni palabras gramaticales)."""
    out = []
    text = str(text or "").replace("’", "'")
    for m in re.finditer(r"[A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)*", text):
        raw = m.group(0)
        before = text[:m.start()].rstrip()
        sentence_start = not before or before[-1] in ".!?:–—-«\"(" or before.endswith("→")
        if raw[0].isupper() and not sentence_start:
            continue
        low = raw.lower()
        if low in FUNCTION or len(low) < 2:
            continue
        out.append(low)
    return out


def _strip(s):
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


# Correspondencias portugués → español para reconocer cognados
# transparentes (las del laboratorio Ponte, al revés).
_PONTE = [
    (r"ção$", "ción"), (r"ções$", "ciones"), (r"dade$", "dad"), (r"vel$", "ble"),
    (r"agem$", "aje"), (r"ência$", "encia"), (r"ância$", "ancia"), (r"ês$", "és"),
    (r"nh", "ñ"), (r"lh", "ll"), (r"ss", "s"), (r"ç", "z"), (r"mente$", "mente"),
]


def is_cognate(pt, es_gloss):
    """True si la palabra portuguesa se entiende sola desde el español."""
    if not pt or not es_gloss:
        return False
    a = _strip(pt.lower())
    cands = [_strip(x.strip().lower()) for x in re.split(r"[/;,()]", es_gloss) if x.strip()]
    forms = {a}
    b = pt.lower()
    for pat, rep in _PONTE:
        b = re.sub(pat, rep, b)
    forms.add(_strip(b))
    for c in cands:
        for f in forms:
            if f == c:
                return True
            # una letra de diferencia en palabras de 5 o más letras
            if len(f) >= 5 and len(c) >= 5 and abs(len(f) - len(c)) <= 1:
                diff = sum(1 for x, y in zip(f, c) if x != y) + abs(len(f) - len(c))
                if diff <= 1:
                    return True
    return False


def gloss_table(texts):
    """forma → [lema, español, semana] de cada palabra portuguesa de los
    textos, para el glosario de tocar y ver."""
    out = {}
    for text in texts:
        for tok in words_of(text):
            if tok in out:
                continue
            lm = lemma_of(tok)
            if lm and lm[2] and lm[1] > 0:
                cognate = is_cognate(lm[0], lm[2]) or is_cognate(tok, lm[2])
                out[tok] = [lm[0], lm[2], 1 if cognate else lm[1]]
    return out
