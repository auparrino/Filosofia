#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Controla la serie de escucha «Radio» (tools/it/radio/wNN.json) contra el curso.

    python3 tools/it/check_radio.py            todas (informe de las que fallan)
    python3 tools/it/check_radio.py 14         una semana, con detalle

Nada antes de su teoría, como las lecturas (check_letture.py): en el guion
de la semana N (y, desde la 14, en las preguntas en italiano) la gramática
no pasa de la semana N (sillabo.py) y las palabras que no están glosadas son
conocidas en la semana N (lessico.py, más las palabras de la semana de
course.json hasta la N): a lo sumo tres desconocidas sin glosa, sin contar
los nombres propios.  El largo, las voces, las preguntas y
las palabras de la semana los controla tools/lib/test_radio.js.
"""
import glob
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import lessico  # noqa: E402
import sillabo  # noqa: E402

MAX_UNKNOWN = 3


def episodes():
    for f in sorted(glob.glob(os.path.join(HERE, "radio", "w[0-9][0-9].json"))):
        with open(f, encoding="utf-8") as fh:
            yield json.load(fh)


def meta_text(ep, meta_from):
    """What the learner reads in Italian besides the script: the questions
    and the «lo dice?» statements from week meta_from on."""
    if ep["week"] < meta_from:
        return ""
    out = []
    for q in ep.get("questions", []):
        out.append(q[0])
        out += q[1]
    out += [v[0] for v in ep.get("info", [])]
    return "\n".join(out)


def main():
    only = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    serie = json.load(open(os.path.join(HERE, "radio", "serie.json"), encoding="utf-8"))
    course = json.load(open(os.path.join(ROOT, "docs/lang/it/data/course.json"), encoding="utf-8"))
    seen = lessico.lesson_words(course)
    stems = {}
    # the words of the week (the «Palabras de la semana» mission) count from their week
    for w in course["weeks"]:
        for v in w.get("vocab", []):
            for form in v[0].lower().split("/"):
                form = form.strip()
                lm = lessico.lemma_of(form)
                for k in {form, lm[0] if lm else form}:
                    seen[k] = min(seen.get(k, 99), w["week"])
                # a verb of the week in any form: capit-ava, ripass-ato
                m = re.match(r"^([a-zà-ù]{3,}?)(are|ere|ire)(si)?$", form)
                if m:
                    stems[m.group(1)] = min(stems.get(m.group(1), 99), w["week"])
    bad = n = 0
    for ep in episodes():
        week = ep["week"]
        if only and week != only:
            continue
        n += 1
        script = "\n".join(t[1] for t in ep["turns"])
        text = script + "\n" + meta_text(ep, serie["metaFrom"])
        feats = sillabo.analyze(text, answer=False)
        late = {k: v for k, v in feats.items() if v > week}
        gloss = {k.lower() for k in ep.get("gloss", {})}
        gloss_toks = set()
        for g in gloss:
            gloss_toks |= set(lessico.words_of(g)) | {g}
        toks = lessico.words_of(text)
        names = {w.lower() for w in re.findall(r"(?<![.!?\n] )(?<!^)\b([A-ZÀ-Ý][a-zà-ÿ]+)", text)}
        names |= {s.split(",")[0].split(" ")[0].lower() for s in ep["speakers"]}
        unknown = []
        for t in toks:
            if t in gloss_toks or t.split("'")[-1] in gloss_toks or t in names:
                continue
            wk, lemma = lessico.word_week(t, seen)
            if wk > week and any(t.startswith(st) and len(t) - len(st) <= 6 and sw <= week for st, sw in stems.items()):
                wk = week
            if wk > week:
                unknown.append(t)
        cover = 1 - len(unknown) / max(1, len(toks))
        ok = not late and len(set(unknown)) <= MAX_UNKNOWN
        bad += not ok
        if not ok or only:
            print("w%02d  %3d palabras  cobertura %.0f%%  %s%s" % (
                week, len(script.split()), cover * 100,
                ("gramática tardía: %s  " % late) if late else "",
                ("desconocidas: %s" % " ".join(sorted(set(unknown)))) if unknown else ""))
            if only:
                print("     gramática: %s" % feats)
    print("episodios de la radio con problemas: %d de %d" % (bad, n))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
