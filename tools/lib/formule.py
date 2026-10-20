#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fórmulas fijas: las frases de conversación que usan gramática de una
semana posterior a la de su escena.

Aprender una fórmula entera antes que su gramática está bien (Myles, Hooper
& Mitchell 1998; Boers & Lindstromberg 2012), siempre que se diga que es una
fórmula y que después se la una con su regla.  Este script mira cada frase
con el sillabo de su idioma (tools/<código>/sillabo.py: los tiempos y
construcciones que usa la respuesta y la semana en que se enseñan) y guarda,
para las que se adelantan, qué forma se adelanta y en qué semana llega:

    docs/lang/<código>/formule_data.js   → window.FORMULE_DATA

    { "frase:salva:3": [[11, "ho capito"]], … }   (semana, formas)

El núcleo (docs/js/formule.js) lo usa para la línea «🧱 Fórmula fija» de la
tarjeta y del «Adiviná», y para el bloque «Ya lo venías usando» de la
lección de esa semana.

    python3 tools/lib/formule.py          los dos idiomas
    python3 tools/lib/formule.py pt       uno
"""
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def phrases(code):
    js = ("var p=require('./tools/lib/pack.js')(%r,{upTo:'frasi.js',includeStop:true});"
          "console.log(JSON.stringify(p.Frasi.ALL.map(function(f){return [f.id,f.t,f.week||1];})))") % code
    out = subprocess.run(["node", "-e", js], cwd=ROOT, check=True, capture_output=True, text=True).stdout
    return json.loads(out)


def analyzer(code):
    """text → {rasgo: semana} with the language's own syllabus."""
    sys.path.insert(0, os.path.join(ROOT, "tools", code))
    try:
        import importlib
        sys.modules.pop("sillabo", None)
        sil = importlib.import_module("sillabo")
    finally:
        sys.path.pop(0)
    if code == "it":
        return lambda text: sil.analyze(text, answer=True)
    lex = sil.lexicon()
    gerunds, irr = set(lex.get("gerunds", [])), set(lex.get("irrPres", []))

    def pt(text):
        # tense_weeks, plus what it leaves out for a phrase: the irregular
        # present is of week 6 (sei, pode, vê), the gerund of its own week
        feats = {}
        for tok in sil.tokens(text):
            got = sil.tense_weeks(tok)
            if got.get("presente") == sil.TENSE_WEEK["presente"] and tok in irr:
                got["presente"] = sil.TENSE_WEEK["presente"] + 1
            if tok in gerunds:
                got["gerundio"] = sil.TENSE_WEEK["gerundio"]
            for k, v in got.items():
                feats[k] = max(feats.get(k, 0), v)
        return feats
    return pt


def words(text):
    # the words as written (keeps l', dov'è), without the punctuation around them
    out = []
    for t in text.replace("’", "'").split():
        w = re.sub(r"^[«\"(¿¡]+|[.,;:!?»\")…]+$", "", t)
        if w:
            out.append(w)
    return out


def culprit(feat, week, toks, feats_of):
    """The shortest run of words that alone needs `feat` at `week`."""
    for n in range(1, 4):
        for i in range(0, len(toks) - n + 1):
            chunk = " ".join(toks[i:i + n])
            if feats_of(chunk).get(feat) == week:
                return chunk.lower() if i else chunk[0].lower() + chunk[1:]
    return None


def nominal(code):
    """Nouns, adjectives and invariable words of the bank: «um beijo», «a
    conta», «batata frita», «está livre» are not verbs.  Expressions (valeu,
    partiu) stay: they are verb forms learnt as a block."""
    with open(os.path.join(ROOT, "docs", "lang", code, "data", "bank.json"), encoding="utf-8") as fh:
        bank = json.load(fh)
    nouns = set()
    for n in bank.get("nouns", []):
        nouns.update(x.lower() for x in (n[0], n[2]) if x)
    out = set(nouns)
    for a in bank.get("adjectives", []):
        out.update(x.lower() for x in a[:4] if x)
    for w in bank.get("words", []):
        if " " not in w[0] and w[2] != "espressione":
            out.add(w[0].lower())
    return out, nouns


