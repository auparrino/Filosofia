# Auditoría de contenido v2.8 → 3.0: Rumo C1 (portugués de Brasil)

Sobre `main` en v2.8 (merge del PR #55, después de la «revisión didáctica» y la «segunda
pasada» de las 52 semanas). Solo lectura: no cambié nada del repo. Las mediciones están en
`scratchpad/pt_*.py`, `pt_dump.js` y `pt_dump/`; el `build_course.py --strict` corrió en un
clon (`scratchpad/pt_clon`).

| Script | Qué mide |
|---|---|
| `pt_dump.js` | vuelca en JSON todos los datos del idioma (`FRASI_DATA`, `LETTURE_DATA`, `TRAMO_DATA`, `DictoglossData`, `EsameData`, `LAB_DATA`, `DUELLI_DATA`…) cargados con `tools/lib/pack.js` |
| `pt_lexcov.py [--nobank]` | cobertura léxica por banda de `frequenza.json`, semana a semana, separando lo **explícito** (palabras de la semana, ejemplos de la teoría, ítems, banco, frases, laboratorio, duelos) de lo que **solo se lee** (lecturas, dictogloss, tramo, examen) |
| `pt_sample.py` | muestra al azar (semilla 20260927) de 150 unidades: 22 bloques de teoría, 38 ítems, 14 oraciones y 8 errores del banco, 14 frases, 14 palabras con su «cómo se usa», 10 glosas, 8 textos de la semana, 5 tarefas, 6 fragmentos de leitura/escuta larga, 5 dictogloss, 6 duelos → `pt_sample150_{1,2,3}.txt` |
| scripts sueltos (en el historial de la sesión) | rasgos pragmáticos y marcadores por módulo y semana, lusismos y palabras españolas en el texto portugués, sesgo «la correcta es la más larga», géneros leídos y producidos, consignas por idioma, corrector sobre el texto nativo del tramo |

**Fuera de alcance, a pedido:** todo lo que usa la voz del alumno (la entrevista oral del
Celpe-Bras). No propongo nada oral.

**Referentes con los que comparo.** El *Documento base do exame Celpe-Bras* (INEP, ed. 2020) y
las provas públicas (2015-2024): la Parte Escrita son cuatro tarefas integradas (video →
texto, audio → texto, texto → texto ×2), cada una con enunciador, interlocutor, propósito y
género, todo en portugués, sin preguntas de gramática ni de opción múltiple, y corregidas por
**adequação ao contexto, discursiva y linguística**. El *Referencial Camões PLE* (2017) como
inventario A1-C2 (léxico, gramática, pragmática, temas), más útil que el QuaREPE (que es para
lengua de herencia). La bibliografía de PFE: Almeida Filho (la «falsa facilidade» y el
plateau intermedio), Grannier (pontos críticos), Akerberg (fossilização e interlíngua),
Durão (análise de erros), y sobre lo oral C-ORAL-BRASIL (Raso & Mello 2012) y NURC.

---

## Resumen: lo que justifica un 3.0

| # | Prioridad | Hallazgo | Evidencia | Esfuerzo |
|---|---|---|---|---|
| 1 | Alta | **La mitad de lo que el alumno hace hasta el final sigue en castellano**: 2.464 de 2.464 consignas de ítems, 48 de 48 consignas de *Escreva*, 303 preguntas de lectura (A semana, Martín, Cultura, Enchentes) y las 16 del examen final. Solo el tramo (240 preguntas, 24 tarefas) está en portugués. En el Celpe-Bras no hay una palabra de castellano | §4.2 | M |
| 2 | Alta | **Los géneros del tramo llegan antes que su teoría**: texto de opinião en la 28 (modalización en la 47), resumo en la 31 y 40 (resumo en la 48), carta formal en la 29 y 36 (correspondência en la 43), carta do leitor en la 32 y 35, artigo en la 34 y 37 (argumentação en la 47). *Resenha* y *relato* (6 tarefas) no tienen teoría nunca. «Nada antes de su teoría» vale para los tiempos, no para los géneros | §1.4, §4.1 | M |
| 3 | Alta | **Léxico: el curso secuenciado enseña 2.817 lemas y expone otros 1.446 solo en lecturas**; en total 4.263 lemas, el 57 % de los 5.000 más frecuentes y el 43 % de los 8.000. Un C1 receptivo necesita 8-10 mil. El flujo de lemas nuevos explícitos cae a 16-55 por semana entre la 15 y la 38 | §2.1-2.3 | L |
| 4 | Alta | **La pragmática y el habla real llegan tarde y poco**: los marcadores (*né, então, aí, tipo, sabe?, pois é*) se enseñan en la semana 38, pero las escutas los usan desde la 27 y las frases desde la 17; *entendeu?, daí, poxa, ué, eita, pode deixar, imagina (=de nada), será que* nunca tienen bloque. Solo 3 bloques de 340 enseñan actos de habla (invitar, cortesía, pedir) | §1.3, §2.5 | M |
| 5 | Alta | **La revisión local de la tarefa mide forma, no adequação**: los «puntos de la consigna» son listas de palabras clave (en la 50 alcanza con escribir *quando* y *semana*; en la 42, *hoje*); no hay control de interlocutor, tratamiento ni propósito | §4.3 | S-M |
| 6 | Media | **Colocaciones y formación de palabras quedan para las semanas 44 y 50**; solo 14 ítems de «combinación usual» en todo el año, y las 20 palabras B2-C1 del tramo se enseñan sueltas. Los campos léxicos de la vida pública brasileña (eleições, Câmara, STF, INSS, CLT, CPF) casi no existen | §2.4, §2.6 | M |
| 7 | Media | **La variación vive en la semana 46**: 10 de las 14 menciones a Portugal de toda la teoría están ahí; el *tu* (mitad del país) se ve en una tabla de la semana 1 y vuelve en la 46. Las escutas del tramo no tienen ningún *tu*, ningún sotaque marcado ni rasgos del habla espontánea (repeticiones, falsos comienzos, solapamientos) | §1.5, §2.5 | S-M |
| 8 | Media | **El examen final no se parece a la prova**: preguntas de escucha en castellano y con la correcta como opción más larga en 15 de 16 (ya señalado en la auditoría general, A2, sigue igual), consignas de escritura en castellano, una sola versión | §4.4 | M |
| 9 | Baja | Restos de la auditoría anterior: 0 frases de las 455 con *pra / cê* dentro de la frase (E5), *joelho* y *espalhar* siguen diciendo que *lh* «suena parecido a li» (E6), «(PT)» dentro de la respuesta de s4-46-33 (E7), *me acordo* como opción en s1-05-11 (B8), *año → ano* en la semana 1 (B8) | §6 | S |

Y una buena noticia que también justifica el número: **la lengua está limpia**. En la muestra
de 150 unidades no encontré ningún error de portugués brasileño ni de castellano rioplatense
(§3). Los lusismos aparecen solo en la semana 46, donde corresponde; el castellano dentro del
texto portugués aparece solo como pista entre paréntesis o como distractor.

---

## Estado de lo que marcaron las auditorías anteriores (portugués)

