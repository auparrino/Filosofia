"""Los chequeos del contenido de filosofía (en npm test).

- Los datos de lectura (docs/lang/<edición>/data/) están al día con la
  fuente: npm run build no cambiaría nada.
- Cada semana, lo que pide tools/curso/validar_semana.py (la lección en 3
  partes y 9 bloques, 12 conceptos que no se repiten entre semanas, el
  seminario con tramos, mapa y modelo, los dilemas); los ejemplos entre
  comillas «…» dicen de dónde salen (obra, fragmento, «atribuido»…).
- La literatura: cada semana (salvo las de repaso) trae al menos cuatro
  obras de ficción con el porqué (tools/curso/literatura.py).
- Los datos no llevan lo que ya no se muestra (ejercicios, chequeos,
  preguntas, consigna, rúbrica, socráticas).
- Lo que se ve de la app (index.html, manifest, el código y los estilos de
  docs/, sin sus comentarios) no dice La Via C1, Rumo C1, Weg C1, «C1» ni
  «italiano».

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


# the source builds every edition it lists, and docs/ has exactly that
FORBIDDEN = {"items", "q", "preguntas", "chequeo", "escribir", "consigna", "rubrica", "socraticas"}


def keys_in(x, out):
    if isinstance(x, dict):
        out.update(x)
        for v in x.values():
            keys_in(v, out)
    elif isinstance(x, list):
        for v in x:
            keys_in(v, out)
    return out


for ed in build_course.EDITIONS:
    files = build_course.build(ed)
    d = build_course.out_dir(ed)
    on_disk = sorted(f for f in os.listdir(d) if f.endswith(".json")) if os.path.isdir(d) else []
    if on_disk != sorted(files):
        err(ed, "%s tiene %s y el build arma %s: corré npm run build" % (os.path.relpath(d, ROOT), on_disk, sorted(files)))
    for name, content in files.items():
        path = os.path.join(d, name)
        if os.path.exists(path) and json.load(open(path, encoding="utf-8")) != json.loads(json.dumps(content, ensure_ascii=False)):
            err(ed, "%s no está al día con tools/curso: corré npm run build" % os.path.relpath(path, ROOT))
        bad = keys_in(content, set()) & FORBIDDEN
        if bad:
            err(ed, "%s lleva lo que la app ya no muestra: %s" % (name, sorted(bad)))

seen_vocab = {}
for w in curso.WRITTEN:
    check_week(w, err, seen_vocab)
waiting = [w["week"] for w in curso.WRITTEN if w not in curso.WEEKS]

# what is seen of the app does not say La Via
OLD = re.compile(r"La Via|Rumo C1|Weg C1|\bC1\b|[Ii]talian|[Pp]ortugu|[Aa]lemán")
visible = [os.path.join(ROOT, "docs", "index.html"), os.path.join(ROOT, "docs", "manifest.webmanifest")]
for dirpath, _, files in os.walk(os.path.join(ROOT, "docs")):
    # the interface, not the course: in philosophy «el idealismo alemán» is content
    visible += [os.path.join(dirpath, f) for f in files if f.endswith((".js", ".css", ".html")) and f != "index.html"]
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
            err("literatura", "la semana %d es de repaso: no trae obra nueva" % wk)
        continue
    if len(obras) < 4:
        err("literatura", "la semana %d tiene %d obras (mínimo 4)" % (wk, len(obras)))
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
if n_arg < 100:
    err("literatura", "pocas obras argentinas o latinoamericanas: %d (mínimo 100)" % n_arg)

# the syllabus: its branches are known ones
for t in temario.TEMARIO:
    for r in t["rama"]:
        from validar_semana import RAMAS
        if r not in RAMAS:
            err("temario semana %d" % t["n"], "rama desconocida %r" % r)

if errors:
    print("\n".join("FAIL " + e for e in errors))
    print("✗ curso: %d problemas" % len(errors))
    sys.exit(1)
if waiting:
    print("· escritas que esperan a una anterior: %s" % waiting)
print("✓ curso: %d semanas escritas, %d conceptos, %d obras literarias (%d argentinas o latinoamericanas), los datos de lectura al día, la marca limpia"
      % (len(curso.WEEKS), len(seen_vocab), n_obras, n_arg))
