# -*- coding: utf-8 -*-
"""Qué tiempos verbales usa un texto portugués, y desde qué semana se puede
pedir.

El léxico de formas lo genera el conjugador (tools/forms_lexicon.js): cada
forma → los tiempos que puede expresar.  Una forma ambigua (falamos es
presente y perfeito; falar es infinitivo y futuro do subjuntivo) cuenta por
el tiempo más temprano que puede ser, así el control nunca falla por una
lectura rebuscada.  build_course.py lo usa para advertir, no para mover
ejercicios: los ítems de autor ya declaran su semana («w»).
"""
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from curriculo import TENSE_WEEK

_LEX = None


def lexicon():
    global _LEX
    if _LEX is None:
        out = subprocess.run(["node", os.path.join(ROOT, "tools", "pt", "forms_lexicon.js")],
                             check=True, capture_output=True, text=True).stdout
        _LEX = json.loads(out)
    return _LEX


# Formas que el alumno conoce desde la semana 1 aunque sean de un tiempo
# posterior o irregulares: saludos y fórmulas.
FIXED = {"chamo", "chama", "chamas", "gosto", "gosta", "gostaria", "obrigado", "obrigada",
         "tudo", "bem", "prazer", "desculpe", "desculpa", "licença", "tchau", "oi", "olá",
         # expresiones fijas y formas que casi siempre son otra cosa
         # (sustantivos, contracciones): tomara que, há, deste, o trabalho
         "tomara", "oxalá", "há", "deste", "desse", "neste", "nesse", "casa", "trabalho",
         "passeio", "mate", "vira", "quer", "queres", "viras"}


_IMP = None


def _imperatives():
    global _IMP
    if _IMP is None:
        _IMP = set(lexicon().get("imperatives", []))
    return _IMP


def tokens(text):
    return re.findall(r"[a-zà-úç]+", str(text or "").lower())


def tense_weeks(text):
    """{tiempo: semana} de los tiempos que el texto necesita, leyendo cada
    forma por su lectura más temprana."""
    lex = lexicon()
    simple = lex.get("simple", {})
    out = {}
    for tok in tokens(text):
        if tok in FIXED:
            continue
        ts = [t for t in simple.get(tok, []) if t in TENSE_WEEK]
        if not ts:
            continue
        # falar es infinitivo antes que futuro do subjuntivo o infinitivo
        # pessoal; fale / vá, imperativo desde la semana 12
        if tok in lex.get("lemmas", {}).get(tok, []):
            continue
        if tok in _imperatives() and "subjPresente" in ts:
            ts = [t for t in ts if t != "subjPresente"] + ["imperativo"]
        t = min(ts, key=lambda x: TENSE_WEEK[x])
        wk = TENSE_WEEK[t]
        # ser, estar y ter en presente se enseñan en la semana 1
        if t == "presente" and set(lex.get("lemmas", {}).get(tok, [])) & {"ser", "estar", "ter"}:
            wk = 1
        out[t] = min(out.get(t, 99), wk) if t in out else wk
    return out


def min_week(item):
    """La primera semana en que la respuesta del ítem usa solo tiempos
    enseñados (el enunciado se lee: el presente vale siempre)."""
    ans = " ".join([str(item.get("answer") or "")] + [str(a) for a in item.get("alt") or []][:1])
    feats = tense_weeks(ans)
    return max(feats.values()) if feats else 1, feats