| Qué | Antes → ahora |
|---|---|
| Pares mínimos con *si* (B7) | *sim / si* → **sim / sem** (`ascolto.py:29`) |
| Frases con gramática posterior sin aviso (B1) | 36 sin aviso → **31 fórmulas declaradas** en `formule_data.js` (lo genera `sillabo.py`) |
| Escuchas colgadas de la parte equivocada (B2) | 32 → **0** (build sin avisos de `part` salvo los 164 del examen, que es una sola parte) |
| Banco con gramática antes de tiempo (B3) | 35 → **0** (`build_course.py --strict`: solo 2 ítems usan imperativo antes de la 12: s1-03-34, s1-10-31) |
| «Correcta = la más larga» en A semana (A6) | 75 % → **24 %** (38 de 156, lo esperable al azar); en el tramo 25 % (leitura) y 21 % (escuta) |
| Corrector con *pra, tá, cê, tava* (E1) | rechazados → **avisos blandos** («es del habla; en un texto formal…»); los 6 modelos informales del tramo pasan con 0 errores duros |
| Glosas en dictogloss y modelos | 0 → 307 (commit 1f38a3e) |
| Lectura, escucha y escritura que no crecen (E2, E3) | resuelto por el tramo: 387 → 900 palabras leídas, 316 → 599 escuchadas, 120 → 310 escritas |

**Sigue abierto:** E5 (frases sin *pra / cê*; *Bora para a praia?* sigue en `frasi_data.js:137`),
E6 (`vocab/s1.py:168` y `vocab/s3.py:88` contra `ascolto_data.js:29`, que dice «nunca li»),
E7 (s4-46-33 con «(PT)» dentro de la respuesta), B8 (s1-05-11 con *me acordo*; s1-01-41
*año → ano* y s1-01-42 *mitad → metade* en la semana 1), A2 del general (examen: 15 de 16
escuchas con la correcta más larga; una sola versión; preguntas en castellano).

---

## 1. El sílabo frente a los referentes

### 1.1 Cómo está repartido el año (medido)

340 bloques de teoría (129 + 115 + 121 + 124 por estación... contados por archivo: s1 129,
s2 115, s3 121, s4 124 encabezados `"h"`, de los cuales 340 son bloques). Clasifiqué cada
bloque por su título y su regla con palabras clave (es una heurística, no una lectura; un
bloque puede contar en dos dominios):

| Semanas | Gramática | Fonética | Pragmática | Léxico | Género / texto | Variación |
|---|---|---|---|---|---|---|
| 1-13 | 33 | 33 | 19 | 19 | 2 | 3 |
| 14-26 | 50 | 15 | 15 | 3 | 5 | 1 |
| 27-39 | 43 | 15 | 21 | 6 | 9 | 2 |
| 40-52 | 25 | 19 | 23 | 25 | 23 | 8 |

Lo que se ve: la segunda y la tercera estación son casi puramente gramaticales (léxico 3 y 6
bloques en 26 semanas), y la dimensión de los géneros aparece recién en la cuarta. En los
ítems pasa lo mismo: de 2.464, los que hablan de registro o cortesía en la consigna o la nota
son 301 (12 %), y se concentran en las semanas 12, 16, 33, 38, 45 y 49.

Módulos que se apagan a mitad de año:

- **Frases (escenas):** 19 escenas entre las semanas 1 y 19, y después solo 7 en 33 semanas
  (23, 30, 35, 38, 40, 43, 47). Entre la 19 y la 23, la 23 y la 30 y la 30 y la 35 no hay
  escena nueva.
- **Duelos:** 8, el último en la 36. **Entender (Capire):** 10, el último en la 29.
  **Ponte:** semanas 2-10. **Martín no Rio:** 10 episodios, el último en la 30.
- **Banco:** 700 oraciones bien repartidas (C1: 142), pero **9 errores de nivel C1** de 524, 33
  sustantivos C1 de 1.836 y 9 adjetivos C1 de 448: el banco de «Ache o erro» y el de palabras
  son A1-B1.

### 1.2 Contra el Celpe-Bras (Documento base y provas)

El Celpe-Bras no tiene sílabo gramatical: el constructo es «uso da língua» en tareas que son
acciones sociales, con cuatro niveles de certificación (Intermediário → Avançado Superior).
Lo que un candidato hispanohablante necesita para el Avançado Superior, según el Documento
base y los cuadernos de corrección, es, en este orden: (1) cumplir el propósito con el
interlocutor y el género pedidos; (2) reformular lo leído u oído sin copiar; (3) coherencia y
progresión; (4) lengua sin errores que molesten la lectura, sin marcas del español.

Cómo se para el curso frente a eso:

- **(1) y (2) están resueltos en el tramo** (semanas 27-51): los 24 enunciados siguen el molde
  de la prova («Você é… Após ler/ouvir…, escreva um(a)… para… Não se esqueça de…»), 24 de 24
  nombran destinatario, 21 de 24 nombran el registro, 20 de 24 llevan un verbo de propósito
  explícito; 14 parten de la lectura, 4 de la escucha, 6 de las dos. Muy bien hecho.
- **Pero el tramo llega a la semana 27 de 52 y no tiene nada antes.** En A2-B1, *Escreva* pide
  15-45 palabras con la estructura de la semana y en castellano: solo 8 de 48 consignas nombran
  un destinatario o un género; 48 de 48 exigen «4 verbos en futuro do subjuntivo» o parecidos.
  El Celpe-Bras nunca pide una estructura; pide una acción.
- **Géneros producidos: 8** (carta formal 4, e-mail informal 3, relato 3, resumo 3, carta do
  leitor 3, resenha 3, artigo 3, texto de opinião 2) más 2 en el examen (artigo de opinião,
  e-mail formal). En las provas 2015-2024 aparecen además, y con frecuencia: **texto para blog
  o post de rede social, panfleto / folheto / texto de campanha, carta aberta, abaixo-assinado
  ou manifesto, depoimento / texto de apresentação, comentário em site, roteiro (de vídeo, de
  visita), texto instrucional (guia, dicas), e-mail de reclamação, proposta / projeto**. Ninguno
  está.
- **Géneros leídos: 18 en la leitura y 20 en la escuta longa**, con buena variedad (reportagem,
  crônica, coluna, conto, guia, perfil, sumário executivo, ensaio, pingue-pongue; podcast,
  debate, boletim, telefonema, palestra). Este es el punto más fuerte del contenido.
- **Comprensión en castellano.** 303 preguntas de opción múltiple sobre 97 textos (A semana,
  Martín, Cultura, Enchentes) y las 16 del examen están en castellano; solo los VF y las 240
  del tramo en portugués. La prova entera está en portugués y nunca pide elegir entre opciones.

### 1.3 Contra el Referencial Camões y la bibliografía de PFE

**Lo que llega tarde (para un hispanohablante y para B2/C1):**

| Contenido | Dónde está hoy | Dónde lo esperan los referentes |
|---|---|---|
| Marcadores conversacionales (*né, então, aí, tipo, sabe?, pois é, olha*) | Semana 38 (7 bloques) | A2: son las palabras más frecuentes del habla (C-ORAL-BRASIL); en el curso ya suenan en las escutas desde la 27 y en las frases desde la 17 |
| Colocaciones y verbos soporte (*dar certo, fazer questão, tomar providências*) | Semana 50; 14 ítems en el año | B1 en adelante, en cada campo léxico (Referencial Camões los pone desde B1) |
| Formación de palabras (*-ção, -mento, -eiro, -inho, -ão*) | Semana 44 | B1-B2: es el instrumento para leer los 1.446 lemas que solo aparecen en las lecturas |
| Modalización y argumentación (*talvez, é possível que, ao que parece, ainda que*) | Semana 47 | B2: la primera tarefa de opinión es en la 28 |
| Verbos de decir y resumo (*afirmar, sustentar, ressaltar, segundo o autor*) | Semana 48 | B2: la primera tarefa de resumo es en la 31 |
| Correspondência formal (*Prezado, Atenciosamente, V. Sa.*) | Semana 43 | B1-B2: la primera carta formal es en la 29 |
| *Haver de*, *vir a* + inf., *acabar por*, *ficar* + gerúndio, *dar para* | *haver de* y *vir a*: nunca; *dar para*: 1 bloque en la 27; *acabar de*: 1 bloque en la 21 | B1-B2 (perífrasis frecuentes en prensa y habla) |
| *tu* y su conjugación (Sur, Norte, Nordeste, Rio coloquial) | Tabla de la semana 1 y semana 46 | Debería reaparecer con audio en A2-B1: es la mitad del país |

