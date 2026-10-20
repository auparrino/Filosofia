# -*- coding: utf-8 -*-
"""El curso de filosofía: las estaciones y las semanas (tools/curso/semanas/wNN.py).

Datos puros.  Cada semana es un módulo con WEEK = {...}; los ejercicios se
arman con funciones chicas (q, ch, cz, ty) que devuelven dicts con el
esquema del curso.  Cualquier texto puede ser un str (castellano) o
{"es": …, "it": …, "pt": …, "de": …}: lo resuelve build_course.py.

Toda cita lleva su fuente (obra y pasaje) en la nota del ejercicio o en el
ejemplo; las que circulan pero no están en el autor se marcan «apócrifa».
"""
import glob
import importlib.util
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from ej import ch, cz, q, ty  # noqa: E402,F401  (las semanas los importan de ej)


import temario  # noqa: E402

# Las estaciones: de a 13 semanas, la última de cada una es de examen.  El
# temario (tools/curso/temario.py) sale de comparar los planes de estudio
# de las carreras de Filosofía (UBA, UNLP, UNC, Complutense, Bologna, USP,
# FU Berlin, Oxford; ver PLAN.md) y de sumar las tradiciones no
# occidentales en su momento.
NWEEKS = len(temario.TEMARIO)
SEASONS = [{"n": n, "name": name, "weeks": [13 * (n - 1) + 1, min(13 * n, NWEEKS)], "level": "Nivel %d" % n,
            "blurb": "; ".join(t["title"] for t in temario.TEMARIO[13 * (n - 1):13 * n - 1]) + "."}
           for n, name in temario.SEASON_NAMES]

# Las épocas: la estética de la app avanza con la historia (data-era en
# <html>, docs/lang/<edición>/theme.css).  Cada semana cae en una.
ERAS = [
    {"n": 1, "id": "antigua", "name": "El ágora", "weeks": [1, 19]},
    {"n": 2, "id": "romana", "name": "La stoa", "weeks": [20, 26]},
    {"n": 3, "id": "medieval", "name": "El scriptorium", "weeks": [27, 39]},
    {"n": 4, "id": "moderna", "name": "El taller del Renacimiento", "weeks": [40, 52]},
    {"n": 5, "id": "ilustrada", "name": "El salón", "weeks": [53, 66]},
    {"n": 6, "id": "industrial", "name": "La imprenta de vapor", "weeks": [67, 78]},
    {"n": 7, "id": "vanguardia", "name": "La vanguardia", "weeks": [79, 91]},
    {"n": 8, "id": "hoy", "name": "La red", "weeks": [92, NWEEKS]},
]
EXAMS = [t["n"] for t in temario.TEMARIO if t["exam"]]


def era_of(week):
    for e in ERAS:
        if e["weeks"][0] <= week <= e["weeks"][1]:
            return e["n"]
    raise ValueError("semana sin época: %d" % week)


def season_of(week):
    for s in SEASONS:
        if s["weeks"][0] <= week <= s["weeks"][1]:
            return s["n"]
    raise ValueError("semana sin estación: %d" % week)


def _load():
    """The authored weeks (semanas/wNN.py).  WEEKS: those that go in the
    course, every week of the syllabus that is not an exam, in order from
    week 1 and up to the first that is not written yet; WRITTEN: all the
    written ones (the ones after a gap are checked too, but they wait)."""
    weeks = {}
    for f in sorted(glob.glob(os.path.join(HERE, "semanas", "w[0-9][0-9]*.py"))):
        spec = importlib.util.spec_from_file_location("semana_" + os.path.basename(f)[:-3], f)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        weeks[mod.WEEK["week"]] = mod.WEEK
    out = []
    for t in temario.TEMARIO:
        if t["exam"]:
            continue
        if t["n"] not in weeks:
            break
        out.append(weeks[t["n"]])
    return out, [weeks[n] for n in sorted(weeks)]


WEEKS, WRITTEN = _load()
