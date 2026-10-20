# Cómo se aporta contenido (los dos idiomas)

Para quien escribe o corrige contenido de *La Via C1* (italiano) o de *Rumo C1*
(portugués de Brasil): dónde va cada cosa, cómo se construye y qué test la
controla. La arquitectura del código está en [ARQUITECTURA.md](ARQUITECTURA.md);
lo propio de cada idioma (variedad, ortografía, puntos críticos del
hispanohablante, claves del conjugador) está en `tools/pt/CONTENIDO.md` para el
portugués y en `README-italiano.md` y los docstrings de `tools/it/` para el
italiano.

## Reglas para los dos idiomas

- **Todo lo que lee el alumno fuera de la lengua meta** (consignas, notas,
  explicaciones, glosas) va en castellano rioplatense con voseo: «Elegí»,
  «Completá», «Traducí», «Fijate». Nada de inglés.
- **Nada antes de su teoría.** El contenido de la semana N solo usa la
  gramática de las semanas 1..N (`tools/<código>/sillabo.py`) y, en lo que el
  alumno escribe, palabras ya vistas (`tools/<código>/lessico.py`); en lo que
  lee se toleran palabras nuevas con glosa.
- **Contrastivo.** Las notas, las trampas y los distractores atacan el error
  que comete un hispanohablante, no uno cualquiera. Un distractor que se
  descarta por el sentido no enseña nada.
- **Ids estables.** Un ítem se identifica por su id (el repaso espaciado del
  alumno está atado a él). Para corregir un ítem se reescribe en su lugar; no se
  borra ni se mueve dentro de la lista si el id sale de la posición.
- **Sin repetidos.** El mismo enunciado con la misma respuesta en dos semanas
  hace fallar la simulación (`npm run sim`): la segunda vez se pide con otra frase.

## Dónde va cada cosa

`<código>` es `it` o `pt`. Lo que está en `tools/` se compila; lo que está en
`docs/lang/<código>/` y no dice «generado» se edita ahí mismo.

| Qué | Dónde se escribe | Qué lo controla |
|---|---|---|
| Temario: títulos, foco, verbos y tiempos del gimnasio por semana | `tools/it/build_course.py` (`WEEKS`) y `tools/it/sillabo.py`; `tools/pt/curriculo.py` | `test_game.js`, `sim_carriera.js` |
| Alemán (todo: lecciones, ejercicios y palabras de las seis semanas de A1) | `tools/de/curso.py` (lo compila `tools/de/build_course.py`) | `tools/de/test_curso.js`, `sim_carriera.js de`, `tools/lib/smoke_aleman.js` |
| Lecciones (teoría de las 52 semanas) | `tools/<código>/lessons/s1.py` … `s4.py` | `tools/it/check_lessons.py`, `tools/lib/test_lecciones.js`, `tools/lib/test_orden_lecciones.js` |
| Ítems de ejercicio | `tools/<código>/authored/*.py` (it además `tools/it/fuentes/`) | `test_game.js`, `tools/lib/test_notas_it.js`, `tools/lib/test_huecos.js`, la simulación |
| Banco (palabras, oraciones, errores, interferencias) | `tools/<código>/bank/*.py` | `build_bank.py` (descarta y avisa lo que no valida), `test_diagnosi.js`, `tools/lib/test_fix_banco.js` |
| Palabras de la semana | `tools/it/bank/parole_settimana.py`, `tools/it/bank/parole_c1.py`; `tools/pt/vocab/s*.py` | `test_game.js` |
| Frases de conversación (escenas) | `docs/lang/<código>/frasi_data.js` | `test_frasi.js`, `tools/lib/test_fix_frases.js` |
| Ruta de trabajo (escenas de oficina: diálogo, frases, ejercicios, mail) | `docs/lang/<código>/trabajo_data.js` | `tools/lib/test_trabajo.js`, `tools/it/check_trabajo.py` |
| Lectura de la semana | `docs/lang/<código>/letture_settimana.js` | `tools/it/check_letture.py`, `tools/pt/check_letture.py` |
| Lecturas en serie y de cultura | `docs/lang/<código>/letture_data.js` | `test_frasi.js` |
| Escucha, pares mínimos, dictogloss | `docs/lang/<código>/ascolto_data.js`, `docs/lang/<código>/dictogloss_data.js` | `test_suoni.js` |
| Laboratorio (cognados, falsos amigos, input estructurado) | `docs/lang/<código>/lab_data.js` | `test_frasi.js` |
| Escritura libre (*Scrivi*) | `TASKS` en `docs/lang/<código>/scrivi.js` | `test_scrivi.js` |
| Examen final C1 | `docs/lang/<código>/esame_data.js` y `tools/<código>/authored/esame_c1.py` | `test_suoni.js`, `test_game.js`; en portugués, `tools/lib/test_fix_contenido_pt.js` (las tres versiones de Estruturas y Léxico) |
| Tramo C1 (semanas 27-51: lectura, escucha y tarea largas) | `tools/<código>/tramo/wNN.json` y `generi.json` | `tools/lib/test_tramo.js` |
| Serie Radio / Rádio (semanas 6-25: un programa a dos voces por semana) | `tools/<código>/radio/wNN.json` y `serie.json` | `tools/lib/test_radio.js`, `tools/it/check_radio.py`, `tools/pt/check_radio.py` |
| Biblioteca (libros de dominio público) | `tools/lib/biblioteca_fuentes.js` | `tools/lib/test_biblioteca.js` |
| Tres lenguas (it ↔ pt ↔ es) | `docs/lang/tres_lenguas_data.js` | `tools/lib/test_tres_lenguas.js` |
| Voces reales del italiano | `tools/it/VOCES.md`, `tools/it/voci_cv.py` | `test_suoni.js` |

