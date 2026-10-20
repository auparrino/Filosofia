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


# Las cuatro estaciones, como en la carrera (antigua, medieval y moderna,
# de Kant al siglo XX, contemporánea): el temario sale de comparar los
# planes de estudio de UBA, UNLP, UNC, Complutense, Bologna, USP, FU Berlin
# y Oxford (ver PLAN.md).
SEASONS = [
    {"n": 1, "name": "La Antigüedad", "weeks": [1, 13], "level": "Nivel 1",
     "blurb": "Del mito al logos: los presocráticos, Sócrates, Platón, Aristóteles y los helenísticos. "
              "Y las herramientas para leer y armar un argumento."},
    {"n": 2, "name": "Del Medioevo a la Modernidad", "weeks": [14, 26], "level": "Nivel 2",
     "blurb": "De Agustín a Hume: fe y razón, los universales, la ciencia nueva, el Estado moderno, la duda y la experiencia."},
    {"n": 3, "name": "De Kant al siglo XX", "weeks": [27, 39], "level": "Nivel 3",
     "blurb": "Kant, Hegel, Marx, Nietzsche, el utilitarismo, el giro lingüístico, la fenomenología y Heidegger."},
    {"n": 4, "name": "La filosofía de hoy", "weeks": [40, 52], "level": "Nivel 4",
     "blurb": "Los problemas abiertos: el lenguaje, la ciencia, la mente, la justicia, el feminismo, el pensamiento argentino y latinoamericano, la técnica."},
]

# Las épocas: la estética de la app avanza con la historia (data-era en
# <html>, docs/lang/<edición>/theme.css).  Cada semana cae en una.
ERAS = [
    {"n": 1, "id": "antigua", "name": "El ágora", "weeks": [1, 13]},
    {"n": 2, "id": "medieval", "name": "El scriptorium", "weeks": [14, 18]},
    {"n": 3, "id": "moderna", "name": "El taller del Renacimiento", "weeks": [19, 26]},
    {"n": 4, "id": "ilustrada", "name": "El salón", "weeks": [27, 33]},
    {"n": 5, "id": "vanguardia", "name": "La vanguardia", "weeks": [34, 45]},
    {"n": 6, "id": "hoy", "name": "La red", "weeks": [46, 52]},
]


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
    weeks = []
    for f in sorted(glob.glob(os.path.join(HERE, "semanas", "w[0-9][0-9].py"))):
        spec = importlib.util.spec_from_file_location("semana_" + os.path.basename(f)[:-3], f)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        weeks.append(mod.WEEK)
    weeks.sort(key=lambda w: w["week"])
    for k, w in enumerate(weeks, 1):
        if w["week"] != k:
            raise SystemExit("las semanas tienen que ir seguidas desde la 1: falta la %d" % k)
    return weeks


WEEKS = _load()