**Lo que está de más o demasiado temprano / demasiado largo:**

- **Crase (36) y verbos irregulares derivados (37): dos semanas enteras de B2** para algo que la
  prova mide solo como «adequação linguística» global. Pueden ser media semana cada una y dejar
  lugar para géneros y modalización.
- **Falsos amigos (45): una semana entera de C1** que repite lo que ya hacen el laboratorio
  (103 falsos amigos desde la 14), la escena 14, el banco (148) y las notas. Al nivel C1 el
  problema del hispanohablante no es *polvo / esquisito* sino la precisión léxica y el registro.
- **Mais-que-perfeito simples (41)**: solo reconocimiento; media semana alcanza.
- **Sonidos en la 40-52: 19 bloques** clasificados como fonética son en realidad bloques de
  ortografía/acento (heterotónicos, tildes) — no es un exceso, pero la etiqueta engaña.

**Lo que está bien ordenado según los pontos críticos (Grannier, Akerberg):** contracciones (3),
*muito* (4), *gostar de* (14), *a* personal (desde la 5 en el banco), perfeito composto (21),
futuro do subjuntivo (27), infinitivo pessoal (29), crase (36), colocação pronominal (33),
heterogenéricos (2 y 45). La secuencia de tiempos coincide con *Bem-Vindo!* y *Novo Avenida
Brasil*.

Un matiz de la bibliografía: Almeida Filho y Akerberg insisten en que el hispanohablante se
estanca (plateau) porque **entiende demasiado pronto y produce interlengua fosilizada**; el
remedio es volumen de input auténtico + atención a la forma + producción con devolución.
El curso tiene lo segundo muy bien y lo tercero desde la 27; lo primero es lo que falta (§2).

### 1.4 «Nada antes de su teoría»: vale para los tiempos, no para los géneros

El control de `sillabo.py` funciona (`build_course.py --strict`: 2 avisos en 2.464 ítems;
`check_letture.py`: 0 de 52 lecturas con problemas). Pero el mismo principio no se aplica a lo
discursivo:

| Tarefa del tramo | Semana | Teoría que la sostiene | Semana de la teoría |
|---|---|---|---|
| texto de opinião | 28, 47 | modalização e argumentação | 47 |
| carta formal | 29, 36, 43, 49 | correspondência formal | 43 |
| resumo | 31, 40, 48 | resumo e reformulação | 48 |
| carta do leitor | 32, 35, 45 | correspondência formal (parcial) | 43 |
| artigo | 34, 37, 51 | argumentação | 47 |
| resenha | 33, 41, 46 | **no hay** | — |
| relato | 30, 42, 50 | narrativa (41), reduzidas (42): parcial | 41 |
| e-mail informal | 27, 38, 44 | português falado (38) | 38 |

**13 de 24 tarefas** se piden antes de la teoría que las explica, y las 3 resenhas nunca la
tienen. Lo que salva es que cada tarefa trae un modelo y `generi.json` da la estructura en una
línea (`hint`), pero eso no es una lección: no hay ejemplos de aperturas de resenha, ni de
cómo se atribuye en un resumo, ni de qué verbos usa un relato.

### 1.5 Variación a lo largo del año

Medido en la teoría (menciones por semana): *Portugal / europeo*: semana 3 (3), 8 (2), 9 (2),
12, 16, 19, 46 (**10**), 49, 50. *Regiones de Brasil*: semana 1 (5), 4 (5), 16, 18, 28, 34,
38 (3), 46 (5), 49, 52. *Habla / coloquial*: en 40 de 52 semanas hay al menos una nota (bien).
*Formal / escrito*: 16 (15), 33 (8), 40 (5), 49 (11).

Lo que se ve: el eje **norma culta ↔ habla** está bien tratado y repartido (cada bloque de
gramática dice qué pasa «en la boca»: *chegar em*, *vi ele*, *me dá*, *tem gente*). El eje
**Brasil ↔ Portugal ↔ África** y el eje **regiones de Brasil** están concentrados en la 46. El
*tu* con verbo propio (*tu és, tu tens*) se conjuga en todas las tablas (columna «tu»), pero el
alumno nunca lo oye ni lo lee en un diálogo: en 10.295 palabras de escutas largas hay **0 *tu***,
0 *bah*, 0 *uai*, 0 *oxe*, 0 *eita*. La escucha del tramo es toda «Rio-São Paulo neutro».

---

## 2. Léxico

### 2.1 Cobertura por banda de `frequenza.json`

`frequenza.json`: 16.232 lemas de OpenSubtitles pt-BR, bandas por rango (A1 826, A2 1.195,
B1 1.993, B2 2.989, C1 2.997, C2 3.000, sin banda 3.232). Lematicé cada texto con `forme` →
lema (los tokens sin lema quedan afuera: en el tramo son 878 de ~30 mil, casi todos nombres
propios y términos gramaticales).

**Explícito** = lo que el alumno estudia o produce en la secuencia (palabras de la semana,
ejemplos y tablas de la teoría, ítems, oraciones y errores del banco, frases, laboratorio,
duelos). **Leído** = lecturas (Martín, Cultura, Enchentes, A semana), dictogloss, tramo
(leitura, escuta, modelo) y examen. Sin contar las listas sueltas del banco (1.836 sustantivos
etc., que no tienen semana):

| Al final de la semana | A1 | A2 | B1 | B2 | C1 | C2 |
|---|---|---|---|---|---|---|
| 13 (expl / leído / cualquiera) | 61 / 45 / **67** | 21 / 10 / **24** | 7 / 4 / **8** | 3 / 1 / 3 | 1 / 0 / 1 | 1 / 0 / 1 |
| 26 | 73 / 64 / **80** | 31 / 20 / **39** | 13 / 7 / **16** | 5 / 2 / 6 | 2 / 1 / 3 | 1 / 1 / 2 |
| 39 | 81 / 86 / **92** | 44 / 53 / **66** | 19 / 27 / **35** | 8 / 10 / **14** | 4 / 5 / 7 | 2 / 2 / 4 |
| 52 | 88 / 94 / **96** | 57 / 70 / **80** | 29 / 42 / **50** | 13 / 19 / **25** | 6 / 9 / **13** | 4 / 5 / 7 |

Contando también las listas del banco (con su nivel convertido a semana: A1 → 1, A2 → 9, B1 →
19, B2 → 31, C1 → 43): al final, A1 99 %, A2 93 %, B1 61 %, B2 30 %, C1 14 %.

Por rango de frecuencia (cualquier fuente, sin banco): **top 1.000: 92 %; 2.000: 82 %; 3.000:
72 %; 5.000: 57 %; 8.000: 43 %**. Solo explícito: 83 / 67 / 56 / 41 / 30 %.

Totales: **2.817 lemas explícitos + 1.446 que solo se leen = 4.263 lemas** en todo el curso
(4.895 con las listas del banco). La Biblioteca (9 libros, 540.577 palabras, 7.801 lemas)
cubre el 73 % del top 5.000 y el 63 % del top 8.000, pero es literatura de 1870-1910: *cousa*,
*dous*, *bonde*, *sobrecasaca*.

