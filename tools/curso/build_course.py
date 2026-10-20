"""Arma docs/lang/<edición>/data/course.json desde tools/curso/semanas/ y temario.py.

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
import literatura  # noqa: E402
import temario  # noqa: E402

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


def week_json(w, ed, missing, items):
    """One authored week: its items go to items, the week is returned."""
    n = w["week"]
    tag = "semana %d" % n
    lesson = pick(w["lesson"], ed, tag + " lección", missing)
    parts = [{"h": p["h"], "blocks": list(p["blocks"]), "items": []} for p in lesson["parts"]]
    ids = []
    for k, raw in enumerate(w["items"], 1):
        it = pick(raw, ed, "%s ejercicio %d" % (tag, k), missing)
        if it["type"] not in TYPES:
            raise SystemExit("%s, ejercicio %d: tipo %r" % (tag, k, it["type"]))
        iid = "f%02d-%03d" % (n, k) if n < 100 else "f%03d-%03d" % (n, k)
        out = {"id": iid, "src": "autore", "level": w["level"], "topic": "f%d" % n, "wk": n}
        for key in ("type", "prompt", "stem", "answer", "options", "note", "apl"):
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
    return {
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
        "seminario": g("seminario", None),
        "dilemas": g("dilemas", []),
        "literatura": [dict(o, obra=pick(o["obra"], ed, tag + " literatura", missing),
                            por_que=pick(o["por_que"], ed, tag + " literatura", missing))
                       for o in literatura.LITERATURA.get(n, [])],
    }


def exam_json(t, season_weeks):
    """An exam week, made from its season: every exercise of the season, and
    a review lesson with one block per week (its keys and one of its checks)."""
    n = t["n"]
    blocks = []
    for w in season_weeks:
        b0 = w["lesson"]["blocks"][0]
        blocks.append({"h": "Semana %d · %s" % (w["week"], w["title"]),
                       "r": " ".join(w["keys"]),
                       "q": (b0.get("q") or [])[:1]})
    k = len(blocks)
    cut = [0, (k + 2) // 3, 2 * (k + 2) // 3, k]
    parts = [{"h": "Repaso %d" % (i + 1), "blocks": list(range(cut[i], cut[i + 1])), "items": []}
             for i in range(3) if cut[i] < cut[i + 1]]
    ids = [i for w in season_weeks for i in w["items"]]
    for p in parts:
        p["items"] = [i for b in p["blocks"] for i in season_weeks[b]["items"]]
    return {
        "week": n, "season": curso.season_of(n), "era": curso.era_of(n), "title": t["title"],
        "level": "Nivel %d" % curso.season_of(n),
        "focus": "El examen de la estación: todo lo anterior, mezclado, por destreza (comprensión, conceptos, argumentos y contexto).",
        "fare": "Mostrar que dominás la estación entera.", "tema": "Repaso de la estación",
        "keys": [w["title"] for w in season_weeks], "rama": [],
        "lesson": {"intro": "Antes del examen, un repaso semana por semana: las claves de cada una y un chequeo.",
                   "parts": [{"h": p["h"], "blocks": p["blocks"]} for p in parts], "blocks": blocks},
        "boss": True,
        "refs": {"dummies": [], "routledge": [], "sections": []},
        "items": ids, "challenges": [], "verbs": [], "persons": None, "tenses": [], "known": [],
        "gymShare": 0, "extra": [], "parts": parts, "vocab": [],
        "seminario": None, "dilemas": [], "literatura": [],
    }


def build(ed="es"):
    missing = []
    weeks, items = [], []
    written = {w["week"]: w for w in curso.WEEKS}
    for t in temario.TEMARIO:
        if t["exam"]:
            season = [w for w in weeks if w["season"] == curso.season_of(t["n"])]
            if len(season) != 12:
                break                      # the season is not written yet: no exam
            weeks.append(exam_json(t, season))
            continue
        if t["n"] not in written:
            break
        weeks.append(week_json(written[t["n"]], ed, missing, items))
    last = len(weeks)
    seasons = []
    for s in curso.SEASONS:
        if s["weeks"][0] > last:
            break
        s = pick(s, ed, "estación %d" % s["n"], missing)
        seasons.append(dict(s, weeks=[s["weeks"][0], min(s["weeks"][1], last)]))
    eras = [dict(e, name=pick(e["name"], ed, "época %d" % e["n"], missing)) for e in curso.ERAS]
    if missing:
        raise SystemExit("la edición %s no está completa (%d textos sin traducir), por ejemplo: %s"
                         % (ed, len(missing), "; ".join(missing[:5])))
    course = {"title": TITLE[ed], "lang": ed, "nweeks": curso.NWEEKS, "seasons": seasons, "eras": eras,
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
    waiting = [w["week"] for w in curso.WRITTEN if w not in curso.WEEKS]
    if waiting:
        print("  escritas que esperan a una anterior (falta una semana antes): %s" % waiting)


if __name__ == "__main__":
    main()
