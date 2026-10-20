# -*- coding: utf-8 -*-
"""Compila el curso: docs/lang/pt/data/course.json y glossario.json.

Fuentes:
  tools/pt/curriculo.py   el temario (semanas, estaciones, tiempos)
  tools/pt/lessons/*.py   la teoría de cada semana, en partes
  tools/pt/vocab/*.py     las palabras de la semana
  tools/pt/authored/*.py  los ejercicios propios, cada uno con su semana («w»)

A diferencia del curso de italiano, que tomaba los ejercicios de dos libros
y tenía que adivinar su semana, acá cada ejercicio se escribe para una
semana y una parte de su lección.  tools/pt/sillabo.py igual controla que la
respuesta no use un tiempo verbal que todavía no se enseñó (lo avisa).

    python3 tools/pt/build_course.py
"""
import importlib.util
import json
import os
import random
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA = os.path.join(ROOT, "docs", "lang", "pt", "data")
sys.path.insert(0, os.path.join(ROOT, "tools", "pt"))

import consignas  # noqa: E402
from curriculo import SEASONS, SAI_FARE, WEEKS, TENSE_WEEK, REVIEW_WEEKS, season_of, known_tenses  # noqa: E402

# La lección se lee en el teléfono: regla corta, después la tabla o los
# ejemplos.  Lo largo va en «more», plegado bajo «Más detalle».
LIMITS = {"intro": 35, "r": 30, "warn": 30, "tip": 30, "more": 70}


def _modules(folder):
    path = os.path.join(ROOT, "tools", "pt", folder)
    if not os.path.isdir(path):
        return []
    out = []
    for fn in sorted(os.listdir(path)):
        if not fn.endswith(".py") or fn.startswith("_"):
            continue
        spec = importlib.util.spec_from_file_location("%s_%s" % (folder, fn[:-3]), os.path.join(path, fn))
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        out.append((fn, mod))
    return out


def load_lessons():
    out = {}
    for fn, mod in _modules("lessons"):
        for week, lesson in getattr(mod, "LESSONS", {}).items():
            if week in out:
                raise SystemExit("lección doble para la semana %s (%s)" % (week, fn))
            out[week] = lesson
    return out


def _plain(s):
    import unicodedata
    return "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn")


_SENSE_STOP = {"de", "la", "el", "los", "las", "un", "una", "en", "al", "del", "con", "por", "para", "que", "se",
               "no", "es", "lo", "le", "su", "sus", "mas", "muy", "como", "algo", "alguien", "cosa", "coloquial",
               "si", "sin", "tambien", "pt"}


def same_sense(a, b):
    """Dos glosas dicen lo mismo si comparten una palabra (o sus cuatro
    primeras letras: «despertarse» y «despertar(se)», «vuelco» y «vuelta»)."""
    wa = [w for w in re.findall(r"[a-zñ]+", _plain(a)) if w not in _SENSE_STOP]
    wb = [w for w in re.findall(r"[a-zñ]+", _plain(b)) if w not in _SENSE_STOP]
    return any(x == y or (len(x) >= 4 and len(y) >= 4 and x[:4] == y[:4]) for x in wa for y in wb)


def vocab_keys(word):
    """Las formas que se tocan de una palabra de la semana: sin artículo y
    cada lado de «moço / moça»; las de varias palabras no se tocan enteras."""
    out = []
    for k in word.lower().split("/"):
        k = re.sub(r"^(o|a|os|as|um|uma) ", "", k.strip())
        if k and " " not in k and "-" not in k:
            out.append(k)
    return out


def merge_senses(gloss, weeks):
    """El toque en la palabra y la palabra de la semana dicen lo mismo
    (auditoría 3.0, E-portugues P11): si la forma ya estaba en el glosario con
    otra acepción (la del banco, o la de otro lema: «puxa» → puxar «tirar»,
    «saque» → sacar, «virada» → virar, «juntar» «reunir» cuando la semana
    enseña «ahorrar»), el toque muestra las dos, primero la de la semana.  Si
    no estaba, entra con la glosa de la semana."""
    n = 0
    for wk in weeks:
        for v in wk["vocab"]:
            for k in vocab_keys(v[0]):
                if k not in gloss:
                    gloss[k] = [k, v[1], wk["week"]]
                    continue
                lemma, es, w0 = gloss[k]
                own = lemma.lower() == k
                if v[1] in es or (own and same_sense(v[1], es)):
                    continue
                # otro lema (virada → virar, tomada → tomar): se nombra
                other = es if own else lemma if _plain(es) == _plain(lemma) else "%s, %s" % (lemma, es)
                gloss[k] = [k, "%s · también: %s" % (v[1], other), min(w0, wk["week"])]
                n += 1
    print("glosario: %d palabras de la semana con las dos acepciones al tocarlas" % n)
    return n


