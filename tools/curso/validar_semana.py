"""Los chequeos de una semana de contenido (los usa check_curso.py para todas).

Corre sola sobre una o más semanas, sin compilar el curso:
    python3 tools/curso/validar_semana.py 4 5 6

La app es de lectura: lo que pide una semana es lo que se lee (CONTENIDO.md).
- título, foco, tema, de 4 a 8 claves, ramas conocidas;
- la lección: 3 partes, al menos 9 bloques, cada uno con título (h) e idea
  (r); las citas («…») de los ejemplos, con su fuente;
- al menos 12 conceptos completos y que no se repitan entre semanas;
- el seminario: autor, obra, pasaje, contexto y derechos; de 3 a 6 tramos
  de 80 a 320 palabras; el mapa del argumento; el texto modelo («una
  lectura posible»); con derechos «breve», ninguna cita textual de más de
  60 palabras;
- al menos un dilema con dos o más posiciones completas.
Los ejercicios (items), los chequeos (q) y las preguntas, la consigna, la
rúbrica y las socráticas del seminario pueden estar en la fuente, pero ya no
se piden ni se muestran.
"""
import importlib.util
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

RAMAS = {"introducción", "lógica", "metafísica", "epistemología", "ética", "filosofía política", "estética",
         "antropología filosófica", "filosofía del lenguaje", "filosofía de la ciencia", "filosofía de la mente",
         "filosofía de la historia", "filosofía de la religión", "hermenéutica", "pensamiento argentino y latinoamericano"}
# A source: a work in italics, a fragment number, a chapter, «atribuido», «apócrifa», «según».
SOURCE = re.compile(r"\*[^*]+\*|\bDK\b|\b[IVX]+ \d|\bcap\.|§|\d+[a-e]\b|atribuid|apócrif|según|resum|citad|parágrafo|carta|libro|fragmento", re.I)

MIN = {"blocks": 9, "vocab": 12, "tramos": (3, 6), "palabras": (80, 320), "modelo": 80}


def words(s):
    return len(re.findall(r"\w+", s or ""))


