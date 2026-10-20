"""Arma docs/lang/de/data/course.json (alemán) desde tools/de/curso.py.

Mismo formato que el curso de italiano (tools/build_course.py), así el motor
de la app lo juega igual: semanas con lección en partes, ejercicios con id,
vocabulario de la semana.  Sin gimnasio de verbos, sin jefes por ahora.

Run: python3 tools/de/build_course.py
"""
import json
import os
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import curso  # noqa: E402

OUT = os.path.join(ROOT, "docs", "lang", "de", "data", "course.json")
TYPES = {"choice", "cloze", "translate", "listen", "typed"}


def nfc(x):
    if isinstance(x, str):
        return unicodedata.normalize("NFC", x)
    if isinstance(x, list):
        return [nfc(v) for v in x]
    if isinstance(x, dict):
        return {k: nfc(v) for k, v in x.items()}
    return x


def build():
    weeks, items = [], []
    for w in curso.WEEKS:
        n = w["week"]
        lesson = w["lesson"]
        parts = [{"h": p["h"], "blocks": list(p["blocks"]), "items": []} for p in lesson["parts"]]
        ids = []
        for k, it in enumerate(w["items"], 1):
            if it["type"] not in TYPES:
                raise SystemExit("semana %d, ejercicio %d: tipo %r" % (n, k, it["type"]))
            iid = "de%02d-%03d" % (n, k)
            out = {"id": iid, "src": "autore", "level": w["level"], "topic": "de%d" % n, "wk": n}
            for key in ("type", "prompt", "stem", "answer", "options", "note"):
                if it.get(key) not in (None, ""):
                    out[key] = it[key]
            acc = list(it.get("accept") or [])
            if it["answer"] not in acc:
                acc.insert(0, it["answer"])
            out["accept"] = acc
            if it["type"] == "listen":
                out["nopeek"] = True
            items.append(out)
            ids.append(iid)
            parts[it.get("part", 0)]["items"].append(iid)
        weeks.append({
            "week": n, "season": 1, "title": w["title"], "level": w["level"],
            "focus": w["focus"], "fare": w.get("fare", ""), "tema": w.get("tema", ""), "keys": w["keys"],
            "lesson": {"intro": lesson["intro"], "parts": [{"h": p["h"], "blocks": p["blocks"]} for p in parts],
                       "blocks": lesson["blocks"]},
            "boss": False,
            "refs": {"dummies": [], "routledge": [], "sections": []},
            "items": ids, "challenges": [], "verbs": [], "persons": None, "tenses": [], "known": [],
            "gymShare": 0, "extra": [],
            "parts": parts,
            "vocab": [list(v) for v in w.get("vocab", [])],
        })
    course = {"title": "La Via — alemán", "lang": "de", "seasons": [curso.SEASON],
              "weeks": weeks, "items": items, "challenges": [], "sources": []}
    return nfc(course)


def main():
    course = build()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(course, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")
    print("%s: %d semanas, %d ejercicios" % (os.path.relpath(OUT, ROOT), len(course["weeks"]), len(course["items"])))


if __name__ == "__main__":
    main()