Comparación con lo que un C1 necesita: Nation (2006) estima 8-9 mil familias para leer con
el 98 % de cobertura; los descriptores C1 del Referencial Camões suponen un vocabulario
receptivo amplio en los temas de la vida pública, cultura, ciencia, trabajo y medios. **El curso
entrega, en su parte secuenciada, menos de la mitad de eso**, y la mitad de lo que entrega es
A1-A2 (1.401 de 2.817 lemas explícitos).

### 2.2 Cuántos lemas se enseñan por semana y cuántos solo se leen

Lemas nuevos explícitos (primera aparición en una fuente explícita) / lemas nuevos que solo
aparecen en lecturas esa semana:

```
w1 287/29  w2 108/13  w3 113/14  w4 75/9   w5 91/16  w6 57/62  w7 74/7   w8 46/26  w9 50/10
w10 74/19  w11 60/14  w12 58/15  w13 16/7  w14 92/10 w15 43/15 w16 30/11 w17 28/28 w18 28/10
w19 48/3   w20 17/1   w21 27/12  w22 55/50 w23 38/10 w24 16/25 w25 25/35 w26 1/15
w27 42/60  w28 39/93  w29 36/80  w30 52/40 w31 52/71 w32 47/101 w33 38/83 w34 69/69 w35 48/102
w36 30/61  w37 54/79  w38 37/57  w39 4/12  w40 114/119 w41 52/83 w42 42/62 w43 64/71 w44 71/69
w45 45/45  w46 42/39  w47 64/60  w48 51/47 w49 20/48 w50 42/31 w51 27/42 w52 78/45
```

Hay **desierto léxico entre la semana 15 y la 26** (16-55 lemas nuevos explícitos por semana,
con 17 en la 20 y 16 en la 24) y de nuevo en la 36-38 y 49-51: son las semanas en que la
teoría es gramática pura y las 12 palabras de la semana son la única entrada de vocabulario.
Desde la 27 la relación se invierte: cada semana el alumno **lee entre 40 y 120 lemas nuevos que
nadie le enseña ni le vuelve a pedir** (en total 1.446, de los cuales 411 B1, 351 B2, 188 C1, 102
C2). Ejemplos de A2-B1 frecuentes que solo se leen y nunca se enseñan ni se ejercitan:
*companhia, treinar, acertar, inteligente, somente, perigo, comum, assustar, direção,
propósito, pertencer, impedir, risco, membro, assumir, ouvido, arriscar, atingir, poderoso,
pressão, vídeo, adivinhar, aproximar, visão, perdão, detalhe, recusar*.

Del top 3.000, **826 lemas no aparecen en ningún lado** (con listas del banco: 549). Muchos son
ruido de subtítulos (nombres ingleses, insultos), pero también: *desculpar, chance, novamente,
controle, lamentar, controlar, missão, desejar, imediatamente, dedo, cérebro, estragar,
através, atacar, luta, prisão, mente, natal, senhorita, coronel, cavalheiro*.

### 2.3 Las palabras de la semana

768 palabras (12 por semana hasta la 25; 20 desde la 27, 5 de ellas B2-C1 sacadas del
tramo). Calidad: muy alta (§3). Lemas B2-C2 por semana en las palabras de la semana: 1-4 en
la primera estación, 1-11 en la segunda, 8-16 en la tercera, 12-25 en la cuarta (la 45 tiene
25, la 50 y la 51 bajan a 5). Es decir: **hasta la semana 26, las palabras de la semana son
casi todas A1-B1**, lo que está bien para el nivel, pero en total el curso enseña
explícitamente 187 lemas C1 y 383 B2 (con banco: 259 y 590).

100 de las 768 entradas son multipalabra (*carteira assinada, fazer as contas, bate-volta*), 393
notas traen una colocación o un compuesto (*rede de esgoto*, *fazer um saque*, *trabalhar de
carteira assinada*) y 62 marcan registro. Eso es bueno, pero no se ejercita: el juego pide el
significado y la escritura de la palabra, no la colocación.

Glosas inconsistentes entre módulos: de 602 palabras de la semana que también están en el
banco o el glosario, 46 tienen una glosa sin ninguna palabra en común con la del banco
(*puxa* «¡uh!» vs «tirar (hacia uno)»; *imagina* «¡de nada!» vs «imaginar»; *juntar* «ahorrar
(plata)» vs «juntar / reunir»; *saque* «el saqueo; también extracción de dinero» cuando el uso
cotidiano es el segundo). No son errores: son acepciones distintas que el toque-en-la-palabra
muestra sin decir cuál vale en ese contexto.

### 2.4 Colocaciones, fraseología, formación de palabras, registro, medios

- **Colocaciones:** una semana (50) con 6 bloques y 14 ítems «Elegí la palabra que forma la
  combinación usual»; 10 más en el examen. En el Referencial Camões las colocaciones son
  contenido de B1 en adelante en cada campo. Las 20 palabras B2-C1 del tramo se enseñan sin sus
  colocaciones (aunque la nota suele traerlas).
- **Fraseología del habla:** la escena «Gírias cariocas» (38, 18 frases) y la 50; en la teoría
  hay 4 bloques. *Pra caramba, de boa, rolê, trampo, mó, zoar, sacanagem, bagunça, top* no
  aparecen en ninguna lección; *grana* y *galera* en un ítem.
- **Formación de palabras:** semana 44 (7 bloques, buenos) y 36 ítems del examen. Nada antes,
  cuando serviría para leer los 1.446 lemas «solo-lectura».
- **Registro:** bien tratado en la teoría (49, 33, 40, 43) y en 301 ítems.
- **Léxico de los medios y la vida pública:** *notícia* (2 bloques), *prefeito* (5), *boleto*
  (4), *SUS* (4, y 23 en la cuarta estación), *Pix* (2), *vestibular* (1), *Enem* (1), *CLT*
  (1 ítem). **Nunca:** *CPF, INSS, STF, vereador* (solo en el tramo), *eleição / voto
  obrigatório / segundo turno, imposto de renda, plano de saúde, aluguel / fiador, sindicato,
  greve, licitação, boato* (solo tramo). Para el Celpe-Bras, cuyos insumos son reportajes,
  campañas y programas de radio sobre ciudadanía, salud, trabajo, consumo y medio ambiente, es
  un hueco concreto.

### 2.5 Marcadores discursivos y rasgos del habla en lo que se escucha

Por 10.000 palabras (escutas largas del tramo, 10.295 palabras; frases, 2.235; dictogloss,
3.705; examen, 943):

| Marcador | Escutas | Frases | Dictogloss | Examen |
|---|---|---|---|---|
| a gente | 51,5 | 35,8 | 8,1 | 0 |
| pra | 37,9 | 0 | 2,7 | 0 |
| olha | 32,1 | 4,5 | 2,7 | 0 |
| então | 31,1 | 4,5 | 2,7 | 0 |
| aí | 27,2 | 13,4 | 2,7 | 10,6 |
| né | 25,3 | 8,9 | 2,7 | 0 |
| tá | 24,3 | 13,4 | 2,7 | 0 |
| sabe | 15,5 | 0 | 5,4 | 21,2 |
| tipo | 8,7 | 4,5 | 2,7 | 0 |
| cê / tava / cadê | 5,8 / 1,9 / 1,9 | 0 | 5,4 / 0 / 0 | 0 |
| entendeu?, daí, poxa, ué, eita, uai, bah, sei lá | 0 | 0 | 0-2,7 | 0 |