def check_week(w, err, seen_vocab=None):
    """Every rule for one authored week; err(where, what) for each problem."""
    seen_vocab = {} if seen_vocab is None else seen_vocab
    tag = "semana %d" % w["week"]
    for k in ("title", "focus", "tema"):
        if not w.get(k):
            err(tag, "falta %s" % k)
    nk = len(w.get("keys", []))
    if not 4 <= nk <= 8:
        err(tag, "claves: %d (de 4 a 8)" % nk)
    for r in w.get("rama", []):
        if r not in RAMAS:
            err(tag, "rama desconocida %r" % r)
    if not w.get("rama"):
        err(tag, "sin rama")
    # the lesson
    lesson = w["lesson"]
    blocks = lesson["blocks"]
    if len(lesson["parts"]) != 3:
        err(tag, "la lección tiene %d partes (tienen que ser 3)" % len(lesson["parts"]))
    inparts = sorted(i for p in lesson["parts"] for i in p["blocks"])
    if inparts != list(range(len(blocks))):
        err(tag, "cada bloque tiene que estar en una sola parte: %s" % inparts)
    if len(blocks) < MIN["blocks"]:
        err(tag, "bloques: %d (mínimo %d)" % (len(blocks), MIN["blocks"]))
    for i, b in enumerate(blocks):
        bt = "%s bloque %d" % (tag, i)
        if not (b.get("h") and b.get("r")):
            err(bt, "título (h) e idea (r)")
        for e in b.get("ex", []):
            if len(e) != 2:
                err(bt, "un ejemplo es [texto, comentario]")
            elif e[0].lstrip().startswith("«") and not SOURCE.search(e[1] or ""):
                err(bt, "cita sin fuente: %s" % e[0][:60])
    # the concepts
    for v in w.get("vocab", []):
        if len(v) != 4 or not all(v):
            err(tag, "concepto incompleto: %r" % (v[:1],))
        elif v[0] in seen_vocab and seen_vocab[v[0]] != w["week"]:
            err(tag, "«%s» ya estaba en la semana %d" % (v[0], seen_vocab[v[0]]))
        else:
            seen_vocab[v[0]] = w["week"]
    if len(w.get("vocab", [])) < MIN["vocab"]:
        err(tag, "conceptos: %d (mínimo %d)" % (len(w.get("vocab", [])), MIN["vocab"]))
    # the seminar
    sm = w.get("seminario")
    st = tag + " seminario"
    if not sm:
        err(tag, "falta el seminario")
    else:
        for k in ("autor", "obra", "pasaje", "contexto"):
            if not sm.get(k):
                err(st, "falta %s" % k)
        if sm.get("derechos") not in ("dp", "breve"):
            err(st, "derechos tiene que ser «dp» o «breve»")
        tr = sm.get("tramos", [])
        if not MIN["tramos"][0] <= len(tr) <= MIN["tramos"][1]:
            err(st, "tramos: %d (de %d a %d)" % ((len(tr),) + MIN["tramos"]))
        for i, t in enumerate(tr):
            nw = words(t.get("texto"))
            if not MIN["palabras"][0] <= nw <= MIN["palabras"][1]:
                err(st, "tramo %d: %d palabras (de %d a %d)" % ((i + 1, nw) + MIN["palabras"]))
            if sm.get("derechos") == "breve":
                for m in re.finditer(r"«([^»]*)»", t.get("texto", "")):
                    if words(m.group(1)) > 60:
                        err(st, "tramo %d: cita textual de %d palabras (con derechos «breve», hasta 60)" % (i + 1, words(m.group(1))))
        mp = sm.get("mapa") or {}
        if not (mp.get("conclusion") and len(mp.get("premisas", [])) >= 2 and mp.get("objecion") and mp.get("replica")):
            err(st, "el mapa: conclusión, al menos dos premisas, objeción y réplica")
        modelo = (sm.get("escribir") or {}).get("modelo")
        if words(modelo) < MIN["modelo"]:
            err(st, "el texto modelo («una lectura posible»): %d palabras (mínimo %d)" % (words(modelo), MIN["modelo"]))
    # the dilemmas
    dl = w.get("dilemas") or []
    if not dl:
        err(tag, "falta al menos un dilema")
    for i, d in enumerate(dl):
        if not (d.get("caso") and d.get("pregunta")) or len(d.get("opciones", [])) < 2:
            err(tag, "dilema %d: caso, pregunta y al menos dos posiciones" % (i + 1))
        for o in d.get("opciones", []):
            if not all(o.get(k) for k in ("texto", "escuela", "porque", "objecion")):
                err(tag, "dilema %d: cada posición con texto, escuela, porqué y objeción" % (i + 1))
    return {"blocks": len(blocks), "vocab": len(w.get("vocab", [])),
            "tramos": len((sm or {}).get("tramos", [])), "dilemas": len(dl)}


def load(n):
    f = os.path.join(HERE, "semanas", "w%02d.py" % n)
    spec = importlib.util.spec_from_file_location("semana_w%02d" % n, f)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.WEEK


def main(args):
    import temario
    bad = 0
    for a in args:
        n = int(a)
        t = temario.TEMARIO[n - 1]
        if t["exam"]:
            print("· semana %d: es el repaso de la estación, no se escribe (la arma el build)" % n)
            continue
        problems = []
        w = load(n)
        if w["week"] != n:
            problems.append(("semana %d" % n, "el archivo dice week=%d" % w["week"]))
        stats = check_week(w, lambda where, what: problems.append((where, what)))
        for where, what in problems:
            print("FAIL %s: %s" % (where, what))
        bad += len(problems)
        print("%s semana %d («%s», temario: «%s»): %s" % ("✗" if problems else "✓", n, w["title"], t["title"],
              ", ".join("%s %d" % kv for kv in stats.items())))
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main(sys.argv[1:])
