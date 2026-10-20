#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Controlla le lezioni senza ricompilare il corso.

    python3 tools/check_lessons.py              tutte
    python3 tools/check_lessons.py s1           solo tools/lessons/s1.py
    python3 tools/check_lessons.py --estilo s2  además, el estilo de la lección en pasos

Per ogni settimana: formato (regola corta, limiti di parole, tabelle) e gli
esempi italiani che usano tempi o costruzioni che arrivano più avanti
(tools/sillabo.py).  I blocchi il cui titolo comincia con «Adelanto» possono
anticipare.
"""
import importlib.util
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import build_course  # noqa: E402
import sillabo       # noqa: E402


# The style of the lesson in steps (Mirá → regla → tabla → trampa): every
# block shows examples, the rule fits in one or two lines, and each example
# marks with *…* the form it teaches.
MAX_RULE = 22


def style(week, lesson):
    bad = []
    for i, b in enumerate(lesson.get("blocks", []), 1):
        where = "settimana %s blocco %d «%s»" % (week, i, b.get("h", ""))
        ex = b.get("ex") or []
        if len(ex) < 2:
            bad.append(where + ": menos de 2 ejemplos")
        words = len(re.sub(r"[*]", "", b.get("r", "")).split())
        if words > MAX_RULE:
            bad.append(where + ": regla de %d palabras (máx. %d)" % (words, MAX_RULE))
        for pair in ex:
            if not re.search(r"\*[^*]+\*", pair[0]):
                bad.append(where + ": ejemplo sin forma marcada: «%s»" % pair[0])
            if pair[0].count("*") % 2:
                bad.append(where + ": asteriscos desparejos: «%s»" % pair[0])
    return bad


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    estilo = "--estilo" in sys.argv
    only = args[0] if args else None
    folder = os.path.join(HERE, "lessons")
    problems = []
    # the blocks other modules add to a week (lessons/c1_extra.py) are
    # checked with the lesson they join
    extra, _pins = build_course.extra_blocks(folder)
    for fn in sorted(os.listdir(folder)):
        if not fn.endswith(".py") or fn == "__init__.py":
            continue
        if only and fn[:-3] != only:
            continue
        spec = importlib.util.spec_from_file_location(fn[:-3], os.path.join(folder, fn))
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        for week, lesson in sorted(getattr(mod, "LESSONS", {}).items()):
            lesson = build_course.merge_extra_blocks({week: lesson}, folder)[week] if week in extra else lesson
            problems += build_course.check_lesson(week, lesson)
            if estilo:
                problems += style(week, lesson)
            for i, b in enumerate(lesson.get("blocks", []), 1):
                if (b.get("h") or "").startswith("Adelanto"):
                    continue
                for pair in b.get("ex", []):
                    feats = sillabo.analyze(re.sub(r"\*", "", pair[0]))
                    late = {k: v for k, v in feats.items() if v > week}
                    if late:
                        problems.append("settimana %s blocco %d: «%s» usa %s"
                                        % (week, i, pair[0], late))
    for p in problems:
        print(p)
    print("problemi: %d" % len(problems))
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
