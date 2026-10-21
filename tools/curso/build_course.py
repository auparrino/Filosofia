"""Arma los datos de lectura de cada edición desde tools/curso/semanas/ y temario.py.

Una sola fuente para las cuatro ediciones (es, it, pt, de): cada texto del
curso es un str (castellano) o un dict {"es": …, "it": …, "pt": …, "de": …}.
El build elige el texto de cada edición; si a una edición le falta alguno,
no la arma y dice cuáles faltan (las ediciones que todavía no están
traducidas no van en EDITIONS).

La app es de lectura: los datos llevan solo lo que se lee.  Los ejercicios
(items), los chequeos (q) de los bloques y las preguntas, chequeos,
consigna, rúbrica y socráticas del seminario se quedan en la fuente y no
salen.  Salen dos clases de archivo, en docs/lang/<edición>/data/:

- course.json: el índice, chico, para la primera carga (las estaciones, las
  épocas y, por semana, número, título, ramas y tema);
- estacion-N.json: las semanas de la estación N enteras, para leer.  Las
  semanas de examen (13, 26, …, 117) son el «Repaso de la estación»: la
  lista de las semanas que repasan (la app muestra lo esencial de cada una).

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
TITLE = {"es": "Ágora — filosofía", "it": "Ágora — filosofia", "pt": "Ágora — filosofia", "de": "Ágora — Philosophie"}
# Lo que se lee de un bloque de la lección (el chequeo q no).
BLOCK = ("h", "r", "table", "ex", "warn", "tip", "more")


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


def seminario_json(sm):
    """The seminar to read: the source, the sections with their glosses,
    the map of the argument and the model text («una lectura posible»)."""
    if not sm:
        return None
    return {
        "autor": sm["autor"], "obra": sm["obra"], "pasaje": sm["pasaje"],
        "derechos": sm["derechos"], "traduccion": sm.get("traduccion", "propia"), "contexto": sm["contexto"],
        "tramos": [{"texto": t["texto"], "glosas": t.get("glosas") or []} for t in sm["tramos"]],
        "mapa": sm["mapa"],
        "modelo": (sm.get("escribir") or {}).get("modelo", ""),
    }


def week_json(w, ed, missing):
    """One authored week, as it is read."""
    n = w["week"]
    tag = "semana %d" % n
    g = lambda key, dflt="": pick(w.get(key, dflt), ed, "%s %s" % (tag, key), missing)  # noqa: E731
    lesson = pick(w["lesson"], ed, tag + " lección", missing)
    blocks = [{k: b[k] for k in BLOCK if b.get(k)} for b in lesson["blocks"]]
    return {
        "week": n, "season": curso.season_of(n), "era": curso.era_of(n), "title": g("title"),
        "rama": w.get("rama", []), "tema": g("tema"), "focus": g("focus"), "keys": g("keys", []),
        "lesson": {"intro": lesson["intro"],
                   "parts": [{"h": p["h"], "blocks": [blocks[i] for i in p["blocks"]]} for p in lesson["parts"]]},
        "seminario": seminario_json(g("seminario", None)),
        "dilemas": g("dilemas", []),
        "vocab": [list(v) for v in g("vocab", [])],
        "literatura": [{"autor": o["autor"], "obra": pick(o["obra"], ed, tag + " literatura", missing),
                        "año": o["año"], "tipo": o["tipo"],
                        "por_que": pick(o["por_que"], ed, tag + " literatura", missing),
                        "dp": bool(o.get("dp")), "arg": bool(o.get("arg"))}
                       for o in literatura.LITERATURA.get(n, [])],
    }


def repaso_json(t, season, season_weeks):
    """The last week of a season: the review of the season.  It lists the
    weeks it reviews; the app shows the essentials of each one."""
    n = t["n"]
    return {
        "week": n, "season": season["n"], "era": curso.era_of(n), "repaso": True,
        "title": "Repaso de la estación: %s" % season["name"],
        "rama": [], "tema": "Repaso de la estación",
        "intro": "Lo esencial de cada semana de la estación, para releer de corrido. Si algo no te suena, "
                 "abrí la semana y volvé a leerla.",
        "semanas": [w["week"] for w in season_weeks],
    }


def build(ed="es"):
    """{file name: content} of an edition: the index and one file per season."""
    missing = []
    weeks = []
    written = {w["week"]: w for w in curso.WEEKS}
    seasons = {s["n"]: pick(s, ed, "estación %d" % s["n"], missing) for s in curso.SEASONS}
    for t in temario.TEMARIO:
        if t["exam"]:
            sn = curso.season_of(t["n"])
            season = [w for w in weeks if w["season"] == sn and not w.get("repaso")]
            if len(season) != 12:
                break                      # the season is not written yet: no review
            weeks.append(repaso_json(t, seasons[sn], season))
            continue
        if t["n"] not in written:
            break
        weeks.append(week_json(written[t["n"]], ed, missing))
    last = len(weeks)
    eras = [dict(e, name=pick(e["name"], ed, "época %d" % e["n"], missing)) for e in curso.ERAS]
    if missing:
        raise SystemExit("la edición %s no está completa (%d textos sin traducir), por ejemplo: %s"
                         % (ed, len(missing), "; ".join(missing[:5])))
    out_seasons = []
    files = {}
    for sn in sorted(seasons):
        s = seasons[sn]
        if s["weeks"][0] > last:
            break
        name = "estacion-%d.json" % sn
        out_seasons.append({"n": sn, "name": s["name"], "weeks": [s["weeks"][0], min(s["weeks"][1], last)],
                            "blurb": s["blurb"], "file": name})
        files[name] = {"season": sn, "weeks": [w for w in weeks if w["season"] == sn]}
    index = {"app": "agora", "title": TITLE[ed], "lang": ed, "nweeks": curso.NWEEKS,
             "seasons": out_seasons, "eras": eras,
             "weeks": [dict({"week": w["week"], "season": w["season"], "era": w["era"], "title": w["title"],
                             "rama": w["rama"], "tema": w["tema"]}, **({"repaso": True} if w.get("repaso") else {}))
                       for w in weeks]}
    files["course.json"] = index
    return {k: nfc(v) for k, v in files.items()}


def out_dir(ed):
    return os.path.join(ROOT, "docs", "lang", ed, "data")


def dump(content):
    return json.dumps(content, ensure_ascii=False, separators=(",", ":")) + "\n"


def main():
    for ed in EDITIONS:
        files = build(ed)
        d = out_dir(ed)
        os.makedirs(d, exist_ok=True)
        # what an older build left and this one no longer makes
        for f in os.listdir(d):
            if f.endswith(".json") and f not in files:
                os.remove(os.path.join(d, f))
        total = 0
        for name, content in files.items():
            text = dump(content)
            total += len(text.encode("utf-8"))
            with open(os.path.join(d, name), "w", encoding="utf-8") as f:
                f.write(text)
        idx = files["course.json"]
        print("%s: %d semanas en %d archivos, %d KB (el índice, %d KB)" % (
            os.path.relpath(d, ROOT), len(idx["weeks"]), len(files), total // 1024,
            len(dump(idx).encode("utf-8")) // 1024))
    waiting = [w["week"] for w in curso.WRITTEN if w not in curso.WEEKS]
    if waiting:
        print("  escritas que esperan a una anterior (falta una semana antes): %s" % waiting)


if __name__ == "__main__":
    main()