Rasgos de oralidad brasileña en las escutas (bien): *a gente* + 3.ª singular 50 veces contra
*nós* 3; *tem* existencial 25 contra *há* 0; próclise (*me disse*) 53 contra ênclise 10; *vou* +
infinitivo 49 contra futuro simple 1; *estar* + gerúndio 29. Lo que falta: **ni un *tu*, ni una
repetición, ni un falso comienzo, ni un solapamiento, ni un «hum», ni una autocorrección**. Son
diálogos de radio bien escritos, no habla espontánea. Frente a C-ORAL-BRASIL (donde *né*, *aí*,
*então*, *assim* y *tipo* están entre las 30 palabras más frecuentes del informal), la densidad
de marcadores es de un tercio a un quinto de la real, y el examen final tiene 0 *né*.

Y el desfase con la teoría: los marcadores se explican en la 38; las escutas los usan desde la
27 (*né* en 22 de las 24 semanas) y las frases desde la 17. El glosario y las glosas del tramo
lo atajan («*né*: ¿no?, se ve en la semana 38»), pero el alumno los oye 11 semanas sin que nadie
le diga para qué sirven.

### 2.6 Campos léxicos por estación

Mapeé las palabras de la semana a los temas del banco (claves italianas por compatibilidad):

| Semanas | Temas con más palabras |
|---|---|
| 1-13 | casa 14, cibo 13, città 8, famiglia 7, corpo 7, tempo 7, lavoro 6, viaggio 6 (58 sin tema) |
| 14-26 | vestiti 12, cibo 8, negozi 8, tempo 6, sport 5, scuola 5, viaggio 5 (72 sin tema) |
| 27-39 | cultura 10, società 7, tecnologia 7, lavoro 6, scuola 6, città 6 (171 sin tema: lo B2-C1 del tramo no está en el banco) |
| 40-52 | cibo 5, società 3, lavoro 2 (219 sin tema) |

Ausentes como campo con su semana: **futebol y esporte** (70 sustantivos en el banco, 5 palabras de
la semana en todo el año, ninguna lección), **música y carnaval** como unidad (aparecen como
decorado), **religiones y fiestas** (candomblé, umbanda, festa junina: 0 menciones en la teoría),
**política institucional y elecciones**, **economía cotidiana** (Pix, boleto, CPF, imposto),
**Amazônia / meio ambiente** (solo la 34), **saúde pública** (SUS aparece 49 veces, pero como
referencia, no como campo).

---

## 3. Calidad de lengua y de didáctica (muestra de 150, semilla fija)

Leí las 150 unidades de `pt_sample150_*.txt`. Criterios: portugués brasileño natural y
correcto; castellano rioplatense; explicación con contraste útil; ejemplo que muestre la regla;
consigna clara; datos culturales verificables.

| Categoría | n | Con error de lengua (pt o es) | Con problema didáctico |
|---|---|---|---|
| Bloques de teoría | 22 | 0 | 1 |
| Ítems | 38 | 0 | 5 |
| Oraciones del banco | 14 | 0 | 0 |
| Errores del banco | 8 | 0 | 0 |
| Frases con nota | 14 | 0 | 0 |
| Palabras «cómo se usa» | 14 | 0 | 1 |
| Glosas | 10 | 0 | 0 |
| Textos de la semana | 8 | 0 | 1 |
| Tarefas del tramo | 5 | 0 | 2 |
| Leitura / escuta larga (fragmentos) | 6 | 0 | 0 |
| Dictogloss | 5 | 0 | 0 |
| Duelos | 6 | 0 | 0 |
| **Total** | **150** | **0 (0 %)** | **10 (6,7 %)** |

**Lengua.** No encontré errores de portugués ni de castellano. El portugués es brasileño y
natural incluso en lo coloquial (*Me vê um chope?*, *Partiu, galera!*, *Caraca, que maneiro!*,
*Tô contigo. Bora pedir mais um chope?*, *o bufê pisou na bola feio*, *quebrasse o meu galho*);
los textos formales son de prensa real («Poucas propostas têm dividido tanto a nossa cidade
quanto…»). El castellano es rioplatense consistente (*vos, chabón, piola, copado, birome, ojotas,
franco, plata, en blanco*). Los datos culturales de la muestra son correctos (Machado nacido en
1839 en el Livramento, ABL 1897, la dedicatoria «ao verme…»; Selarón 1990-2013; Arcos da Lapa
siglo XVIII; Schwarz 1973/1977; Tiradentes delatado por Silvério dos Reis y ejecutado en 1792;
Dia do Fico enero de 1822; *Os Lusíadas* 1572; el Sermão aos Peixes 1654 en São Luís).

**Barrido automático sobre todo el texto portugués** (12.370 unidades, 123.292 palabras):
lusismos / europeísmos: 106 ocurrencias, todas en la semana 46 o en la columna *tu* de las
tablas, salvo *o fato é que* (que es brasileño). Palabras españolas dentro del portugués:
180 ocurrencias, todas pistas entre paréntesis («(muy)», «(aquello)»), distractores o *Ilha
Grande*. Ningún calco del italiano.

**Problemas didácticos encontrados (10 de 150):**

1. **Distractores en castellano que se descartan por la forma** (4 ítems): s2-17-35 *faz / fazem /
   hace*; s2-20-30 *nunca / jamás / não nunca*; s1-05-05 *moram / moran / mora*; s2-19-31 *ótima /
   bonísima / muito ótima*. La auditoría anterior (A2) ya lo dijo para el «Adiviná»; en los ítems
   `choice` sigue en un 10 % de la muestra.
2. **s4-43-02**: la nota dice que «*Atentamente* no se usa así»; se usa (menos que
   *Atenciosamente*, pero es un cierre formal corriente en Brasil). Sobreafirmación.
3. **Teoría w32 b5** («Tres maneras de decir lo mismo»): la columna «Habla» usa *Tão falando*,
   *Tão precisando* (reducción de *estão*) seis semanas antes de que la 38 la presente, y sin
   glosa; escrita con mayúscula al principio de celda se confunde con *tão* («tan»).
4. **Texto de la semana 25**: «A moça, *a qual* mais tarde ficou famosa» — correcto, pero
   forzado para mostrar el relativo; un brasileño escribiría *que*. Es un caso de «ejemplo al
   servicio de la regla».
5. **Tarefas w50 y w42**: los «puntos de la consigna» se cumplen con *quando*, *semana*, *morava*
   (w50) o *hoje* (w42): palabras que cualquier texto trae. Ver §4.3.
6. **Palabra w42 *o saque***: la glosa pone primero «el saqueo» y después «la extracción de
   dinero», cuando el ejemplo y el uso cotidiano son el segundo.

**Inconsistencias entre módulos** (buscadas aparte de la muestra):

- *lh*: `vocab/s1.py:168` (*joelho*) y `s3.py:88` (*espalhar*) dicen «suena parecido a li»;
  `ascolto_data.js:29` dice «nunca *l* ni *li*» y los pares p-058 y p-064 se apoyan en eso.
- *este / esse*: la teoría de la 10 dice bien que en Brasil *esse* cubre a *este*, pero las
  tablas y varios ítems siguen exigiendo la distinción tripartita sin marcar que es escrita.
- *chegar em / a*: consistente (teoría 9 y 35, diagnóstico) — bien.
- Glosas distintas para la misma palabra en vocab y banco (46 casos, §2.3).
- El desglose y la devolución usan «pretérito perfeito do subjuntivo» etc. traducidos por
  semana (`devolucion_data.js` `terms`): bien resuelto.

