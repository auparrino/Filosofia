# Cómo se escribe el contenido

Esto es para quien escribe o corrige semanas de Ágora: dónde va cada cosa,
cómo se arma y qué lo controla. La arquitectura del código está en
[ARQUITECTURA.md](ARQUITECTURA.md) y el temario, en [PLAN.md](PLAN.md).

## Reglas

- **Castellano rioplatense, con voseo**, en todo lo que lee el alumno:
  «Elegí», «Completá», «Fijate». Las ediciones en otras lenguas traducen
  desde este texto.
- **Toda cita lleva su fuente.** Se da la obra y el pasaje (*República*
  514a, *Metafísica* I 3, 983b) o el fragmento en Diels-Kranz (DK 22 B 91).
  Lo que es un resumen o una atribución se dice («según Aristóteles»,
  «atribuido a…»). Una frase famosa que el autor no escribió se presenta como
  **apócrifa**, y mejor todavía si se usa como trampa en un ejercicio.
- **Nada antes de su semana.** Un ejercicio de la semana N no pregunta por un
  autor que llega después. Sí puede anunciarlo («lo vas a ver en la semana
  22») en una nota.
- **El distractor enseña.** Las opciones equivocadas son las confusiones
  reales: la escuela vecina, el autor contemporáneo, la tesis contraria. Un
  distractor que se descarta solo por el sentido no enseña nada.
- **Cada ejercicio explica.** La `note` dice por qué esa es la respuesta, y,
  si hace falta, de dónde sale.
- **Los ids son estables.** El repaso espaciado del alumno está atado al id
  de cada ejercicio (`f01-007` es el séptimo de la semana 1). Para corregir
  un ejercicio, reescribilo en su lugar; no lo saques ni lo muevas, porque
  cambian los ids de los que siguen. Uno nuevo va al final de la lista.

## Dónde va cada cosa

| Qué | Dónde | Qué lo controla |
|---|---|---|
| Estaciones, épocas (la estética) y la carga de las semanas | `tools/curso/curso.py` | `tools/curso/test_curso.js` |
| Una semana: título, foco, ramas, claves, lección, ejercicios y conceptos | `tools/curso/semanas/wNN.py` | `tools/curso/check_curso.py`, `tools/curso/test_curso.js`, `npm run sim` |
| Las funciones de los ejercicios | `tools/curso/ej.py` | `build_course.py` (rechaza un tipo desconocido) |
| El curso compilado de cada edición | `docs/lang/<edición>/data/course.json` (generado: no se edita) | `check_curso.py` (al día con la fuente), el CI |
| Los textos de la interfaz, los rangos y las medallas | `docs/lang/<edición>/lang.js` y `rules.js` | `test_curso.js`, `smoke_curso.js` |
| La estética de las seis épocas | `docs/lang/<edición>/theme.css` | `smoke_curso.js` (seis fondos distintos) |

## Una semana

Una semana es un módulo `tools/curso/semanas/wNN.py` con `WEEK = {...}`:

- `week`, `title`, `level` («Nivel 1» a «Nivel 4», uno por estación);
- `rama`: una o más de las ramas que conoce `check_curso.py` (lógica,
  ética, epistemología, metafísica, filosofía política, estética, del
  lenguaje, de la mente, de la ciencia, de la historia, de la religión,
  antropología filosófica, hermenéutica, pensamiento argentino y
  latinoamericano);
- `focus` (una línea), `fare` (lo que vas a poder hacer), `tema` y `keys`
  (de 4 a 7 claves, con *cursiva* y **negrita**);
- `lesson`: `intro`, `parts` (tres partes, cada una con sus bloques) y
  `blocks`. Cada bloque tiene:
  - `h`, el título, y `r`, la idea;
  - opcionales: `table` (`head` y `rows`), `ex` (pares [cita o ejemplo,
    fuente o comentario]), `warn` (la confusión típica), `tip` y `more`;
  - `q`, uno o más chequeos hechos con `q(...)`;
- `items`: entre 30 y 40 ejercicios, hechos con:
  - `ch(parte, consigna, enunciado, respuesta, opciones, nota)`: elegir.
    Sirve para ¿quién lo dijo?, ¿de qué escuela?, ¿cuál es la conclusión?,
    ¿mito o logos?, la trampa;
  - `cz(parte, consigna, enunciado con ___, respuesta, aceptadas, nota)`:
    completar el concepto;
  - `ty(parte, consigna, enunciado, respuesta, aceptadas, nota)`: escribir
    un término;
- `vocab`: de 10 a 15 conceptos, cada uno [término, definición, ejemplo o
  cita, con qué no confundirlo]. Un concepto no se repite en dos semanas.

Cualquier texto puede ser un `str` (castellano) o un
`{"es": …, "it": …, "pt": …, "de": …}`. Una edición se suma a
`EDITIONS` en `build_course.py` cuando todos sus textos están.

Después de escribir: `npm run build`, `npm test` y `npm run sim`.
