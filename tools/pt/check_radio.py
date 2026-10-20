#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Controla la serie de escucha «Rádio» (tools/pt/radio/wNN.json) contra el curso.

    python3 tools/pt/check_radio.py            todas (informe de las que fallan)
    python3 tools/pt/check_radio.py 14         una semana, con detalle

Nada antes de su teoría, con el mismo análisis que las lecturas semanales
(check_letture.py: grammar, Lexicon): en el guion de la semana N (y, desde
la 14, en las preguntas en portugués) la gramática no pasa de la semana N y
hay a lo sumo tres palabras desconocidas sin glosa (sin contar nombres
propios; las palabras de la semana de course.json cuentan desde su semana).  Una palabra glosada en una lectura semanal o en un episodio
anterior cuenta como vista.  Las marcas del habla brasileña van con su
semana: *tá* / *tô* desde la 8 (estar + gerúndio) y *pra* / *pro* desde la 9
(ir para).  El largo, las voces, las preguntas y las palabras de la semana
los controla tools/lib/test_radio.js.
"""
import glob
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import check_letture as cl  # noqa: E402

MAX_UNKNOWN = 3
# Lo coloquial que se enseña con su semana (lessons/s1.py).
# Sustantivos que coinciden con una forma verbal (el telefone, a banda).
NOT_VERBS = {"telefone", "banda"}
HABLA = {"tá": 8, "tô": 8, "tamo": 8, "pra": 9, "pro": 9, "pros": 9, "pras": 9, "né": 8}


def episodes():
    for f in sorted(glob.glob(os.path.join(HERE, "radio", "w[0-9][0-9].json"))):
        with open(f, encoding="utf-8") as fh:
            yield json.load(fh)


def meta_text(ep, meta_from):
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
    lex = cl.Lexicon()
    cl.NOT_VERBS.update(NOT_VERBS)
    # the words of the week (the «Palabras de la semana» mission) count from their week
    course = json.load(open(os.path.join(ROOT, "docs/lang/pt/data/course.json"), encoding="utf-8"))
    vocab, stems = {}, {}
    for w in course["weeks"]:
        for v in w.get("vocab", []):
            for form in v[0].lower().split("/"):
                for t in cl.words(form):
                    vocab[t] = min(vocab.get(t, 99), w["week"])
                # a verb of the week in any form: pechinch-ei, embrulh-ou
                m = re.match(r"^([a-zà-ú]{3,}?)(ar|er|ir)(-se)?$", form.strip())
                if m:
                    stems[m.group(1)] = min(stems.get(m.group(1), 99), w["week"])
    seen_gloss = {}
    for t in cl.testi():
        for g in t.get("gloss", {}):
            for c in cl.lemma_candidates(g.lower()) | lex.verb_of.get(g.lower(), set()):
                seen_gloss[c] = min(seen_gloss.get(c, 99), t["week"])
    bad = n = 0
    for ep in episodes():
        week = ep["week"]
        script = "\n".join(t[1] for t in ep["turns"])
        text = script + "\n" + meta_text(ep, serie["metaFrom"])
        probs = []
        feats = cl.grammar(text, lex)
        late = {k: v for k, v in feats.items() if v > week}
        toks = cl.words(text)
        for t in toks:
            if HABLA.get(t, 0) > week:
                late["habla: " + t] = HABLA[t]
        if late:
            probs.append("gramática tardía: " + ", ".join("%s (sem. %d)" % kv for kv in sorted(late.items())))
        gloss = {k.lower() for k in ep.get("gloss", {})}
        gtoks = set()
        for g in gloss:
            gtoks |= set(cl.words(g))
        here = set()
        for g in gtoks:
            here |= cl.lemma_candidates(g) | lex.verb_of.get(g, set())
        names = cl.names_in(text) | {s.split(",")[0].split(" ")[0].lower() for s in ep["speakers"]}
        unknown = []
        for t in toks:
            if t in gtoks or t in names or t in cl.FOREIGN or t in HABLA:
                continue
            parts = t.split("-")
            if len(parts) > 1 and all(p in gtoks or lex.week_of(p) <= week or seen_gloss.get(p, 99) < week or
                                      p in ("o", "a", "os", "as", "lo", "la", "los", "las", "no", "na",
                                            "lhe", "lhes", "me", "te", "se", "nos") for p in parts):
                continue
            if lex.week_of(t) <= week or seen_gloss.get(t, 99) < week:
                continue
            cands = cl.lemma_candidates(t) | lex.verb_of.get(t, set())
            if any(vocab.get(c, 99) <= week for c in cands | {t}):
                continue
            if any(t.startswith(st) and len(t) - len(st) <= 6 and sw <= week for st, sw in stems.items()):
                continue
            if any(seen_gloss.get(c, 99) < week or c in here for c in cands):
                continue
            unknown.append(t)
        unk = sorted(set(unknown))
        if len(unk) > MAX_UNKNOWN:
            probs.append("%d desconocidas sin glosa: %s" % (len(unk), " ".join(unk)))
        for g in gtoks:
            for c in cl.lemma_candidates(g) | lex.verb_of.get(g, set()):
                seen_gloss[c] = min(seen_gloss.get(c, 99), week)
        if only and week != only:
            continue
        n += 1
        bad += bool(probs)
        if probs or only:
            print("w%02d  %3d palabras  %s" % (week, len(cl.words(script)), "OK" if not probs else ""))
            for p in probs:
                print("     " + p)
            if only:
                print("     gramática: " + ", ".join("%s %d" % kv for kv in sorted(feats.items(), key=lambda x: -x[1])))
                if unk:
                    print("     desconocidas: " + " ".join(unk))
    print("episodios de la rádio con problemas: %d de %d" % (bad, n))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
