"""Los chequeos del contenido de filosofía (en npm test).

- Cada semana: título, foco, claves, ramas conocidas, bloques con chequeo,
  conceptos con su definición, ejemplo y nota.
- Cada ejercicio trae su explicación (note); los de «¿Quién lo dijo?» y
  los ejemplos entre comillas «…» dicen de dónde salen (obra, fragmento,
  «atribuido», «apócrifa»…).
- Las opciones no se repiten y la respuesta está entre ellas.
- La literatura: cada semana (salvo las de examen) trae al menos una obra
  de ficción con el porqué (tools/curso/literatura.py).
- Lo que se ve de la app (index.html, manifest, los paquetes) ya no dice
  La Via C1, Rumo C1, Weg C1 ni «italiano».

Run: python3 tools/curso/check_curso.py
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import build_course  # noqa: E402
import curso  # noqa: E402

RAMAS = {"introducción", "lógica", "metafísica", "epistemología", "ética", "filosofía política", "estética",
         "antropología filosófica", "filosofía del lenguaje", "filosofía de la ciencia", "filosofía de la mente",
         "filosofía de la historia", "filosofía de la religión", "hermenéutica", "pensamiento argentino y latinoamericano"}
# A source: a work in italics, a fragment number, a chapter, «atribuido», «apócrifa», «según».
SOURCE = re.compile(r"\*[^*]+\*|\bDK\b|\b[IVX]+ \d|\bcap\.|§|\d+[a-e]\b|atribuid|apócrif|según|resum|citad", re.I)

errors = []


def err(where, msg):
    errors.append("%s: %s" % (where, msg))


# the source builds every edition it lists
for ed in build_course.EDITIONS:
    course = build_course.build(ed)
    path = build_course.out_path(ed)
    if not os.path.exists(path):
        err(ed, "falta %s: corré npm run build" % os.path.relpath(path, ROOT))
    elif json.load(open(path, encoding="utf-8")) != json.loads(json.dumps(course, ensure_ascii=False)):
        err(ed, "%s no está al día con tools/curso: corré npm run build" % os.path.relpath(path, ROOT))

seen_vocab = {}
for w in curso.WEEKS:
    tag = "semana %d" % w["week"]
    for k in ("title", "focus", "fare", "tema"):
        if not w.get(k):
            err(tag, "falta %s" % k)
    if len(w.get("keys", [])) < 4:
        err(tag, "claves: %d (mínimo 4)" % len(w.get("keys", [])))
    for r in w.get("rama", []):
        if r not in RAMAS:
            err(tag, "rama desconocida %r" % r)
    if not w.get("rama"):
        err(tag, "sin rama")
    blocks = w["lesson"]["blocks"]
    for i, b in enumerate(blocks):
        bt = "%s bloque %d" % (tag, i)
        if not (b.get("h") and b.get("r")):
            err(bt, "título y regla")
        if not b.get("q"):
            err(bt, "sin chequeo")
        for e in b.get("ex", []):
            if e[0].lstrip().startswith("«") and not SOURCE.search(e[1] or ""):
                err(bt, "cita sin fuente: %s" % e[0][:60])
    for k, it in enumerate(w["items"], 1):
        it_tag = "%s ejercicio %d" % (tag, k)
        if not it.get("note"):
            err(it_tag, "sin explicación (note)")
        if it.get("options"):
            if it["answer"] not in it["options"]:
                err(it_tag, "la respuesta no está entre las opciones")
            if len({o.lower() for o in it["options"]}) != len(it["options"]):
                err(it_tag, "opciones repetidas")
        if it["type"] == "cloze" and "___" not in it["stem"]:
            err(it_tag, "cloze sin ___")
        if "Quién lo dijo" in it.get("prompt", "") and not SOURCE.search(it.get("note", "")):
            err(it_tag, "«¿Quién lo dijo?» sin fuente en la nota")
    for v in w.get("vocab", []):
        if len(v) != 4 or not all(v):
            err(tag, "concepto incompleto: %r" % (v[:1],))
        elif v[0] in seen_vocab:
            err(tag, "«%s» ya estaba en la semana %d" % (v[0], seen_vocab[v[0]]))
        else:
            seen_vocab[v[0]] = w["week"]
    if len(w.get("vocab", [])) < 8:
        err(tag, "conceptos: %d (mínimo 8)" % len(w.get("vocab", [])))

# what is seen of the app does not say La Via
OLD = re.compile(r"La Via|Rumo C1|Weg C1|\bC1\b|[Ii]talian|[Pp]ortugu|[Aa]lemán")
visible = [os.path.join(ROOT, "docs", "index.html"), os.path.join(ROOT, "docs", "manifest.webmanifest")]
for dirpath, _, files in os.walk(os.path.join(ROOT, "docs", "lang")):
    visible += [os.path.join(dirpath, f) for f in files if f.endswith((".js", ".json", ".css"))]
for f in visible:
    text = open(f, encoding="utf-8").read()
    # the comments of the code may tell where it comes from
    if f.endswith((".js", ".css")):
        text = re.sub(r"/\*.*?\*/|//[^\n]*", "", text, flags=re.S)
    for m in OLD.finditer(text):
        line = text[:m.start()].count("\n") + 1
        err(os.path.relpath(f, ROOT), "línea %d todavía dice «%s»" % (line, m.group(0)))

# the literature of each week (tools/curso/literatura.py)
import literatura  # noqa: E402
TIPOS = {"novela", "cuento", "poema", "teatro", "ensayo literario", "testimonio", "diálogo"}
n_obras = 0
for wk in range(1, 53):
    obras = literatura.LITERATURA.get(wk)
    if obras is None:
        err("literatura", "falta la semana %d" % wk)
        continue
    if wk in literatura.EXAM_WEEKS:
        if obras:
            err("literatura", "la semana %d es de examen: repasa, no trae obra nueva" % wk)
        continue
    if not obras:
        err("literatura", "la semana %d no tiene ninguna obra" % wk)
    for ob in obras:
        n_obras += 1
        tag = "literatura semana %d «%s»" % (wk, ob.get("obra", "?"))
        if not (ob.get("autor") and ob.get("obra") and isinstance(ob.get("año"), int)):
            err(tag, "autor, obra y año")
        if ob.get("tipo") not in TIPOS:
            err(tag, "tipo %r" % ob.get("tipo"))
        if len(ob.get("por_que") or "") < 40:
            err(tag, "falta decir por qué va en esta semana")
n_arg = sum(1 for obs in literatura.LITERATURA.values() for ob in obs if ob["arg"])
if n_arg < 15:
    err("literatura", "pocas obras argentinas o latinoamericanas: %d (mínimo 15)" % n_arg)

n_items = sum(len(w["items"]) for w in curso.WEEKS)
if errors:
    print("\n".join("FAIL " + e for e in errors))
    print("✗ curso: %d problemas" % len(errors))
    sys.exit(1)
print("✓ curso: %d semanas, %d ejercicios, %d conceptos, %d obras literarias (%d argentinas o latinoamericanas), la marca limpia"
      % (len(curso.WEEKS), n_items, len(seen_vocab), n_obras, n_arg))
