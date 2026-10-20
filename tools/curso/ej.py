# -*- coding: utf-8 -*-
"""Los ejercicios del curso: funciones chicas que devuelven dicts con su esquema.

Las usan las semanas (tools/curso/semanas/wNN.py): from ej import q, ch, cz, ty
"""


def q(prompt, answer, options, stem=None):
    """A check inside a lesson block."""
    d = {"prompt": prompt, "answer": answer, "options": list(options)}
    if stem:
        d["stem"] = stem
    return d


def _acc(answer, accept):
    acc = list(accept or [])
    if answer not in acc:
        acc.insert(0, answer)
    return acc


def ch(part, prompt, stem, answer, options, note=""):
    """Choose one: who said it, which school, valid or not…"""
    return {"type": "choice", "part": part, "prompt": prompt, "stem": stem,
            "answer": answer, "options": list(options), "note": note}


def cz(part, prompt, stem, answer, accept=None, note=""):
    """Fill the gap (___) with the concept."""
    return {"type": "cloze", "part": part, "prompt": prompt, "stem": stem,
            "answer": answer, "accept": _acc(answer, accept), "note": note}


def ty(part, prompt, stem, answer, accept=None, note=""):
    """Write a short answer: a name, a term."""
    return {"type": "typed", "part": part, "prompt": prompt, "stem": stem,
            "answer": answer, "accept": _acc(answer, accept), "note": note}