def load_vocab():
    out = {}
    for fn, mod in _modules("vocab"):
        for week, words in getattr(mod, "VOCAB", {}).items():
            out.setdefault(week, []).extend(words)
    return out


def load_authored():
    out, seen = [], set()
    for fn, mod in _modules("authored"):
        for it in getattr(mod, "ITEMS", []):
            item = dict(it)
            if item["id"] in seen:
                raise SystemExit("id repetido: %s (%s)" % (item["id"], fn))
            seen.add(item["id"])
            item["src"] = "autore"
            item.setdefault("level", "B2")
            item.setdefault("topic", fn[:-3])
            item.setdefault("prompt", "Completá.")
            # la consigna en portugués según la semana (tools/pt/consignas.py)
            pt = consignas.consigna(item["prompt"], item["w"])
            if pt != item["prompt"]:
                item["prompt_es"] = item["prompt"]
                item["prompt"] = pt
            item["accept"] = [item["answer"]] + [a for a in item.get("alt", []) if a and a != item["answer"]]
            out.append(item)
    return out


def _words(s):
    return len(re.sub(r"[*]", "", s).split())


def check_lesson(week, lesson):
    bad = []
    if not lesson.get("intro"):
        bad.append("semana %s: falta la intro" % week)
    elif _words(lesson["intro"]) > LIMITS["intro"]:
        bad.append("semana %s: intro de %d palabras (máx. %d)" % (week, _words(lesson["intro"]), LIMITS["intro"]))
    blocks = lesson.get("blocks") or []
    if len(blocks) < 3:
        bad.append("semana %s: solo %d bloques" % (week, len(blocks)))
    known = {"h", "r", "table", "ex", "warn", "tip", "more", "q", "qq"}
    for i, b in enumerate(blocks, 1):
        for q in (b.get("q") or []) + (b.get("qq") or []):
            if q.get("answer") not in (q.get("options") or []) or len(set(q.get("options") or [])) != 3:
                bad.append("semana %s bloque %d: chequeo «q» mal armado: %s" % (week, i, q.get("prompt")))
        extra = set(b) - known
        if extra:
            bad.append("semana %s bloque %d: claves desconocidas %s" % (week, i, sorted(extra)))
        if not b.get("r"):
            bad.append("semana %s bloque %d: falta la regla corta (r)" % (week, i))
        for k in ("r", "warn", "tip"):
            if b.get(k) and _words(b[k]) > LIMITS[k]:
                bad.append("semana %s bloque %d: %s de %d palabras (máx. %d)" % (week, i, k, _words(b[k]), LIMITS[k]))
        for par in b.get("more") or []:
            if _words(par) > LIMITS["more"]:
                bad.append("semana %s bloque %d: párrafo de «more» de %d palabras" % (week, i, _words(par)))
        if len(b.get("more") or []) > 2:
            bad.append("semana %s bloque %d: más de 2 párrafos en «more»" % (week, i))
        if len(b.get("ex") or []) > 5:
            bad.append("semana %s bloque %d: más de 5 ejemplos" % (week, i))
        t = b.get("table")
        if t:
            width = len(t.get("head", []))
            for r in t.get("rows", []):
                if len(r) != width:
                    bad.append("semana %s bloque %d: fila de %d celdas sobre %d" % (week, i, len(r), width))
        for pair in b.get("ex", []):
            if len(pair) != 2:
                bad.append("semana %s bloque %d: ejemplo mal formado" % (week, i))
    parts = lesson.get("parts") or []
    if parts:
        covered = sorted(x for p in parts for x in p["blocks"])
        if covered != list(range(len(blocks))):
            bad.append("semana %s: las partes no cubren todos los bloques una vez" % week)
    return bad


