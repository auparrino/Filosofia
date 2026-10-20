#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Valida e compila la banca di parole, frasi ed errori.

Reads   tools/it/bank/*.py  (parole_nomi, parole_verbi_agg, frasi_banca,
                           errori_banca, trasferimento)
Writes  docs/lang/it/data/bank.json

Every entry is checked; the ones that fail are dropped and reported, so a
typo in the bank never reaches the learner as a "correct" answer.

Run:  python3 tools/it/build_bank.py
"""
import importlib
import json
import os
import re
import sys
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, "tools", "it"))

LEVELS = {"A1", "A2", "B1", "B2", "C1"}
ERROR_CATS = {
    "ausiliare", "participio_accordo", "a_personale", "preposizione",
    "preposizione_articolata", "articolo", "articolo_possessivo", "genere",
    "accordo", "plurale", "doppie", "accento", "ortografia", "parola_spagnola",
    "falso_amico", "congiuntivo", "condizionale", "periodo_ipotetico", "pronome",
    "posizione_pronome", "ci_ne", "piacere", "comparativo", "tempo_verbale",
    "persona_verbale", "irregolare", "lessico", "ordine",
}

problems = []

# Verbs that look regular but are not, for the conjugator.
FORCE_IRREGULAR = {"cucire", "sciare", "godere", "apparire", "cuocere", "nuocere", "piacere",
                   "tacere", "giacere", "cogliere", "scegliere", "sciogliere", "togliere"}


def warn(msg):
    problems.append(msg)


def load(name, *attrs):
    try:
        mod = importlib.import_module("bank." + name)
    except ModuleNotFoundError:
        warn("manca tools/bank/%s.py" % name)
        return [None] * len(attrs)
    return [getattr(mod, a, None) for a in attrs]


def clean(s):
    return re.sub(r"\s+", " ", str(s or "")).strip()


def deaccent(s):
    return unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode()


# --------------------------------------------------------------- parole

def build_nouns(raw):
    out, seen = [], set()
    for n in raw or []:
        if len(n) != 7:
            warn("nome malformato: %r" % (n,))
            continue
        s, g, pl, es, theme, lvl, note = [clean(x) for x in n]
        if not s or not pl or not es or g not in ("m", "f") or lvl not in LEVELS:
            warn("nome scartato: %r" % (n,))
            continue
        if s in seen:
            continue
        seen.add(s)
        out.append([s, g, pl, es, theme, lvl, note])
    return out


def build_verbs(raw):
    out, seen = [], set()
    for v in raw or []:
        if len(v) != 7:
            warn("verbo malformato: %r" % (v,))
            continue
        inf, es, aux, isc, irr, lvl, note = v
        inf, es, note = clean(inf), clean(es), clean(note)
        # Pronominal verbs are welcome too: volerci, farcela, andarsene.
        if (not re.search(r"r(e|si|ci|ne|la|sela|sene|cela|sela)$", inf) or aux not in ("avere", "essere", "both")
                or lvl not in LEVELS or inf in seen):
            if inf not in seen:
                warn("verbo scartato: %r" % (v,))
            continue
        if isc and not re.search(r"ire$|irsi$", inf):
            warn("isc su verbo non in -ire: %s" % inf)
            isc = False
        if re.search(r"rre$", inf) or inf in FORCE_IRREGULAR or re.search(r"sistere$", inf):
            # The generator would get these wrong (esistito, cucio, scii,
            # traduco): keep them out of the regular conjugator.
            irr = True
        seen.add(inf)
        out.append([inf, es, aux, bool(isc), bool(irr), lvl, note])
    return out


def build_adjectives(raw):
    out, seen = [], set()
    for a in raw or []:
        if len(a) != 7:
            warn("aggettivo malformato: %r" % (a,))
            continue
        forms = [clean(x) for x in a[:4]]
        es, lvl, note = clean(a[4]), clean(a[5]), clean(a[6])
        if not all(forms) or lvl not in LEVELS or forms[0] in seen:
            if forms[0] not in seen:
                warn("aggettivo scartato: %r" % (a,))
            continue
        seen.add(forms[0])
        out.append(forms + [es, lvl, note])
    return out


def build_words(raw):
    out, seen = [], set()
    for w in raw or []:
        if len(w) != 5:
            warn("parola malformata: %r" % (w,))
            continue
        itw, es, cat, lvl, note = [clean(x) for x in w]
        if not itw or not es or lvl not in LEVELS or itw in seen:
            continue
        seen.add(itw)
        out.append([itw, es, cat, lvl, note])
    return out


# ---------------------------------------------------------------- frasi

def build_sentences(raw):
    out, seen = [], set()
    for s in raw or []:
        es = clean(s.get("es"))
        its = []
        for x in (s.get("it") or []):
            x = clean(x)
            # variants that differ only in case or final dot are one answer
            if x and x.lower().rstrip(".") not in [y.lower().rstrip(".") for y in its]:
                its.append(x)
        lvl = s.get("lvl")
        if not es or not its or lvl not in LEVELS or es in seen:
            if es not in seen:
                warn("frase scartata: %r" % (s,))
            continue
        gap = s.get("gap")
        if gap:
            form = clean(gap[0])
            if not form or not re.search(r"(?<![\wàèéìòù])" + re.escape(form) + r"(?![\wàèéìòù])", its[0]):
                warn("gap assente dalla frase: %r in %r" % (form, its[0]))
                gap = None
            else:
                gap = [form, clean(gap[1])]
        seen.add(es)
        out.append({"es": es, "it": its, "lvl": lvl, "tags": list(s.get("tags") or []),
                    "gap": gap, "note": clean(s.get("note"))})
    return out


# --------------------------------------------------------------- errori

def apply_fix(e):
    w, b = e["wrong"], e["bad"]
    m = re.search(r"(?<![\wàèéìòù'])" + re.escape(b) + r"(?![\wàèéìòù])", w)
    if not m:
        return None
    out = w[:m.start()] + e["good"] + w[m.end():]
    return re.sub(r"\s+", " ", out).replace(" ,", ",").replace(" .", ".").strip()


def build_errors(raw):
    out, seen = [], set()
    for e in raw or []:
        e = {k: (clean(v) if isinstance(v, str) else v) for k, v in e.items()}
        if (not e.get("wrong") or not e.get("right") or not e.get("bad") or "good" not in e
                or e.get("cat") not in ERROR_CATS or e.get("lvl") not in LEVELS):
            warn("errore scartato: %r" % (e,))
            continue
        if e["wrong"] in seen:
            continue
        if apply_fix(e) != e["right"]:
            warn("errore incoerente: %s | %s -> %s | %s" % (e["wrong"], e["bad"], e["good"], e["right"]))
            continue
        seen.add(e["wrong"])
        row = {k: e[k] for k in ("wrong", "right", "bad", "good", "cat", "why", "lvl")}
        if e.get("alt"):
            row["alt"] = [clean(a) for a in e["alt"] if clean(a)]
        out.append(row)
    return out


# ------------------------------------------------------- trasferimento

def build_transfer(es_it, falsi, spelling):
    out_es = {}
    for k, v in (es_it or {}).items():
        key = deaccent(clean(k).lower()).replace("n~", "ñ") if "ñ" not in k else clean(k).lower()
        if not key or not v or not clean(v[0]):
            continue
        out_es[key] = [clean(v[0]), clean(v[1]) if len(v) > 1 else ""]
    out_f = {}
    for k, v in (falsi or {}).items():
        if len(v) >= 2:
            out_f[clean(k).lower()] = [clean(v[0]), clean(v[1]), clean(v[2]) if len(v) > 2 else ""]
    out_s = [[clean(a), clean(b), clean(c)] for a, b, c in (spelling or []) if a and b]
    return out_es, out_f, out_s


def main():
    nouns, = load("parole_nomi", "NOUNS")
    verbs, adjs, words = load("parole_verbi_agg", "VERBS", "ADJECTIVES", "WORDS")
    sents, = load("frasi_banca", "SENTENCES")
    errs, = load("errori_banca", "ERRORS")
    es_it, falsi, spelling = load("trasferimento", "ES_IT", "FALSI", "SPELLING")

    es, f, sp = build_transfer(es_it, falsi, spelling)
    bank = {
        "nouns": build_nouns(nouns),
        "verbs": build_verbs(verbs),
        "adjectives": build_adjectives(adjs),
        "words": build_words(words),
        "sentences": build_sentences(sents),
        "errors": build_errors(errs),
        "esIt": es,
        "falsi": f,
        "spelling": sp,
    }
    path = os.path.join(ROOT, "docs", "lang", "it", "data", "bank.json")
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(bank, fh, ensure_ascii=False, separators=(",", ":"))

    # From which week of the course each sentence and error can be asked:
    # tools/sillabo.py reads the tenses it uses (it needs the bank just
    # written, for the regular verbs and the nouns).
    import sillabo

    def week(feats):
        return max(feats.values()) if feats else 1

    for sn in bank["sentences"]:
        sn["w"] = week(sillabo.analyze(sn["it"][0], answer=True))
        if sn.get("gap"):
            ctx = sillabo.analyze(sn["it"][0])
            ctx.update({k: v for k, v in sillabo.analyze(sn["gap"][0], answer=True).items()
                        if v > ctx.get(k, 0)})
            sn["wg"] = week(ctx)
    for er in bank["errors"]:
        ctx = sillabo.analyze(er["right"])
        ctx.update({k: v for k, v in sillabo.analyze(er["good"], answer=True).items()
                    if v > ctx.get(k, 0)})
        er["w"] = week(ctx)
    # And what the tenses do not show: the words the learner has to write
    # (seen in the course, in the bank of the level, or transparent) and the
    # grammar that is not a tense (possessives, clitics, piacere, numbers…):
    # tools/lib/semanas_banco.py with tools/it/rasgos_banco.py.
    sys.path.insert(0, os.path.join(ROOT, "tools", "lib"))
    import rasgos_banco
    import semanas_banco
    rep = semanas_banco.run(bank, rasgos_banco, "it")
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(bank, fh, ensure_ascii=False, separators=(",", ":"))

    print("semanas: %d oraciones (traducir) y %d huecos esperan a su vocabulario o su gramática; "
          "%d errores" % (rep["sentences"], rep["sentences_wg"], rep["errors"]))
    if rep["unknown"]:
        print("  palabras del banco que no aparecen en ningún lado: %s" % ", ".join(
            "%s %d" % x for x in rep["unknown"][:25]))
    for p in problems[:60]:
        print("  ! " + p)
    if len(problems) > 60:
        print("  ! … e altri %d" % (len(problems) - 60))
    print("banca: %d nomi, %d verbi, %d aggettivi, %d parole, %d frasi, %d errori, "
          "%d voci spagnole, %d falsi amici, %d grafie  (%d KB)" % (
              len(bank["nouns"]), len(bank["verbs"]), len(bank["adjectives"]),
              len(bank["words"]), len(bank["sentences"]), len(bank["errors"]),
              len(es), len(f), len(sp), os.path.getsize(path) // 1024))


if __name__ == "__main__":
    main()