**Generados, no se editan a mano** (los rehace `npm run build`):
`docs/lang/<código>/data/course.json`, `bank.json` y `glossario.json`;
`docs/lang/<código>/tramo_data.js`; `docs/lang/<código>/radio_data.js`
(`tools/lib/build_radio.js`); `docs/lang/<código>/formule_data.js`
(`tools/lib/formule.py`); `docs/lang/<código>/biblioteca/*.json`
(`tools/lib/build_biblioteca.js`). `frequenza.json` lo arma
`tools/<código>/build_frequenza.py`, que necesita red y se corre a mano;
`docs/lang/it/voci_cv_data.js`, `tools/it/voci_cv.py`.

## Formatos mínimos

**Lección** (`tools/<código>/lessons/s*.py`): `LESSONS = {semana: lección}`.

```python
LESSONS = {
    5: {"intro": "Una o dos oraciones: qué vas a poder decir al final.",
        "parts": [{"h": "El presente regular", "blocks": [0, 1]}],
        "blocks": [
            {"h": "Tres terminaciones", "r": "La regla, corta.",
             "table": {"head": ["", "parlare"], "rows": [["io", "parl*o*"]]},
             "ex": [["Io *parlo* italiano.", "Hablo italiano."]],
             "warn": "La trampa del hispanohablante.", "tip": "El atajo.",
             "q": [["¿Pregunta?", ["buena", "mala", "otra"], "buena"]]},
        ]},
}
```

Límites y estilo: `tools/lib/test_lecciones.js` y `check_lessons.py` dicen qué
falla; en el texto, `*así*` marca una forma de la lengua meta.

**Ítem** (`tools/<código>/authored/*.py`): `ITEMS = [dict(...)]`, o los
atajos de cada módulo (`ch`, `cz`, `tr`, `fx`, `gd`…, definidos arriba de cada
archivo). Campos comunes: `id` único, `w` o `topic` para la semana, `level`,
`type`, `prompt` (la consigna), `stem`, `answer`, `accept`/`alt` (otras
respuestas buenas), `note` (la regla en una o dos oraciones). Por tipo:
`choice` lleva `options` con la respuesta entre ellas; `cloze` un `___` en el
`stem`; `translate` el castellano en `stem` y todas las variantes razonables;
`fixerr` el fragmento mal y el bien; `garden` tres ejemplos y la forma que el
patrón hace equivocar. El detalle de cada tipo está en `tools/pt/CONTENIDO.md`.

**Semana del tramo C1** (`tools/<código>/tramo/wNN.json`):

