"""Arma docs/lang/<edición>/data/course.json desde tools/curso/semanas/.

Una sola fuente para las cuatro ediciones (es, it, pt, de): cada texto del
curso es un str (castellano) o un dict {"es": …, "it": …, "pt": …, "de": …}.
El build elige el texto de cada edición; si a una edición le falta alguno,
no la arma y dice cuáles faltan (las ediciones que todavía no están
traducidas no van en EDITIONS).

Mismo formato que el curso de La Via C1, así el motor lo juega igual:
semanas con lección en partes y bloques, ejercicios con id, conceptos de
la semana (vocab).  Sin gimnasio de verbos.

Run: python3 tools/curso/build_course.py
"""
import json
import os
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import curso  # noqa: E402

# Las ediciones que se arman hoy (las otras, cuando estén traducidas).
EDITIONS = ["es"]
ALL = ("es", "it", "pt", "de")
TYPES = {"choice", "cloze", "typed"}
TITLE = {"es": "Ágora — filosofía", "it": "Ágora — filosofia", "pt": "Ágora — filosofia", "de": "Ágora — Philosophie"}


def nfc(x):
    if isinstance(x, str):
        return unicodedata.normalize("NFC", x)
    if isinstance(x, list):
        return [nfc(v) for v in x]
    if isinstance(x, dict):
        return {k: nfc(v) for k, v in x.items()}
    return x


def is_tr(x):
    """A text in several editions: {"es": …, "it": …}."""
    return isinstance(x, dict) and "es" in x and set(x) <= set(ALL)


def pick(x, ed, where, missing):
    """The text of edition ed, everywhere inside x."""
    if is_tr(x):
        if ed in x and x[ed] not in (None, ""):
            return pick(x[ed], ed, where, missing)
        missing.append(where)
        return None
    if isinstance(x, str):
        if ed != "es":
            missing.append(where)
        return x
    if isinstance(x, list):
        return [pick(v, ed, "%s[%d]" % (where, k), missing) for k, v in enumerate(x)]
    if isinstance(x, dict):
        return {k: pick(v, ed, "%s.%s" % (where, k), missing) for k, v in x.items()}
    return x


def build(ed="es"):
    missing = []
    weeks, items = [], []
    for w in curso.WEEKS:
        n = w["week"]
        tag = "semana %d" % n
        lesson = pick(w["lesson"], ed, tag + " lección", missing)
        parts = [{"h": p["h"], "blocks": list(p["blocks"]), "items": []} for p in lesson["parts"]]
        ids = []
        for k, raw in enumerate(w["items"], 1):
            it = pick(raw, ed, "%s ejercicio %d" % (tag, k), missing)
            if it["type"] not in TYPES:
                raise SystemExit("%s, ejercicio %d: tipo %r" % (tag, k, it["type"]))
            iid = "f%02d-%03d" % (n, k)
            out = {"id": iid, "src": "autore", "level": w["level"], "topic": "f%d" % n, "wk": n}
            for key in ("type", "prompt", "stem", "answer", "options", "note"):
                if it.get(key) not in (None, ""):
                    out[key] = it[key]
            acc = list(it.get("accept") or [])
            if it["answer"] not in acc:
                acc.insert(0, it["answer"])
            out["accept"] = acc
            items.append(out)
            ids.append(iid)
            parts[it.get("part", 0)]["items"].append(iid)
        g = lambda key, dflt="": pick(w.get(key, dflt), ed, "%s %s" % (tag, key), missing)  # noqa: E731
        weeks.append({
            "week": n, "season": curso.season_of(n), "era": curso.era_of(n), "title": g("title"), "level": w["level"],
            "focus": g("focus"), "fare": g("fare"), "tema": g("tema"), "keys": g("keys", []),
            "rama": w.get("rama", []),
            "lesson": {"intro": lesson["intro"], "parts": [{"h": p["h"], "blocks": p["blocks"]} for p in parts],
                       "blocks": lesson["blocks"]},
            "boss": False,
            "refs": {"dummies": [], "routledge": [], "sections": []},
            "items": ids, "challenges": [], "verbs": [], "persons": None, "tenses": [], "known": [],
            "gymShare": 0, "extra": [],
            "parts": parts,
            "vocab": [list(v) for v in g("vocab", [])],
        })
    last = len(weeks)
    seasons = []
    for s in curso.SEASONS:
        if s["weeks"][0] > last:
            break
        s = pick(s, ed, "estación %d" % s["n"], missing)
        seasons.append(dict(s, weeks=[s["weeks"][0], min(s["weeks"][1], last)]))
    if missing:
        raise SystemExit("la edición %s no está completa (%d textos sin traducir), por ejemplo: %s"
                         % (ed, len(missing), "; ".join(missing[:5])))
    eras = [dict(e, name=pick(e["name"], ed, "época %d" % e["n"], missing)) for e in curso.ERAS]
    course = {"title": TITLE[ed], "lang": ed, "seasons": seasons, "eras": eras,
              "weeks": weeks, "items": items, "challenges": [], "sources": []}
    return nfc(course)


def out_path(ed):
    return os.path.join(ROOT, "docs", "lang", ed, "data", "course.json")


def main():
    for ed in EDITIONS:
        course = build(ed)
        out = out_path(ed)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, "w", encoding="utf-8") as f:
            json.dump(course, f, ensure_ascii=False, separators=(",", ":"))
            f.write("\n")
        print("%s: %d semanas, %d ejercicios" % (os.path.relpath(out, ROOT), len(course["weeks"]), len(course["items"])))


if __name__ == "__main__":
    main()
