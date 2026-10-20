"""Los chequeos del contenido de filosofía (en npm test).

- Cada semana, lo que pide tools/curso/validar_semana.py (lección, 45
  ejercicios con 40 % de aplicación, conceptos, seminario, dilemas).
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

from validar_semana import check_week  # noqa: E402
import temario  # noqa: E402

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
    check_week(w, err, seen_vocab)

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
for wk in range(1, len(temario.TEMARIO) + 1):
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
if n_arg < 25:
    err("literatura", "pocas obras argentinas o latinoamericanas: %d (mínimo 25)" % n_arg)

# the syllabus: its branches are known ones
for t in temario.TEMARIO:
    for r in t["rama"]:
        from validar_semana import RAMAS
        if r not in RAMAS:
            err("temario semana %d" % t["n"], "rama desconocida %r" % r)

n_items = sum(len(w["items"]) for w in curso.WEEKS)
if errors:
    print("\n".join("FAIL " + e for e in errors))
    print("✗ curso: %d problemas" % len(errors))
    sys.exit(1)
print("✓ curso: %d semanas, %d ejercicios, %d conceptos, %d obras literarias (%d argentinas o latinoamericanas), la marca limpia"
      % (len(curso.WEEKS), n_items, len(seen_vocab), n_obras, n_arg))