```json
{"week": 27, "level": "B2",
 "lettura": {"title": "", "emoji": "", "genre": "", "grammar": "", "text": "",
             "gloss": {}, "questions": [["¿…?", ["a", "b", "c", "d"], "a"]],
             "vf": [["Afirmación.", "vero"]], "hunt": {}},
 "ascolto": {"title": "", "genre": "", "es": "", "speakers": [], "turns": [["A", "…"]],
             "gloss": {}, "questions": [], "vf": []},
 "compito": {"genre": "", "title": "", "fonte": "", "t": "", "es": "", "min": 120,
             "max": 180, "punti": [], "model": "", "gloss": {}},
 "breve": {"title": "", "genre": "", "es": "", "speaker": "", "voice": 0,
           "text": ["párrafo", "…"], "tabella": [["dato", "respuesta", ["otras formas"]]],
           "info": [["Afirmación.", true]], "gloss": {}}}
```

`breve` es la escucha corta de monólogo (los dos idiomas): 110-320 palabras,
4-6 datos en la tabla, seis afirmaciones (tres que el audio dice y tres que
no); en portugués, `cellStop` de `generi.json` dice qué palabras no cuentan en
la tabla (*às*, *horas*, *reais*).

**Lectura de la semana** (`letture_settimana.js`): `{ id: "w-NN", week, n,
level, emoji, title, grammar, text, gloss: {palabra: "glosa"}, questions:
[[pregunta, opciones, respuesta]], vf: [[afirmación, "vero"|"falso"|…]] }`.

**Dictogloss** (`dictogloss_data.js`): `{ week, level, title, es, text,
chunks: [seis bloques a recuperar], keywords, gloss }`.

**Frase** (`frasi_data.js`): cada escena `{ id, week, emoji, name, blurb,
phrases: [[lengua meta, castellano, nota]] }`.

**Escena de trabajo** (`trabajo_data.js`): `{ id: "t-…", week, level, emoji,
name, blurb, grammar, situazione, dialogo: [[quién, lengua meta, castellano]],
gloss, phrases: [[lengua meta, castellano, nota, registro]], items: [ítems
translate, cloze, typed o fixerr], compito: {genre, title, min, max, t, punti,
model} }`. Los ítems vuelven al repaso por su posición (`trab:<escena>:<n>`):
se corrigen en su lugar, no se insertan en el medio.

## Construir y probar

```sh
npm run build        # banco y curso de los dos idiomas, fórmulas, tramo C1 y Biblioteca
npm test             # test:it + test:pt + test:lib + test:content
npm run test:content # check_lessons.py y check_letture.py (it) y check_letture.py (pt)
npm run sim          # un año simulado por idioma; falla si una semana no se domina,
                     # si el gimnasio no puede armar un ejercicio o si hay ítems repetidos
npm run lint         # eslint sobre docs/ (claves repetidas, nombres sin definir…)
npm run smoke        # la app entera en Chromium (necesita Playwright)
```

- `tools/<código>/test_*.js`: el conjugador, el curso compilado y la lógica
  del juego (`test_game.js`), frases y laboratorio (`test_frasi.js`), el
  diagnóstico con errores inyectados (`test_diagnosi.js`), *Scrivi*
  (`test_scrivi.js`), la memoria (`test_memoria.js`), sonidos, dictogloss y
  examen (`test_suoni.js`).
- `tools/lib/test_*.js`: lo común a los dos idiomas (cada archivo dice en su
  encabezado qué controla); `tools/lib/test_rutas.js` controla que las rutas
  citadas en los `.md` existan y `tools/lib/test_version.js` que
  `package.json`, `docs/js/app.js` y `docs/sw.js` digan la misma versión.
- Un test nuevo usa `tools/lib/testkit.js` (`ok`, `eq`, `done`: cuenta, avisa
  cada falla y termina con código de error), como los `test_*.js` de cada idioma.
- **CI** (`.github/workflows/test.yml`), en cada push: `npm test`, `npm run
  lint`, `npm run sim`, que `npm run build` no cambie nada de `docs/` (ni deje
  archivos nuevos) y la prueba de humo en Chromium. Si cambiaste una fuente y
  no corriste el build, el CI lo dice.
