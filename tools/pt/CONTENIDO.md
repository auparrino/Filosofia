# Cómo se escribe el contenido de Rumo C1

Rumo C1 es la versión portuguesa de *La Via C1* (el curso-juego de italiano,
en este mismo repo). Mismo motor, misma didáctica; el contenido es nuevo y
está pensado para **hispanohablantes rioplatenses que aprenden portugués de
Brasil** hasta C1 en un año (52 semanas).

Lo común a los dos idiomas (dónde va cada cosa, qué se genera, cómo se
construye y qué controla cada test) está en `CONTENIDO.md`, en la raíz. Acá
queda lo propio del portugués: la variedad, la ortografía, los puntos
críticos del hispanohablante, el temario, el conjugador y el detalle de los
tipos de ítem.

## Reglas generales

- **Variedad**: portugués brasileño, norma urbana culta. Lo coloquial (a
  gente, pra, tá, vi ele, me dá) se enseña como tal y se marca. Portugal y
  África aparecen como variantes (semana 46), nunca como modelo.
- **Ortografía**: Acuerdo Ortográfico de 1990 (vigente en Brasil): *ideia*,
  *voo*, *linguiça*, *para* (sin tilde), sin diéresis. Revisá tildes: *você,
  três, avô/avó, é/e, está, português, ônibus, também, porém, saída*.
- **Idioma de la interfaz y las explicaciones**: español rioplatense con voseo,
  como en la app de italiano: «Elegí», «Completá», «Traducí al portugués»,
  «Escuchá», «Fijate». Nada de inglés.
- **Enfoque contrastivo**: lo que más rinde es atacar dónde el español hace
  tropezar (bibliografía de Português para Falantes de Espanhol: Almeida
  Filho; Grannier «pontos críticos»; Akerberg; Ferreira; Durão). Lista de
  puntos críticos para usar en notas, trampas y distractores:
  - contracciones obligatorias (*no, na, do, pelo, ao, à, num, dele, neste*);
  - artículo ante posesivo y ante nombre propio (*a minha casa, o João*);
  - *muito* (nunca *muy*), *mais* (nunca *más*), *tudo/todo*;
  - *gostar de* (el que gusta es sujeto), *precisar de*, *lembrar de*,
    *pensar em*, *sonhar com*, *casar com*, *namorar* (sin preposición);
  - sin «a» personal: *vi o João*, *conheço a Maria* (acá *a* es artículo);
  - *pretérito perfeito composto* ≠ pretérito perfecto español (*tenho
    feito* = vengo haciendo); «he comido» = *comi*;
  - *futuro do subjuntivo* (*quando eu for, se você quiser*) e
    *infinitivo pessoal* (*para eles saberem*), que el español no tiene;
  - heterogenéricos (*o leite, o sangue, o nariz, a árvore, a ponte, a dor,
    a viagem, o costume, a origem, o mel, o sal*), heterotónicos (*academia,
    alergia, polícia, nível, cérebro, oxigênio*), heterosemánticos o falsos
    amigos (*esquisito, polvo, borracha, apelido, oficina, escritório,
    exquisito → delicioso, embaraçada, largo, pelado, cena, sobremesa,
    ninho, rato, taça, copo, vaso, salada, ...*);
  - plurales en *-ões/-ães/-ãos*, *-is*, *-ns*;
  - *você* con verbo en tercera persona; *a gente* con verbo en singular;
  - pronombres: *para mim* (no *para mí*), *comigo, conosco*, *lhe*,
    posición de los clíticos (próclise en el habla, ênclise en lo formal);
  - *seu* ambiguo → *dele/dela*;
  - crase (*à, às, àquele*);
  - sonidos: vocales abiertas/cerradas (*avó/avô, sede/sede*), nasales
    (*mão, bom, sim, mãe*), *lh/nh*, *-l* final = u, *ti/di* = chi/yi,
    *r* inicial y *rr* aspirada, *s/z* sonora (*casa* con z), *v ≠ b*,
    *e/o* finales átonas que suenan *i/u* (*leite* ≈ «leiti»);
  - grafías del español que se cuelan: *ñ → nh*, *ll → lh*, *-ción → -ção*,
    *-dad → -dade*, *j/g → j* (*hoje, gente*), *y → e* (conjunción), *-ble →
    -vel* (*possível*), *ue → o* (*porta*, no *puerta*), *ie → e* (*terra*).
