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


# ---------------------------------------------------------------- formato híbrido
# Lo diario (la lección, los ejercicios, los conceptos) va arriba.  Lo
# semanal es el seminario: un texto en tramos, preguntas abiertas, el mapa
# del argumento y un escrito propio con devolución (de la IA socrática o de
# la rúbrica).  Los dilemas son casos sin respuesta correcta.

def ap(item):
    """Mark an exercise as one of application or analysis (not of
    recall): which premise, which fallacy, which objection hits a thesis.
    The research says these are the ones that train thinking (FORMATO.md)."""
    item["apl"] = True
    return item


def tramo(texto, preguntas, glosas=None, chequeo=None):
    """A section of the text of the seminar (100 to 250 words): open
    questions about it, glosses of hard words, and an optional closed check
    of comprehension, made with q(...)."""
    d = {"texto": texto, "preguntas": list(preguntas), "glosas": [list(g) for g in (glosas or [])]}
    if chequeo:
        d["chequeo"] = chequeo
    return d


def mapa(conclusion, premisas, objecion, replica, implicita=None):
    """The map of the central argument of the text: the conclusion, its
    premises (in order), the strongest objection and a reply.  implicita:
    the premise the author does not say, if there is one."""
    d = {"conclusion": conclusion, "premisas": list(premisas), "objecion": objecion, "replica": replica}
    if implicita:
        d["implicita"] = implicita
    return d


def seminario(autor, obra, pasaje, derechos, contexto, tramos, mapa_, consigna, rubrica, modelo, socraticas,
              traduccion="propia", palabras=(150, 300)):
    """The weekly seminar.
    derechos: "dp" (public domain: the text may be quoted in full, in our own
    translation) or "breve" (the author died less than 70 years ago: only
    short quotations, the rest summarised in our words, said so in the text).
    socraticas: the questions of the Socratic tutor (the AI uses them as a
    guide and never gives the answer; without AI the app shows them one by one).
    modelo: an answer of reference to the writing task, shown after writing."""
    assert derechos in ("dp", "breve")
    return {"autor": autor, "obra": obra, "pasaje": pasaje, "derechos": derechos, "traduccion": traduccion,
            "contexto": contexto, "tramos": list(tramos), "mapa": mapa_,
            "escribir": {"consigna": consigna, "palabras": list(palabras), "rubrica": list(rubrica), "modelo": modelo},
            "socraticas": list(socraticas)}


def opcion(texto, escuela, porque, objecion):
    """One position in a dilemma: who would hold it, why, and the strongest objection."""
    return {"texto": texto, "escuela": escuela, "porque": porque, "objecion": objecion}


def dilema(caso, pregunta, opciones, despues=""):
    """A case with no right answer: the learner takes a position and the app
    shows who else holds it and the objection it has to answer.  despues:
    a twist of the case that tests the consistency of the choice."""
    return {"caso": caso, "pregunta": pregunta, "opciones": list(opciones), "despues": despues}
