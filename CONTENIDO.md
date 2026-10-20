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

Una semana es un módulo `tools/curso/semanas/wNN.py` con `WEEK = {...}`.
Sigue el temario (`tools/curso/temario.py`: título, ramas, qué cubre y la
fuente del seminario) y su literatura (`tools/curso/literatura.py`). El
modelo es `tools/curso/semanas/w01.py`. Las semanas de examen (13, 26, …,
117) no se escriben: el build las arma con su estación.

El formato es **híbrido** (ver [FORMATO.md](FORMATO.md)): una práctica
diaria de 5 a 8 minutos (la lección, los ejercicios, los conceptos y los
dilemas) y un **seminario** semanal de 60 a 90 minutos (un texto en tramos,
el mapa del argumento y un escrito propio).

**Lo diario:**

- `week`, `title` (el del temario), `level` («Nivel N», N = la estación) y
  `rama` (las del temario);
- `focus`, `fare`, `tema` y `keys` (de 4 a 8 claves con *cursiva* y
  **negrita**);
- `lesson`:
  - `intro`;
  - `parts`: exactamente 3, cada una con sus bloques;
  - `blocks`: **al menos 9**. Cada bloque tiene:
    - `h`, el título, y `r`, la idea, en 2 a 5 oraciones;
    - opcionales: `table` (`head` y `rows`), `ex` (pares [cita o ejemplo,
      fuente o comentario]), `warn` (la confusión típica, o la cita
      apócrifa), `tip` y `more`;
    - `q`: 1 a 3 chequeos hechos con `q(...)`;
- `items`: **al menos 45**, y **al menos el 40 % de aplicación o análisis**,
  envueltos en `ap(...)`:
  - **de aplicación** son: ¿cuál es la conclusión?, ¿qué premisa falta?,
    ¿qué ataca esta objeción?, ¿qué falacia es?, ¿qué diría X de este caso
    nuevo?, ¿qué escuela razona así?, ¿es válido?, ¿hombre de paja o crítica
    justa?, clasificar un caso;
  - **de memoria** son: quién lo dijo, cuándo, qué significa un término.

  Se hacen con:
  - `ch(parte, consigna, enunciado, respuesta, opciones, nota)`, con 2 a 4
    opciones;
  - `cz(parte, consigna, enunciado con ___, respuesta, aceptadas, nota)`;
  - `ty(parte, consigna, enunciado, respuesta, aceptadas, nota)`.

  Todos llevan su nota, que dice por qué y de dónde sale.
- `vocab`: **al menos 12** conceptos, cada uno [término, definición, ejemplo
  o cita, con qué no confundirlo]. Un concepto no se repite en dos semanas:
  antes de agregar uno, buscalo con `grep -rn '\["término"' tools/curso/semanas/`.
- `dilemas`: **al menos uno**, con `dilema(caso, pregunta, [opcion(...)…],
  despues)`. Es un caso sin respuesta correcta. Cada `opcion(texto, escuela,
  porque, objecion)` dice quién la sostendría (con la semana, si es de otra),
  por qué, y la objeción que tiene que responder. `despues` es una vuelta del
  caso que pone a prueba si la elección es consistente.

**El seminario** (`seminario(...)`, una vez por semana):

- **La fuente:** `autor`, `obra`, `pasaje` (la del temario, o una mejor si
  hace falta) y `contexto`, en 2 a 4 oraciones: quién, cuándo, contra quién,
  y si la traducción es nuestra.
- **Los derechos:**
  - `"dp"`: el autor murió hace más de 70 años. El texto va en traducción
    propia, abreviada si hace falta, fiel al original.
  - `"breve"`: si no, el texto va **en nuestras palabras** («Rawls propone…»),
    con citas textuales cortas, de 60 palabras como mucho cada una.
    `traduccion="resumen"`.
- **De 3 a 6 tramos** (`tramo(texto, preguntas, glosas, chequeo)`), de 80 a
  320 palabras cada uno:
  - preguntas abiertas para pensar, no de memoria;
  - glosas: [palabra, explicación];
  - el chequeo, opcional: uno o dos `q(...)` de comprensión.
- **El mapa del argumento central** (`mapa(conclusion, premisas, objecion,
  replica, implicita)`).
- **La escritura:**
  - la consigna, entre 150 y 300 palabras: pide una posición propia con
    razones;
  - una rúbrica de 3 a 5 criterios (tesis, razones, conceptos, objeción…);
  - un `modelo` de 120 a 250 palabras, que se muestra después de escribir.
- **Al menos 4 preguntas socráticas** (`socraticas`). Son las que hace el
  tutor: preguntan y señalan tensiones, nunca dan la respuesta.

**La exactitud.** Una cita textual entre «» va solo si estás seguro de que
es del autor y de dónde sale. Si no, se parafrasea y se dice («en resumen»,
«según…»). Las referencias van en el formato de cada tradición:
- Platón por Stephanus (*República* 514a);
- Aristóteles por Bekker (*Ética a Nicómaco* II 6, 1106b);
- los presocráticos por Diels-Kranz (DK 22 B 91);
- Kant por A/B;
- el resto por libro, capítulo o parágrafo.

Las fechas y los datos dudosos se dicen como dudosos.

**Al terminar:** `python3 tools/curso/validar_semana.py NN` tiene que dar ✓.
Después, `npm run build`, `npm test` y `npm run sim`.