---

## 4. Progresión hacia C1 y el Celpe-Bras

### 4.1 ¿Las semanas 40-52 son Avançado?

**En insumo, sí.** Leituras de 625 a 900 palabras de géneros reales (sumário executivo,
guia, artigo de divulgação, ensaio, pingue-pongue, reportagem especial), escutas de 437 a 599
palabras (reunião de orientação, telefonema, palestra com perguntas), 20 palabras por semana
con 12-25 lemas B2-C2, tarefas de 188-310 palabras con propósito e interlocutor. Las preguntas
del tramo son de comprensión global e inferencial (93 de 240 preguntan por objetivo, por qué,
qué sugiere, cómo avalia), los VF traen *não se diz* (29 + 24) y no hay sesgo de largo (30 de
120 y 25 de 120, lo esperable al azar).

**En ejercitación, no del todo.** Los 46 ítems semanales de la 40-51 son los mismos tipos de la
semana 1 (choice, cloze, translate, fixerr, garden, scopri, combina) sobre oraciones sueltas; la
consigna está en castellano; el banco de errores tiene 9 oraciones C1. No hay ejercicio de
**reformulación de párrafo, de síntesis de dos fuentes, de elección de registro en un texto
entero, de corrección de un texto ajeno con interlengua de hispanohablante** (el ejercicio que la
bibliografía de PFE recomienda para el plateau). Las Palabras de la semana se juegan igual que
en la 1 (significado + escribir).

**En teoría, a medias.** Las lecciones 40, 43, 47, 48, 49 y 50 son de verdad C1 (nominalización,
correspondencia, modalización, verbos dicendi, registro, colocaciones). 41, 42, 44, 45 y 46 son
B2 reubicadas (mais-que-perfeito de reconocimiento, reduzidas, sufijos, falsos amigos,
variedades).

### 4.2 ¿El examen y las tarefas se parecen a las provas reales?

**Tarefas (24):** sí, en el enunciado. Formato «Você é… Após ler/ouvir…, escreva…»; propósito,
interlocutor, registro y extensión explícitos; fuente leída u oída; «Não se esqueça de…». Dos
diferencias con la prova: (a) la prova no da extensión ni dice «registro formal» (lo tiene que
inferir el candidato del interlocutor); conviene ir sacando esas muletas de la 45 en adelante;
(b) la prova tiene tarefa a partir de video: acá es audio, aceptable.

**Examen final (`esame_data.js` + `esame_c1.py`):** no se parece.

- Compreensão oral: 2 entrevistas de ~470 palabras, **16 preguntas de opción múltiple en
  castellano, con la correcta como única opción más larga en 15 de 16**; 4 huecos en portugués.
- Leitura: 2 textos de ~600 palabras, asignar títulos y 8 VF (esto sí es de examen europeo,
  no del Celpe).
- Produção escrita: 2 consignas **en castellano** («Un diario carioca abrió un debate… escribí un
  artículo de opinión en portugués…»), con la rúbrica de las tres adequações (bien) pero sin
  insumo que integrar (la tarefa del Celpe siempre integra).
- Estruturas y Léxico: 164 ítems analíticos (huecos sobre dos textos, transformaciones,
  formación de palabras, registro, colocaciones). El Celpe no tiene nada de esto; los C1
  europeos (CAPLE DAPLE, que también existe para portugués) sí.
- Una sola versión, y los 164 ítems se pueden entrenar antes en la semana 52.

El examen mide el C1 europeo, no el Avançado Superior. Como cierre del curso sirve; como
simulacro de la prova, no.

### 4.3 ¿La revisión local mide adequação?

`tramo.js` `evaluate()` (l. 112-155) controla: extensión mínima; variedad léxica (TTR ≥ 0,45 en
las primeras 150 palabras; ninguna palabra > 8 %); copia de la fuente (≤ 20 % de 5-gramas);
«puntos de la consigna» (≥ 60 % de las listas de palabras clave de `punti`); apertura y cierre
del género por expresión regular; título; párrafos; ≥ 4 conectores; errores duros del corrector
≤ n/50.

De las tres adequações:

- **Linguística:** sí (corrector + variedad).
- **Discursiva:** parcial (párrafos y conectores; no coherencia ni progresión).
- **Ao contexto:** no. El interlocutor solo se controla por la apertura (*Prezado…*) y el cierre;
  el tratamiento (*você* vs *o senhor* coherente con el destinatario) no; el propósito (pedir,
  proponer, recomendar, posicionarse) solo si la palabra clave aparece; el uso de la fuente solo
  como «no copiar», no como «usar». Los `punti` son listas de superficie: en w50 «Situar la
  anécdota» = *quando / cheguei / semana / morava*; en w42 «Cerrar con una reflexión» = *hoje /
  percebi / aprendi*; en w45 «Contar una experiencia propia» = *experiência / comigo / no meu caso
  / aconteceu*. Un texto que use esas palabras sin hacer lo pedido pasa.

La rúbrica con IA (`esamePrompt`, `scrivi.js:1580`) sí define las tres adequações como el
Celpe, con «Sé exigente» y errores máximos. Está bien. Pero es opcional y exige clave.

### 4.4 Qué géneros faltan

Producidos hoy: carta formal, e-mail informal, carta do leitor, artigo, resenha, texto de opinião,
resumo, relato. Faltan, por frecuencia en las provas: **post / texto para blog o rede social;
panfleto, folheto o texto de campanha; carta aberta, abaixo-assinado, manifesto; depoimento o
texto de apresentação (perfil); comentário em site ou fórum; roteiro; texto instrucional (guia,
dicas, regulamento); e-mail de reclamação ou de resposta a reclamação; proposta / projeto para
uma instituição**. Y en lectura/escucha: **anúncio, edital, bula, cardápio, propaganda, tirinha,
infográfico** (el Celpe usa textos multimodales) y **notícia** breve (hay reportagem, no notícia).

---

## 5. Lo que ya está bien (y conviene no romper)

- **La lengua.** 0 errores en 150 unidades; portugués brasileño natural en los dos registros;
  lusismos solo donde se enseñan; nada de italiano.
- **La didáctica contrastiva.** Cada bloque dice dónde tropieza el rioplatense y cómo se dice
  en la calle; las notas de los ítems dan la regla; los *garden path* y «Descubrí la regla»
  están bien armados. Las tablas de la revisión didáctica (significado + ejemplo por forma)
  quedaron muy claras.
- **El tramo C1.** Géneros reales (18 + 20), enunciados calcados de la prova, modelos de buena
  factura, glosas, caza de formas, VF con *não se diz*, sin sesgo de largo. Es lo mejor del
  contenido y el modelo para todo lo que sigue.
- **La cultura, verificada.** Las citas y fechas de la muestra son correctas y lo apócrifo se
  marca; desde la 27 la lectura es de verdad historia, sociología y literatura de Brasil y
  Portugal.
- **La oralidad brasileña en las escutas** (*a gente*, *tem*, próclise, *vou* + inf.) es la que
  corresponde.
- **El control de secuencia**: `sillabo.py` y `check_letture.py` pasan; las fórmulas
  adelantadas están declaradas (`formule_data.js`).
- **El corrector** ya no rechaza *pra, tá, cê, tava*: los marca como registro; los modelos
  informales pasan con 0 errores duros.

---

## 6. Lo que falta para 3.0: propuestas

Orden por prioridad. Costo: S (horas), M (días), L (semanas). Marco qué conviene generar con
herramientas y qué escribir a mano.