SUBJECTS = {"eu", "você", "ele", "ela", "nós", "vocês", "eles", "elas", "gente", "tu"}


def verb_tokens(code, toks):
    """The words that the syllabus should read (Portuguese: without the
    nouns and adjectives of the bank that look like a verb form)."""
    if code != "pt":
        return toks
    nom, nouns = nominal(code) if not hasattr(verb_tokens, "cache") else verb_tokens.cache
    verb_tokens.cache = (nom, nouns)
    out = []
    for i, t in enumerate(toks):
        low, prev = t.lower(), (toks[i - 1].lower() if i else "")
        if low in nom and prev not in SUBJECTS:
            continue
        if prev in nouns and prev not in SUBJECTS:        # batata frita
            continue
        out.append(t)
    return out


# A reflexive agrees with its verb (mi alzo, si chiama); «mi puoi», «ti
# mando», «mi serve» carry an object pronoun, not a reflexive.
AGREE = {"mi": r"o$", "ti": r"i$", "si": r"[ae]$|[ao]no$", "ci": r"iamo$", "vi": r"[aei]te$"}


def reflexive_ok(chunk):
    w = chunk.split()
    if len(w) < 2 or w[0] not in AGREE:
        return True
    return re.search(AGREE[w[0]], w[-1]) is not None


def build(code):
    feats_of = analyzer(code)
    out = {}
    for fid, text, week in phrases(code):
        toks = verb_tokens(code, words(text))
        feats = feats_of(" ".join(toks))
        late = {}
        for feat, wk in feats.items():
            if wk <= week:
                continue
            forms = culprit(feat, wk, toks, feats_of)
            if not forms:
                continue
            if feat == "riflessivi" and not reflexive_ok(forms):
                continue
            late[forms] = max(late.get(forms, 0), wk)
        # «chiamo» inside «mi chiamo», «sto» inside «sto imparando»: the longer one says it
        for forms in list(late):
            if any(o != forms and late[o] >= late[forms] and (" " + forms + " ") in (" " + o + " ")
                   for o in late):
                del late[forms]
        if late:
            by_week = {}
            for forms, wk in late.items():
                by_week.setdefault(wk, []).append(forms)
            out[fid] = [[wk, ", ".join(sorted(by_week[wk], key=lambda f: text.lower().find(f)))]
                        for wk in sorted(by_week)]
    return out


def render(code, data):
    body = ",\n".join("    %s: %s" % (json.dumps(k), json.dumps(v, ensure_ascii=False)) for k, v in data.items())
    return ("/*\n * Fórmulas fijas: las frases que usan gramática de una semana posterior a\n"
            " * la de su escena, con la forma que se adelanta y la semana en que se\n"
            " * enseña.  Lo genera tools/lib/formule.py con tools/%s/sillabo.py: no\n"
            " * editar a mano.  Lo lee docs/js/formule.js.\n */\n" % code +
            "(function (root) {\n  root.FORMULE_DATA = {\n" + body + "\n  };\n"
            "})(typeof window !== \"undefined\" ? window : globalThis);\n")


def main():
    """--check: only say whether the files are up to date (exit 1 if not)."""
    args = sys.argv[1:]
    check = "--check" in args
    codes = [a for a in args if a != "--check"] or ["it", "pt"]
    stale = 0
    for code in codes:
        data = build(code)
        path = os.path.join(ROOT, "docs", "lang", code, "formule_data.js")
        text = render(code, data)
        if check:
            old = open(path, encoding="utf-8").read() if os.path.exists(path) else ""
            if old != text:
                stale += 1
                print("%s: %s no está al día: python3 tools/lib/formule.py" % (code, os.path.relpath(path, ROOT)))
            continue
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(text)
        print("%s: %d frases con gramática posterior → %s" % (code, len(data), os.path.relpath(path, ROOT)))
    if stale:
        sys.exit(1)


if __name__ == "__main__":
    main()
