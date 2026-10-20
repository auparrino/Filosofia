#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Controla la ruta «Per il lavoro» (docs/lang/it/trabajo_data.js) contra el curso.

    python3 tools/it/check_trabajo.py                 todas las escenas
    python3 tools/it/check_trabajo.py t-telefono      una, con detalle
    python3 tools/it/check_trabajo.py --json f.json   escenas sueltas (una lista
                                                      o una escena), para quien escribe

Nada antes de su teoría (CONTENIDO.md), como la radio y las lecturas: en la
escena de la semana N la gramática no pasa de la semana N (sillabo.py), ni
en lo que se lee (el diálogo) ni en lo que se escribe (las frases, las
respuestas de los ítems y el modelo de la tarea).  Las palabras:
  - el diálogo se lee: a lo sumo tres desconocidas en la semana N
    (lessico.py y las palabras de la semana de course.json) sin glosa, sin
    contar los nombres propios ni las palabras que la escena enseña en sus
    frases;
  - lo que el alumno escribe (la respuesta principal de cada ítem) usa
    palabras conocidas o enseñadas en la escena (frases, diálogo, glosas):
    ninguna desconocida;
  - el modelo de la tarea, a lo sumo tres desconocidas.
La forma (campos, cantidades, ids, tipos de ítem) la controla
tools/lib/test_trabajo.js.
"""
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import lessico  # noqa: E402
import sillabo  # noqa: E402

MAX_UNKNOWN = 3


def scenes(path=None):
    if path:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
        return data if isinstance(data, list) else data.get("SCENES", [data])
    js = ("var vm = require('vm'), fs = require('fs'), ctx = {window: {}};"
          "vm.runInNewContext(fs.readFileSync(%r, 'utf8'), ctx);"
          "console.log(JSON.stringify(ctx.window.TRABAJO_DATA.SCENES))") % os.path.join(
              ROOT, "docs/lang/it/trabajo_data.js")
    return json.loads(subprocess.check_output(["node", "-e", js]))


def known_words(course):
    seen = lessico.lesson_words(course)
    stems = {}
    for w in course["weeks"]:
        for v in w.get("vocab", []):
            for form in v[0].lower().split("/"):
                form = form.strip()
                lm = lessico.lemma_of(form)
                for k in {form, lm[0] if lm else form}:
                    seen[k] = min(seen.get(k, 99), w["week"])
                m = re.match(r"^([a-zà-ù]{3,}?)(are|ere|ire)(si)?$", form)
                if m:
                    stems[m.group(1)] = min(stems.get(m.group(1), 99), w["week"])
    return seen, stems


def strip_marks(s):
    return str(s or "").replace("*", "")


def item_answers(it):
    out = [it.get("answer", "")] + list(it.get("accept", []) or [])
    return [strip_marks(a) for a in out if a]


def main():
    args = sys.argv[1:]
    path = None
    if args and args[0] == "--json":
        path, args = args[1], args[2:]
    only = args[0] if args else ""
    course = json.load(open(os.path.join(ROOT, "docs/lang/it/data/course.json"), encoding="utf-8"))
    seen, stems = known_words(course)

    def unknown_in(text, week, allowed):
        toks = lessico.words_of(text)
        names = {w.lower() for w in re.findall(r"(?<![.!?\n] )(?<!^)\b([A-ZÀ-Ý][a-zà-ÿ]+)", text)}
        out = []
        for t in toks:
            if t in allowed or t.split("'")[-1] in allowed or t in names:
                continue
            wk, _ = lessico.word_week(t, seen)
            if wk > week and any(t.startswith(st) and len(t) - len(st) <= 6 and sw <= week
                                 for st, sw in stems.items()):
                wk = week
            if wk > week:
                out.append(t)
        return out, toks

    bad = n = 0
    for sc in scenes(path):
        if only and sc["id"] != only:
            continue
        n += 1
        week = sc["week"]
        problems = []
        speakers = {d[0].lower() for d in sc.get("dialogo", [])}
        dialog = "\n".join(d[1] for d in sc.get("dialogo", []))
        phrases = "\n".join(p[0] for p in sc.get("phrases", []))
        answers = "\n".join(a for it in sc.get("items", []) for a in item_answers(it))
        # the words: only the main answer (the accepted variants may say it otherwise)
        main = "\n".join(strip_marks(it.get("answer", "")) for it in sc.get("items", []))
        model = strip_marks((sc.get("compito") or {}).get("model", ""))
        # grammar: read (the dialogue) and written (phrases, answers, model)
        for label, text, ans in (("diálogo", dialog, False), ("frases", phrases, True),
                                 ("respuestas", answers, True), ("modelo", model, True)):
            late = {k: v for k, v in sillabo.analyze(text, answer=ans).items() if v > week}
            if late:
                problems.append("gramática tardía en %s: %s" % (label, late))
        # words
        gloss = set()
        for g in sc.get("gloss", {}):
            gloss |= set(lessico.words_of(g)) | {g.lower()}
        taught = set(lessico.words_of(phrases)) | gloss | speakers
        unk, toks = unknown_in(dialog, week, taught)
        if len(set(unk)) > MAX_UNKNOWN:
            problems.append("diálogo: desconocidas sin glosa: %s" % " ".join(sorted(set(unk))))
        unk_a, _ = unknown_in(main, week, taught | set(lessico.words_of(dialog)))
        if unk_a:
            problems.append("respuestas con palabras que la escena no enseña: %s" % " ".join(sorted(set(unk_a))))
        unk_m, _ = unknown_in(model, week, taught | set(lessico.words_of(dialog)))
        if len(set(unk_m)) > MAX_UNKNOWN:
            problems.append("modelo: desconocidas: %s" % " ".join(sorted(set(unk_m))))
        bad += bool(problems)
        if problems or only:
            cover = 1 - len(unk) / max(1, len(toks))
            print("%-16s sem %2d  diálogo %3d palabras, cobertura %.0f%%" % (sc["id"], week, len(toks), cover * 100))
            for p in problems:
                print("    " + p)
            if only:
                print("    gramática del diálogo: %s" % sillabo.analyze(dialog))
                print("    gramática de lo escrito: %s" % sillabo.analyze(phrases + "\n" + answers + "\n" + model, answer=True))
    print("escenas de trabajo con problemas: %d de %d" % (bad, n))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