### P1. Portugués en las consignas y en las preguntas desde la semana 27 · ALTA · M

**Qué.** Las consignas de los 2.464 ítems son 266 cadenas distintas en castellano: traducirlas
al portugués y mostrarlas en portugués desde la 27 (o desde la 14 para las simples: *Complete.
Escolha a forma correta. Traduza.*). Lo mismo con las 303 preguntas de A semana / Martín /
Cultura / Enchentes de la 27 en adelante y con las 16 + 2 del examen.

**Por qué.** El Celpe-Bras es 100 % en portugués; un candidato que en la semana 52 todavía lee
«Elegí la forma correcta» no practicó nunca leer una consigna en portugués. Además, el
castellano en pantalla sostiene la «falsa facilidad» (Almeida Filho).

**Cómo.** Con herramienta: script que traduzca las 266 consignas (tabla revisada a mano una
sola vez) y una clave `lang_prompt` por semana en `build_course.py`; las preguntas de lectura
se reescriben a mano (303) o con IA revisada. Dejar la explicación (`note`) en castellano.

### P2. Fichas de género antes de cada tarefa y una franja discursiva desde la 27 · ALTA · M

**Qué.** (a) En cada `tramo/wNN.json`, un bloque `genero` con 4-6 pantallas: para qué sirve el
género, quién escribe a quién, estructura, 8-10 fórmulas de apertura, cuerpo y cierre, verbos y
modalizadores típicos, un modelo anotado. Para resenha, relato, carta do leitor, resumo, texto
de opinião, artigo, carta formal, e-mail informal. (b) Adelantar a la 27-34 lo que hoy está en
la 47-48: modalizadores y conectores argumentativos (47 → 28 y 34), verbos de decir y atribución
(48 → 31), apertura y cierre de carta (43 → 29). La 47 y la 48 quedan como profundización.

**Por qué.** 13 de 24 tarefas se piden antes de su teoría; 6 (resenha, relato) nunca la tienen.

**Cómo.** A mano (es el corazón del C1); el molde ya existe en `generi.json` (`hint`, `open`,
`close`). Reusar los modelos actuales como texto anotado.

### P3. Léxico: duplicar lo explícito con lo que ya se lee · ALTA · L (M con herramientas)

**Qué.**
1. **«Léxico da leitura»**: por cada leitura y escuta larga, 12-15 lemas B1-C1 del texto (hoy son
   5) con glosa, colocación del propio texto y una tarjeta que se juega en el repaso. Los 1.446
   lemas «solo-lectura» ya están en los textos: `lessico.gloss_table()` los saca con forma →
   lema → castellano → semana; queda revisar la glosa y elegir la colocación.
2. **Rellenar el desierto 15-26**: subir las palabras de la semana de 12 a 18 en la segunda
   estación, con las 6 nuevas sacadas del campo léxico de la semana (`SAI_FARE`) y de los textos
   de A semana / Cultura.
3. **Colocaciones desde la 14**: dos ítems por semana «Elegí la palabra que forma la combinación
   usual» (hoy 14 en el año) y una entrada de la palabra de la semana que se pregunte por la
   colocación (*fazer ___ questão*), no solo por el significado.
4. **Campos que faltan** (§2.6): futebol / esporte (semana 8 o 19), música / carnaval (11 o 17),
   política e cidadania (32 o 47), economia cotidiana (7, 22), meio ambiente / Amazônia (34),
   saúde pública (12, 23), con 6-8 palabras cada uno dentro de la semana que ya trata el tema.
5. **Formación de palabras en dos tiempos**: un bloque en la 22 (*-ção, -mento, -dade*: leer) y
   la 44 como está (producir).

**Por qué.** 57 % del top 5.000 y 43 % del top 8.000 en todo el curso, y 411 lemas B1 que se leen
y nunca se enseñan. Un C1 necesita el doble.

**Cómo.** (1) y (2) con herramientas: `lessico.py` + la lista de frecuencia + una pasada de IA
para el borrador de glosa y colocación, revisión a mano. (3), (4) y (5) a mano.

### P4. Pragmática explícita y habla real desde A2 · ALTA · M

**Qué.**
1. **Marcadores como fórmulas desde la 8**: *né, então, aí, tipo, olha, sabe?, entendeu?, pois é,
   imagina (= de nada), pode deixar, será que, tá bom, de boa, nem pensar, poxa, ué, eita*.
   Un bloque «Palavras que não estão no dicionário» cada 3-4 semanas (8, 12, 16, 20, 24), con
   audio de las dos voces y un ítem de escucha «¿qué hace *né* acá?». La semana 38 queda como
   síntesis.
2. **Actos de habla con semana propia**: pedir disculpas y reclamar (12 o 18), invitar / aceptar /
   rechazar sin ofender (6, existe: ampliar), dar y recibir cumplidos, negociar, atenuar un
   desacuerdo (*acho que não é bem assim*), interrumpir y ceder la palabra, pedir un favor grande
   (*será que você poderia…*). Hoy hay 3 bloques en 340.
3. **Escutas cortas con rasgos de habla espontánea** (1-2 minutos, desde la 14): repeticiones,
   falsos comienzos, *hum*, *é…*, solapamientos marcados, autocorrección, un *tu* del Sur o del
   Nordeste, un *uai*, un *oxe*. Escritas a mano siguiendo los patrones de C-ORAL-BRASIL
   (Raso & Mello 2012, con las frecuencias publicadas) y de NURC-Digital; no hace falta usar sus
   audios (licencias y calidad) sino sus rasgos.
4. **Escenas de frases después de la 19**: hoy 7 en 33 semanas. Sumar 6: reclamar (20), en el
   médico / trámite con *o senhor* (22), discutir con cariño (26), el trabajo (29), la mudanza /
   alquiler (32), la política de mesa (34).

**Por qué.** Los marcadores están entre las 30 palabras más frecuentes del habla; el alumno los
oye 11 semanas antes de que se los expliquen; la adequação ao contexto del Celpe se juega en
estas cosas.

**Cómo.** A mano. Las voces del teléfono ya alcanzan; para el solapamiento, dos pistas.

### P5. Input auténtico con licencia, guiado · ALTA · M (S por semana con el pipeline)

**Qué.** Una lectura real por semana desde la 20 (300-600 palabras), con glosas automáticas,
tres preguntas en portugués, VF y caza de formas. Fuentes con licencia compatible con una app
sin conexión: **Agência Brasil y Radioagência Nacional (EBC), CC BY 3.0 BR** — noticias,
reportagens y audios de radio de todo Brasil, con atribución; **Wikipédia y Wikinotícias en
portugués (CC BY-SA)** para los temas culturales; **Domínio Público / Biblioteca Brasiliana**
para literatura (ya en la Biblioteca); **Câmara, Senado, IBGE, Fiocruz** (textos institucionales
de uso libre) para editais, campanhas y infográficos. Con eso entran géneros que faltan
(notícia, edital, campanha, anúncio) y el léxico de los medios.

**Por qué.** El Celpe usa textos auténticos de la prensa brasileña; el curso tiene 123 mil
palabras de portugués escritas para él (más 540 mil de 1870-1910). La bibliografía de PFE pide
volumen de input para salir del plateau.

**Cómo.** Con herramientas: un script `tools/pt/fetch_ebc.py` (fecha, título, texto, licencia,
URL) + `lessico.gloss_table` + preguntas borrador con IA y revisión a mano. Guardar el texto en
`tools/pt/autentico/wNN.json` con la atribución.

### P6. Tareas comunicativas cortas desde la 8 y géneros nuevos en el tramo · MEDIA · M

