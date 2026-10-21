# Cómo se escribe el contenido

Esto es para quien escribe o corrige semanas de Ágora: dónde va cada cosa,
cómo se arma y qué lo controla. La arquitectura del código está en
[ARQUITECTURA.md](ARQUITECTURA.md) y el temario, en [PLAN.md](PLAN.md).

Ágora es una **app de lectura**: cada semana se lee de corrido, como un
capítulo, y después se relee en el repaso. No hay preguntas ni ejercicios
en la pantalla. Lo que se escribe tiene que explicar y hacerse leer.

## Reglas

- **Castellano rioplatense, con voseo**, en todo lo que lee el lector:
  «Fijate», «Pensá en», «Vas a ver». Las ediciones en otras lenguas traducen
  desde este texto.
- **Toda cita lleva su fuente.** Se da la obra y el pasaje (*República*
  514a, *Metafísica* I 3, 983b) o el fragmento en Diels-Kranz (DK 22 B 91).
  Lo que es un resumen o una atribución se dice («según Aristóteles»,
  «atribuido a…»). Una frase famosa que el autor no escribió se presenta como
  **apócrifa**, y mejor todavía si se cuenta en un «Ojo» (`warn`).
- **Nada antes de su semana.** La semana N no explica un autor que llega
  después. Sí puede anunciarlo («lo vas a ver en la semana 22»).
- **Explicar, no listar.** Cada bloque dice la idea y por qué importa; los
  ejemplos y las citas la muestran; el «Ojo» dice con qué se confunde.
- **Los conceptos no se repiten.** El repaso del lector está atado a cada
  concepto por su semana y su término: corregir la definición no cambia
  nada, pero cambiar el término crea una tarjeta nueva (la vieja se borra
  sola).

## Dónde va cada cosa

| Qué | Dónde | Qué lo controla |
|---|---|---|
| Estaciones, épocas (la estética) y la carga de las semanas | `tools/curso/curso.py` | `tools/curso/check_curso.py`, `tools/lib/test_lector.js` |
| Una semana: título, foco, ramas, claves, lección, seminario, dilemas y conceptos | `tools/curso/semanas/wNN.py` | `tools/curso/validar_semana.py`, `tools/curso/check_curso.py` |
| Las funciones del contenido (`tramo`, `mapa`, `seminario`, `opcion`, `dilema`) | `tools/curso/ej.py` | `tools/curso/build_course.py` |
| La literatura de cada semana | `tools/curso/literatura.py` | `tools/curso/check_curso.py` |
| Los datos de lectura de cada edición | `docs/lang/<edición>/data/` (generados: no se editan) | `check_curso.py` (al día con la fuente), `test_lector.js`, el CI |
| La estética de las ocho épocas | `docs/lang/<edición>/theme.css` | `tools/lib/smoke.js` (ocho estéticas distintas) |

## Una semana

Una semana es un módulo `tools/curso/semanas/wNN.py` con `WEEK = {...}`.
Sigue el temario (`tools/curso/temario.py`: título, ramas, qué cubre y la
fuente del seminario) y su literatura (`tools/curso/literatura.py`). El
modelo es `tools/curso/semanas/w01.py`. Las semanas 13, 26, …, 117 no se
escriben: son el **repaso de la estación**, y el build las arma con lo
esencial de cada semana de la estación.

En la app, la semana se lee en este orden: lo esencial, la lección, el
texto, el argumento, una lectura posible, un caso, los conceptos y la
literatura.

**Lo esencial:**

- `week`, `title` (el del temario), `level` («Nivel N», N = la estación) y
  `rama` (las del temario);
- `focus` (una o dos oraciones: de qué se trata), `tema` (la línea que se ve
  en el índice) y `keys` (de 4 a 8 claves con *cursiva* y **negrita**).
  Las claves son también la tarjeta de resumen del repaso.

**La lección** (`lesson`):

- `intro`;
- `parts`: exactamente 3, cada una con su título y sus bloques;
- `blocks`: **al menos 9**. Cada bloque tiene:
  - `h`, el título, y `r`, la idea, en 2 a 5 oraciones;
  - opcionales: `table` (`head` y `rows`), `ex` (pares [cita o ejemplo,
    fuente o comentario]: si empieza con «, se muestra como cita), `warn`
    (el «Ojo»: la confusión típica, o la cita apócrifa), `tip` (un
    recuadro, «Fijate») y `more` (para ir más lejos).

**El texto** (`seminario(...)`):

- **La fuente:** `autor`, `obra`, `pasaje` (la del temario, o una mejor si
  hace falta) y `contexto`, en 2 a 4 oraciones: quién, cuándo, contra quién,
  y si la traducción es nuestra.
- **Los derechos** (la app los avisa arriba del texto):
  - `"dp"`: el autor murió hace más de 70 años. El texto va en traducción
    propia, abreviada si hace falta, fiel al original.
  - `"breve"`: si no, el texto va **en nuestras palabras** («Rawls propone…»),
    con citas textuales cortas, de 60 palabras como mucho cada una.
    `traduccion="resumen"`.
- **De 3 a 6 tramos** (`tramo(texto, preguntas, glosas)`), de 80 a 320
  palabras cada uno. Las glosas ([palabra, explicación]) se muestran como
  notas debajo del tramo.
- **El argumento** (`mapa(conclusion, premisas, objecion, replica,
  implicita)`): se lee como un razonamiento, las premisas en orden hasta la
  conclusión, la premisa que no se dice, la objeción más fuerte y la
  réplica.
- **Una lectura posible:** el `modelo`, de 120 a 250 palabras (al menos
  80): una posición propia frente al texto, con razones.

**Un caso** (`dilemas`, **al menos uno**): `dilema(caso, pregunta,
[opcion(...)…], despues)`. Es un caso sin respuesta correcta, y se lee
entero: cada `opcion(texto, escuela, porque, objecion)` dice quién la
sostendría (con la semana, si es de otra), por qué y la objeción que tiene
que responder; `despues` es una vuelta del caso.

**Los conceptos** (`vocab`, **al menos 12**): cada uno [término, definición,
ejemplo o cita, con qué no confundirlo]. Van al glosario y al repaso. Un
concepto no se repite en dos semanas: antes de agregar uno, buscalo con
`grep -rn '\["término"' tools/curso/semanas/`.

**Lo que ya no se muestra.** Los ejercicios (`items`, con `ch`, `cz`, `ty`
y `ap`), los chequeos `q(...)` de los bloques y de los tramos, las
preguntas de los tramos, la consigna, la rúbrica y las preguntas socráticas
del seminario eran del curso-juego. Pueden quedar en la fuente (las 108
semanas los tienen), pero no son obligatorios, el build no los pone en los
datos y la app no los muestra.

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
Después, `npm run build` (y commiteá lo que cambie en
`docs/lang/<edición>/data/`) y `npm test`.
