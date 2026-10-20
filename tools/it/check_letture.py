#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Controla las lecturas (docs/lang/it/letture_data.js y letture_settimana.js) contra el curso.

    python3 tools/it/check_letture.py            todas
    python3 tools/it/check_letture.py w-         solo las que empiezan con «w-»

Para cada texto: la gramática que usa (tools/sillabo.py) no pasa de la
semana en que se abre, y las palabras que no están en el glosario del texto
son conocidas en esa semana (tools/lessico.py): a lo sumo tres
desconocidas sin glosa, sin contar los nombres propios.
"""
import json
import re
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import lessico  # noqa: E402
import sillabo  # noqa: E402


def episodes():
    # Los textos salen de LETTURE_DATA (docs/lang/it/letture_data.js) más «La
    # settimana» (letture_settimana.js), tal como los junta el núcleo
    # (docs/js/letture.js): se cargan con tools/lib/pack.js.
    js = ("var ctx = require(%r)('it', { upTo: 'letture.js', includeStop: true });"
          "console.log(JSON.stringify(ctx.Letture.EPISODI))") % os.path.join(ROOT, "tools/lib/pack.js")
    return json.loads(subprocess.check_output(["node", "-e", js]))


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else ""
    course = json.load(open(os.path.join(ROOT, "docs/lang/it/data/course.json"), encoding="utf-8"))
    seen = lessico.lesson_words(course)
    bad = 0
    for ep in episodes():
        if not ep["id"].startswith(only):
            continue
        week = ep["week"]
        feats = sillabo.analyze(ep["text"], answer=False)
        late = {k: v for k, v in feats.items() if v > week}
        gloss = set(ep.get("gloss", {}))
        toks = lessico.words_of(ep["text"])
        # a name (Martín, Bologna) is written with a capital inside the sentence
        names = {w.lower() for w in re.findall(r"(?<![.!?\n] )(?<!^)\b([A-ZÀ-Ý][a-zà-ÿ]+)", ep["text"])}
        unknown = []
        for t in toks:
            if t in gloss or t.split("'")[-1] in gloss or t in names:
                continue
            wk, lemma = lessico.word_week(t, seen)
            if wk > week:
                unknown.append(t)
        cover = 1 - len(unknown) / max(1, len(toks))
        ok = not late and len(set(unknown)) <= 3
        bad += (not ok) and ep["id"].startswith(only or "w-")
        if not ok or only:
            print("%-16s sem %2d  %3d palabras  cobertura %.0f%%  %s%s" % (
                ep["id"], week, len(toks), cover * 100,
                ("gramática tardía: %s  " % late) if late else "",
                ("desconocidas: %s" % " ".join(sorted(set(unknown)))) if unknown else ""))
    print("lecturas nuevas (w-) con problemas: %d" % bad)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