**Qué.** (a) Reemplazar las consignas de *Escreva* de la 8 a la 26 por «tarefinhas» situadas de
40-80 palabras, con interlocutor y propósito, en portugués desde la 14: un bilhete para la
vizinha, una respuesta de WhatsApp, un aviso en el prédio, un comentário en un post, una
apresentação para un grupo, un pedido a un professor. La estructura de la semana se sugiere,
no se exige. (b) En el tramo, sumar los géneros de §4.4: post de blog (30), panfleto de campanha
(34), carta aberta / abaixo-assinado (36), depoimento (42), roteiro de vídeo (44), texto
instrucional (46), e-mail de reclamação (49), proposta a uma instituição (51), alternando con
los actuales. `generi.json` necesita sus `open`/`close`.

**Por qué.** 8 de 48 consignas de *Escreva* nombran un destinatario; 48 de 48 exigen una
estructura. Faltan los géneros más frecuentes de las provas recientes.

**Cómo.** A mano (24 + 8 consignas y modelos).

### P7. Revisión local que mire adequação ao contexto · MEDIA · S-M

**Qué.** En `tramo.js` `evaluate()`:
1. **Tratamiento coherente**: si el género es formal, contar *você / te / teu* contra *o senhor /
   a senhora / lhe / seu* y avisar cuando se mezclan.
2. **Propósito**: por género, una lista de verbos-acto (*solicito, venho pedir, proponho, sugiro,
   recomendo, discordo, lamento, agradeço, informo*) y avisar si no aparece ninguno.
3. **Uso de la fuente**: exigir que al menos N lemas de contenido de la fuente (no de la consigna)
   aparezcan, además del «no copiar».
4. **Registro medido**: proporción de marcas coloquiales (*pra, tá, né, a gente, cê*) contra
   formales (*porém, portanto, cujo, ênclise*) y compararla con el registro pedido; hoy el
   corrector solo avisa palabra por palabra.
5. **Puntos de la consigna por hechos de la fuente**: reemplazar las palabras genéricas
   (*quando, semana, hoje*) por nombres, cifras y términos del texto fuente.

**Por qué.** Hoy un texto con las palabras clave pasa sin cumplir la tarea. Sin IA es lo único
que mide.

**Cómo.** Con herramientas (es código + listas cortas por género en `generi.json`).

### P8. Examen final como prova · MEDIA · M

**Qué.** Cuatro tarefas integradas en portugués (2 de audio, 2 de texto, sin extensión ni
registro explícitos), corrección por las tres adequações (local + IA), y 3 versiones. Las
preguntas de escucha en portugués y con opciones del mismo largo (15 de 16 hoy). Mantener
Estruturas y Léxico como «prova europea» opcional, con sus 164 ítems fuera del entrenamiento
de la 52.

**Cómo.** A mano (12 tarefas nuevas); el motor del tramo ya lo hace.

### P9. Variación repartida por el año · MEDIA · S-M

**Qué.** Un «sotaque da semana» de una pantalla cada 4 semanas (Rio, São Paulo, Minas, Bahia,
Pernambuco, Rio Grande do Sul, Pará; Lisboa; Luanda; Maputo), con una frase de audio y 3
palabras; *tu* con audio en la 5 y la 16 (Sur y Nordeste), no solo en la tabla; una escuta larga
del tramo con un hablante gaúcho o nordestino. La 46 queda como cierre.

### P10. Reordenar para hacer lugar · MEDIA · M

Comprimir a media semana: crase (36), verbos derivados (37), mais-que-perfeito simples (41),
falsos amigos (45). Con las cuatro medias semanas liberadas: **36b «Gêneros: resenha e relato»**,
**37b «Modalizar e opinar»** (de la 47), **41b «Léxico da vida pública»** (eleições, tributos,
serviços), **45b «Precisão lexical»** (sinónimos por registro, verbos genéricos → precisos:
*fazer → realizar, elaborar, promover*).

### P11. Restos y detalles · BAJA · S

- E5: reescribir 20-30 frases de las escenas con *pra / pro / cê / tá* dentro de la frase (hoy 0
  de 455), empezando por *Bora para a praia?* → *Bora pra praia?*.
- E6: corregir *joelho* y *espalhar* («*lh* como la *ll* antigua, no *li*»).
- E7: sacar «(PT)» de la respuesta de s4-46-33 y s4-46-36 (ponerlo en el `prompt`).
- B8: s1-05-11 (*me acordo* como opción antes de los reflexivos), s1-01-41 y s1-01-42 a la
  semana 3.
- Teoría w32 b5: *Tão falando* → *Tá todo mundo falando* o glosar «*tão* = *estão*, semana 38».
- s4-43-02: suavizar la nota sobre *Atentamente*.
- Los 4 distractores en castellano de la muestra (y buscar los demás con un script sobre
  `options`: palabras que no existen en portugués).
- Unificar las 46 glosas vocab / banco con acepciones distintas (o mostrar las dos en el toque).

### Qué conviene generar con herramientas y qué escribir a mano

| Con herramientas (script + IA borrador + revisión) | A mano |
|---|---|
| Consignas y preguntas en portugués (P1) | Fichas de género y modelos anotados (P2) |
| Léxico da leitura desde los 1.446 lemas solo-lectura, glosas, colocaciones del propio texto (P3.1) | Bloques de marcadores y actos de habla (P4.1, P4.2) |
| Pipeline de textos EBC / Wikipédia con glosas y borrador de preguntas (P5) | Escutas cortas con habla espontánea (P4.3) |
| Revisión local de adequação (P7) | Tarefinhas A2-B1 y géneros nuevos (P6) |
| Búsqueda de distractores en castellano, glosas inconsistentes, «(PT)» en respuestas (P11) | Tarefas del examen (P8), sotaques (P9) |
| Preguntas con opciones del mismo largo en el examen (script de control como el de A6) | Reordenamiento de semanas (P10) |

### Esfuerzo total aproximado

| Grupo | Esfuerzo |
|---|---|
| P1 consignas/preguntas en portugués | 2-3 días |
| P2 fichas de género + adelantos | 4-5 días |
| P3 léxico (con herramientas) | 1-2 semanas |
| P4 pragmática y habla | 1 semana |
| P5 input auténtico (pipeline + 30 textos) | 3-4 días + 1 h por semana |
| P6 tareas cortas y géneros nuevos | 4-5 días |
| P7 revisión local | 1-2 días |
| P8 examen como prova | 3 días |
| P9, P10, P11 | 3-4 días |

---

## 7. Lo que no pude medir

- **Las provas reales del Celpe-Bras y el Documento base** no están en el repo; comparé con lo
  que conozco de las ediciones 2015-2024 y del Documento base 2020, sin descargar los PDF.
- **C-ORAL-BRASIL y NURC**: no tengo los corpus acá; las frecuencias de marcadores que cito son
  las publicadas (Raso & Mello 2012) y la comparación es de orden de magnitud, no exacta.
- **El Referencial Camões / QuaREPE**: comparé por inventario general de niveles, no ítem por
  ítem.
- **La rúbrica con IA**: no tengo clave; juzgué el prompt, no las respuestas.
- **La app en el teléfono**: esta vez no corrí Playwright; todo se midió sobre los datos y con
  `pack.js`.
- **La clasificación de bloques por dominio** (§1.1) es por palabras clave; sirve para ver el
  desequilibrio, no para contar con precisión.
- **Horas reales del alumno** y si con el tramo el año entra en las ~105 h estimadas: no lo
  medí.