def check_item(it):
    bad = []
    t = it.get("type")
    if t in ("choice", "listen", "scopri"):
        opts = it.get("options") or []
        if it["answer"] not in opts:
            bad.append("%s: la respuesta no está entre las opciones" % it["id"])
        if len(set(opts)) != len(opts) or len(opts) < 2:
            bad.append("%s: opciones repetidas o insuficientes" % it["id"])
    if t == "cloze" and "___" not in (it.get("stem") or "") and "…" not in (it.get("stem") or ""):
        bad.append("%s: cloze sin hueco" % it["id"])
    if not it.get("w"):
        bad.append("%s: sin semana (w)" % it["id"])
    return bad


def main():
    lessons = load_lessons()
    vocab = load_vocab()
    authored = load_authored()
    problems = []
    for it in authored:
        problems += check_item(it)
        if consignas.falta(it["prompt"], it["w"]):
            problems.append("%s (semana %s): consigna sin portugués en tools/pt/consignas.py: %s" % (it["id"], it["w"], it["prompt"]))

    # Nada antes de su teoría: la respuesta no puede usar un tiempo que su
    # semana todavía no enseñó.  Solo avisa: el conjugador reconoce formas,
    # no contextos, y alguna forma ambigua puede engañarlo.
    try:
        import sillabo
        early = []
        for it in authored:
            if it.get("type") in ("listen", "scopri") or it.get("prova"):
                continue
            wk, feats = sillabo.min_week(it)
            if wk > int(it["w"]):
                early.append("%s (semana %s) usa %s" % (it["id"], it["w"],
                             ", ".join("%s:%d" % kv for kv in feats.items() if kv[1] > int(it["w"]))))
        if early:
            print("aviso: %d ítems usan un tiempo antes de su semana (primeros 25):" % len(early))
            for e in early[:25]:
                print("   ", e)
    except Exception as e:           # sin node o sin conjugador
        print("aviso: sin control de tiempos (%s)" % e)

    by_week = {}
    for it in authored:
        it["wk"] = int(it["w"])
        by_week.setdefault(int(it["w"]), []).append(it)

    rnd = random.Random(52)
    weeks = []
    for spec in WEEKS:
        w = spec["w"]
        # los ítems del examen final (prova) no se entrenan en la semana 52:
        # se ven por primera vez en el examen (app.js los toma de course.items)
        own = [i["id"] for i in by_week.get(w, []) if not i.get("prova")]
        pool = list(own)
        if spec.get("boss") or w == 51:
            # un jefe (y el repaso final) usa todo lo de su estación: una
            # muestra pareja de cada semana, además de sus ítems propios
            first = 27 if w == 51 else next(s["weeks"][0] for s in SEASONS if s["weeks"][0] <= w <= s["weeks"][1])
            if w == 52:
                first = 1
            for wk in range(first, w):
                cand = [i["id"] for i in by_week.get(wk, []) if i.get("type") not in ("scopri",)]
                rnd.shuffle(cand)
                pool += [c for c in cand[:12 if w != 52 else 4] if c not in pool]
        lesson = lessons.get(w)
        if not lesson:
            problems.append("falta la lección de la semana %d" % w)
        else:
            problems += check_lesson(w, lesson)
        weeks.append({
            "week": w,
            "season": season_of(w),
            "title": spec["title"],
            "level": spec["level"],
            "focus": spec["focus"],
            "fare": SAI_FARE[w][0],
            "tema": SAI_FARE[w][1],
            "keys": spec["keys"],
            "lesson": lesson,
            "boss": bool(spec.get("boss")),
            "refs": {"sections": []},
            "items": pool,
            "extra": [],
            "challenges": [],
            "verbs": spec.get("v", []),
            "persons": spec.get("persons"),
            "tenses": spec.get("tenses", ["presente"]),
            "known": [t for t in known_tenses(w) if t not in ("imperativo", "gerundio", "participio")] or ["presente"],
            "gymShare": 0.35 if any(TENSE_WEEK.get(t) == w for t in spec.get("tenses", [])) or w in (1, 6) else 0.15,
        })

    by_id = {i["id"]: i for i in authored}

    # Las partes de la lección: cada ejercicio va a la parte que declara
    # («part»); si no declara, a la última.
    unparted = []
    for wk in weeks:
        lesson = wk["lesson"] or {}
        parts = lesson.get("parts")
        if not parts:
            wk["parts"] = None
            continue
        compiled = [{"h": p["h"], "blocks": list(p["blocks"]), "items": []} for p in parts]
        for iid in wk["items"]:
            it = by_id[iid]
            k = it.get("part") if int(it["w"]) == wk["week"] else None
            if not isinstance(k, int) or not 0 <= k < len(parts):
                if int(it["w"]) == wk["week"]:
                    # sin «part» cae en la última parte, que quizá no es la suya
                    unparted.append((wk["week"], iid, parts[-1]["h"]))
                k = len(parts) - 1 if int(it["w"]) == wk["week"] else _review_part(it, parts)
            compiled[k]["items"].append(iid)
        wk["parts"] = compiled
    if unparted:
        per = {}
        for w, iid, h in unparted:
            per.setdefault((w, h), []).append(iid)
        print("aviso: %d ítems sin «part» van a la última parte de su semana:" % len(unparted))
        for (w, h), ids in sorted(per.items()):
            print("    semana %d, «%s»: %d (%s…)" % (w, h, len(ids), ids[0]))

    # Las palabras de la semana: [palabra, significado, ejemplo].  Una
    # palabra se enseña una sola vez: en la primera semana que la trae.
    seen_vocab = {}
    for w in sorted(vocab):
        keep = []
        for v in vocab[w]:
            key = v[0].lower()
            if key in seen_vocab:
                problems.append("palabra repetida «%s» (semanas %d y %d): queda en la %d"
                                % (v[0], seen_vocab[key], w, seen_vocab[key]))
                continue
            seen_vocab[key] = w
            keep.append(v)
        vocab[w] = keep
    for wk in weeks:
        wk["vocab"] = [] if wk["boss"] else [list(v[:4]) + [""] * (4 - len(v[:4])) for v in vocab.get(wk["week"], [])]
        if not wk["boss"] and not wk["vocab"]:
            problems.append("semana %d: sin palabras de la semana" % wk["week"])

    course = {
        "title": "Rumo C1",
        "seasons": SEASONS,
        "weeks": weeks,
        "items": authored,
        "challenges": [],
        "sources": [],
    }

    # El glosario de tocar: toda palabra portuguesa de los ejercicios, de
    # las lecciones y de las palabras de la semana.
    try:
        import lessico
        texts = [(i.get("stem") or "") + " " + str(i.get("answer") or "") for i in authored
                 if i.get("type") != "translate"]
        texts += [str(i.get("answer") or "") for i in authored if i.get("type") == "translate"]
        for wk in weeks:
            for b in (wk.get("lesson") or {}).get("blocks", []):
                texts += [p[0].replace("*", "") for p in b.get("ex", [])]
            texts += [v[2] for v in wk["vocab"]]
        gloss = lessico.gloss_table(texts)
        # las palabras de la semana se glosan desde su semana, con la acepción
        # de la semana primero
        merge_senses(gloss, weeks)
        for wk in weeks:
            for v in wk["vocab"]:
                key = v[0].lower()
                if key not in gloss or gloss[key][2] > wk["week"]:
                    gloss[key] = [v[0], v[1], wk["week"]]
        with open(os.path.join(DATA, "glossario.json"), "w", encoding="utf-8") as fh:
            json.dump(gloss, fh, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
        print("glosario: %d formas" % len(gloss))
    except FileNotFoundError as e:
        print("aviso: sin glosario (%s)" % e)

    if problems:
        print("ATENCIÓN, %d problemas:" % len(problems))
        for p in problems:
            print("  -", p)

    out = os.path.join(DATA, "course.json")
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(course, fh, ensure_ascii=False, separators=(",", ":"))
    from collections import Counter
    print("semanas: %d  ítems: %d  %s" % (len(weeks), len(authored),
          dict(Counter(i["type"] for i in authored).most_common())))
    print("lecciones: %d  bloques: %d  palabras de la semana: %d" % (
        len(lessons), sum(len(l["blocks"]) for l in lessons.values()), sum(len(w["vocab"]) for w in weeks)))
    empty = [w["week"] for w in weeks if not w["items"]]
    if empty:
        print("semanas sin ítems:", empty)
    print("-> %s (%.0f KB)" % (out, os.path.getsize(out) / 1024))
    if "--strict" in sys.argv and problems:
        sys.exit(1)


def _review_part(it, parts):
    """Un ítem de otra semana (repaso de un jefe) va a la última parte."""
    return len(parts) - 1


if __name__ == "__main__":
    main()