- **Nombres y ciudades**: brasileños y argentinos mezclados (Martín, Sofía,
  Lucas, Ana, João, Bia, Rafa…; Buenos Aires, Rosario, Córdoba, Rio, São
  Paulo, Salvador, Recife, Florianópolis, Porto Alegre, Belo Horizonte…).
  Cultura brasileña real y verificable (no inventes datos ni citas; si una
  frase famosa es apócrifa, decilo).

## El temario manda

`tools/pt/curriculo.py` es la fuente única: `WEEKS` (título, foco, puntos
clave, verbos del gimnasio, tiempos), `SAI_FARE` (función comunicativa y
campo léxico) y `TENSE_WEEK` (semana en que se enseña cada tiempo).

**Nada antes de su teoría**: el contenido de la semana N solo usa gramática
de las semanas 1..N. Presente regular desde la 5 (ser, estar, ter desde la
1; en las semanas 1-4 los enunciados pueden usar presente en lo que solo se
lee, y las respuestas solo *ser/estar/ter* y formas fijas como *chamo-me /
me chamo*, *gosto de*). Perfeito desde la 11, imperfeito desde la 15,
subjuntivo presente desde la 23, futuro do subjuntivo desde la 27, etc.
Vocabulario: lo que el alumno **escribe** tiene que ser vocabulario ya visto
o transparente para un hispanohablante; en lo que **lee** se toleran
palabras nuevas glosadas.

## Claves del conjugador (`docs/lang/pt/conjugator.js`, `window.Conj`)

Personas (índices 0-5): `["eu", "tu", "ele/ela/você", "nós", "vós",
"eles/elas/vocês"]`. *vós* existe en las tablas pero nunca se ejercita;
*tu* aparece poco (se usa en el Sur y el Norte de Brasil, y conjugado así
en el habla carioca solo a veces).

Tiempos simples: `presente, perfeito, imperfeito, maisQuePerfeito, futuro,
condicional, subjPresente, subjImperfeito, subjFuturo, infPessoal`.
Compuestos (ter + participio): `perfeitoComposto, maisQuePerfeitoComposto,
futuroComposto, condicionalComposto, subjPerfeito, subjMaisQuePerfeito,
subjFuturoComposto`. Además `imperative(inf)`, `participle(inf)`
(con participios dobles), `gerund(inf)`.

## Ítems de ejercicio (`tools/pt/authored/*.py`)

Cada módulo define `ITEMS = [dict(...), ...]`. Campos comunes:

- `id` único y estable (prefijo del módulo, ej. `s1-05-12`), `w` (semana,
  obligatorio), `part` (índice de la parte de la lección de esa semana,
  opcional), `level` (A1…C1), `type`, `prompt` (consigna en español),
  `stem`, `answer`, `alt` (otras respuestas aceptadas), `note` (la regla
  explicada, 1-2 oraciones, que se muestra al responder).
- **Consigna en portugués** (v3): el `prompt` se escribe en castellano y
  `tools/pt/consignas.py` lo pasa al portugués en el build: las simples
  (*Complete. Escolha a forma correta. Traduza para o português.*) desde la
  semana 14, todas desde la 27. Una consigna nueva de la 27 en adelante
  tiene que estar en esa tabla (el build lo avisa; `--strict` falla). La
  `note` queda en castellano. Las preguntas de lectura de la 27 en adelante
  se escriben directamente en portugués.
- `choice`: `options` (3 o 4, la respuesta entre ellas). **Distractores
  parecidos**: la misma forma con el error típico del hispanohablante, otras
  personas del mismo verbo, otros miembros de la misma clase; nunca algo
  que se descarte por el sentido.
- `cloze`: `stem` con `___` y a veces la pista entre paréntesis: `Ontem
  eu ___ (ir) ao cinema.`
- `translate`: `stem` en español, `answer` en portugués, `alt` con todas
  las variantes razonables (con y sin pronombre sujeto, *a gente / nós*,
  *vou fazer / farei* si corresponde…). Se corrige sin mayúsculas ni
  puntuación, con tildes.
- `typed`: respuesta corta libre (una palabra o forma).
- `fixerr`: `stem` con un error típico, `bad` (el fragmento mal), `good`
  (el fragmento bien), `answer` (la oración corregida), `cat` (categoría).
- `garden` (garden path, Tomasello & Herron 1988): `lead` = 3 pares
  regulares [base, forma], `stem` = «base → ___», `answer`, `trap` (lo que
  el patrón o el español hacen decir).
- `scopri` (descubrí la regla): `data` = 6 oraciones, `stem` la pregunta,
  `options` 3 formulaciones de la regla, `answer` la buena.
- `combina` (B1 en adelante): unir oraciones con el conector entre
  paréntesis.
- `listen`: `stem` es lo que se oye (TTS pt-BR), `options`, `answer`,
  `nopeek: true`.

## Estilo de las lecciones (`tools/pt/lessons/s*.py`)

Mismo formato que las lecciones de italiano: `LESSONS = {semana: {"intro",
"parts": [{"h", "blocks": [índices]}], "blocks": [{"h", "r", "table"?,
"ex"?, "warn"?, "tip"?, "more"?, "q"?}]}}`. Límites (palabras): intro 35, r
30, warn 30, tip 30, cada párrafo de more 70 (máx. 2), ex máx. 5 pares
[portugués con la forma marcada entre *asteriscos*, traducción/comentario].
`q`: chequeos escritos a mano, 3 opciones exactas con la respuesta entre
ellas. Cada parte es una sesión de ~12 pasos.

## Tramo C1 y examen (v3)

- **Fichas de género** (`tools/pt/tramo/fichas.json`): 4-6 pantallas por
  género (para qué sirve, estructura, 8-10 fórmulas, verbos, modelo
  anotado). `tramo.js` las muestra antes de la primera tarea del género.
  Un género nuevo necesita su entrada en `generi.json` y su ficha.
- **Adequação** (`generi.json`, `ADEQ` y por género `trat`, `registro`,
  `proposito`, `fonteMin`): la revisión local mide tratamiento, propósito,
  uso de la fuente y registro. Los `punti` de cada tarea son hechos de la
  fuente (nombres, cifras, términos), nunca palabras que cualquier texto
  trae (*quando, semana, hoje*): `test_tramo.js` lo controla.
- **Enunciados**: desde la 45, sin extensión ni «registro formal» (como la
  prova, que no los dice).
- **Examen** (`docs/lang/pt/esame_data.js`): todo en portugués, tres
  versiones de escucha, lectura y producción escrita (`versoes`, cuatro
  tarefas integradas con su insumo); la forma exacta está en la cabecera.
  Estruturas y Léxico (`authored/esame_c1.py`), también en tres versiones:
  cada ítem lleva `ver` ("v1", "v2", "v3", los ids de `versoes`); los
  huecos van por texto (`TEXT_VER`) y el resto se reparte de a uno por
  versión en el orden de la lista (`OVERRIDE` separa dos ítems que se
  delatarían en la misma versión). Un ítem nuevo va al final de su familia
  y se revisa que las tres versiones sigan parejas;
  `tools/lib/test_fix_contenido_pt.js` lo controla.
- **Palabras de la semana**: 18 por semana de la 15 a la 25; en el tramo,
  15 + 12 del léxico de la lectura y la escucha de la semana
  (`vocab/s5_tramo.py`). Colocaciones: `authored/colocacoes.py` (dos por
  semana desde la 14); pragmática: `authored/pragmatica.py`.
