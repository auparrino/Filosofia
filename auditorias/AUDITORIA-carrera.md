# Auditoría: una carrera completa (52 semanas)

**Quién jugó.** Un estudiante aplicado que sigue el percorso al pie de la
letra: juega la lección, las palabras, entrena hasta dominar la semana, hace
la escena de frases, la lectura, el laboratorio, el banco y todas las Sfide de
la semana, y cada día una Pausa caffè y un Ripasso. Acierta el 90 % de las
preguntas de opciones y el 80 % de las que se escriben.

**Cómo se jugó.** Con `tools/sim_carriera.js`, que carga los mismos módulos
que la app (`engine`, `drills`, `frasi`, `lab`, `letture`, `lezione`, `banca`)
con un reloj simulado de un día por sesión, juega las 52 semanas y anota por
semana cuánto hay que jugar, cuánto tarda, qué se repite, qué queda sin usar y
cuánto ripasso se acumula. Además revisa la integridad de los 2.960 ítems y
genera cinco veces los chequeos de cada lección.

```sh
node tools/sim_carriera.js          # tabla por semana
node tools/sim_carriera.js --json   # todo el detalle
```

## La carrera en números

| | |
|---|---|
| Sesiones (días simulados) | 159 |
| Horas de juego | 63 (más unos 10 min diarios de pausa + ripasso en uso real) |
| XP final · nivel · rango | 170.123 · 40 · *Poeta* |
| Jefes | los cuatro superados (13, 26, 39, 52), tres al primer intento |
| Medallas | 18 de 22 |
| Frases vistas | 294 / 294 |
| Lecturas | 20 / 20 |
| Palabras practicadas | 485 |
| Fichas en repaso | 3.153 |
| Fichas vencidas al final | **2.206** (máximo 2.722) |
| Ítems del curso servidos alguna vez | 2.183 de 2.960 (**777 nunca**) |
| Ítems rotos, duplicados, errores de ejecución | 0 · 0 · 0 |

Lo que falla no es el contenido (ningún ítem roto, ningún error en 52
semanas) sino el **ritmo y la economía** del curso: cuánto se pide, cuándo, y
qué se hace con lo que ya se vio.

---

## 1. El ripasso se vuelve una deuda impagable (grave)

Fichas vencidas cada 10 días de la carrera:

| día | 11 | 31 | 51 | 71 | 91 | 111 | 131 | 151 | 171 |
|---|---|---|---|---|---|---|---|---|---|
| vencidas | 157 | 613 | 990 | 1.565 | 1.766 | 2.015 | 2.305 | 2.572 | 2.623 |

Cada ítem respondido, aunque haya salido bien a la primera, se convierte en
una ficha SM-2 con intervalo corto; a los tres meses hay 3.000 fichas y el
Ripasso ofrece 20 por día. A partir de la semana 13 la tarjeta de Oggi dice
«850 para repasar», y al final «2.200». Un estudiante real deja de abrirla.

**Qué hacer.**
- No crear ficha para lo que salió bien a la primera en el entrenamiento;
  solo para errores, frases y palabras (lo que de verdad hay que retener).
- Graduar fichas: con intervalo mayor a 60 días, retirarlas de la cola.
- Priorizar la cola (errores recientes, la semana actual, después el resto) y
  mostrar «hoy: 20», nunca el total pendiente.
- Que la Pausa caffè consuma la cola de ripasso en vez de sumar fichas
  nuevas.

## 2. Tres cuartas partes del curso no se ven (grave)

Ítems propios de la semana contra ítems distintos que el entrenamiento llegó a
servir antes de «Superá la semana» y «Dominala»:

| semana | pool | servidos | | semana | pool | servidos |
|---|---|---|---|---|---|---|
| 3 | 73 | 10 | | 31 | 81 | 7 |
| 10 | 105 | 10 | | 34 | 74 | 10 |
| 11 | 166 | **7** | | 42 | 89 | 10 |
| 15 | 66 | 7 | | 50 | 180 | 89 |
| 17 | 205 | 100 | | 51 | 554 | **20** |

Una ronda son 12 preguntas, y de esas 4 son gimnasio y 2 palabras; las
palabras y el gimnasio **cuentan** para las 20 correctas y las 30 respuestas,
así que una o dos rondas cierran la semana. La semana 11 (passato prossimo,
166 ejercicios) se «domina» habiendo visto 7. Al terminar el año quedan 777
ejercicios que nadie vio, y no están en las Sfide.

**Qué hacer.**
- Que «Dominala» exija cobertura del pool propio (por ejemplo el 60 % de los
  ítems de la semana vistos, o al menos 40 distintos), no solo 30 respuestas.
- Que el gimnasio y las palabras no cuenten para las estrellas de la semana,
  o cuenten aparte.
- Que lo no visto de una semana alimente las pausas y los ripassi de las
  semanas siguientes (ya existe el mecanismo `extra`; hoy solo lo usa el
  sillabo).

## 3. «Dominala» es imposible en cuatro semanas y cara en otras cuatro (grave)

La maestría es 85 % de acierto sobre **todas** las respuestas de la semana,
acumuladas. Si la semana es casi toda de escribir, un estudiante que acierta
el 80 % escribiendo nunca llega, por mucho que juegue:

| semana | rondas | respuestas | dominada |
|---|---|---|---|
| 9 Preposizioni di base | 12 (tope) | 175 | no |
| 30 Congiuntivo imperfetto | 12 (tope) | 175 | no |
| 38 Discorso indiretto | 12 (tope) | 172 | no (pool de 25: cada ítem 8 veces) |
| 50 Lessico avanzato | 12 (tope) | 175 | no |
| 14, 17, 23 | 8 a 10 | 112 a 139 | sí, tarde |

**Qué hacer.** Medir la maestría sobre las últimas 30 respuestas (ventana
móvil) o sobre el estado de las fichas del pool (cuántas están «firmes»),
no sobre el acumulado histórico.

## 4. El final del curso es un acantilado de Sfide (grave)

Sfide del Maestro por semana (grupos · subítems · minutos):

| semana | 11 | 17 | 19 | 26 | 39 | 50 | 51 | **52** |
|---|---|---|---|---|---|---|---|---|
| grupos | 22 | 24 | 40 | 22 | 25 | 23 | 57 | **118** |
| subítems | 124 | 143 | 202 | 122 | 145 | 168 | 343 | **684** |
| minutos | 25 | 36 | 42 | 36 | 43 | 52 | 104 | **196** |

Las semanas 41 a 49 tienen entre 1 y 10 grupos; las dos últimas, 175. Pasa
porque el sillabo manda cada grupo a la semana de su ítem más difícil, y
todo lo que toca gramática tardía cae en el examen final. La semana 52
(examen + 118 sfide) dura más de cuatro horas.

Aparte, el README sigue diciendo que los 1.632 subítems del *Soluzioni* «no se
corrigen solos»: hoy 338 de los 339 grupos se juegan con corrección
automática. Vale actualizar las «Dos advertencias honestas».

**Qué hacer.** Tope de 8 a 10 grupos por semana; lo que sobra baja a la
semana siguiente que tenga capacidad; lo que necesita gramática de la 51-52
se reparte entre las semanas 40-50 que ya la tengan.

## 5. La cuarta estación es un desierto (medio)

Misiones por estación, sin contar lección, palabras, entrenamiento y gimnasio:

| estación | frases | lecturas Martín | cultura | ponte / capire / falsi | sfide |
|---|---|---|---|---|---|
| 1 (1-13) | 11 | 4 | 1 | 9 / 3 / 1 | 10 |
| 2 (14-26) | 3 | 4 | 1 | 0 / 3 / 0 | 13 |
| 3 (27-39) | 2 | 2 | 8 | 0 / 0 / 0 | 11 |
| 4 (40-52) | **1** | **0** | **0** | 0 / 0 / 0 | 12 |

Desde la semana 38 no hay más lecturas y desde la 41 no hay más frases: el
tramo B2 → C1, que según el README «exige volumen de lectura, escucha y
producción», es puro drill gramatical y Sfide. Además, cuatro de los diez
textos de Cultura caen en la misma semana 37.

**Qué hacer.** Escenas C1 nuevas (correo de trabajo, discutir, contar una
anécdota, registro formal) para las semanas 41-52; episodios 11-13 de Martín
en B2/C1; repartir los textos de Cultura (uno por semana entre la 24 y la 52,
ninguno duplicado en la 37).

## 6. Los jefes examinan lo básico (medio)

Composición de cada jefe (25 preguntas; el final, 40):

| jefe | gimnasio | semana 1 (essere/avere, sonidos) | el resto |
|---|---|---|---|
| 13 (A2) | 7 | 10 | 8 |
| 26 (B1) | 7 | 8 | 10 |
| 39 (B2) | 7 | 4 | 14 |
| 52 (C1) | 12 | 6 | 22 |

`buildBoss` toma al azar del pool de todas las semanas anteriores, y los
pools de jefe (511, 358, 344 y 1.527 ítems) están llenos de repasos cuya
teoría es la semana 1. El examen C1 es un 30 % de conjugación mecánica y un
15 % de *essere* y *avere*.

**Qué hacer.** Ponderar por estación (la mitad de la estación que cierra, un
cuarto de la anterior, el resto libre) y limitar el gimnasio al 20 %.

## 7. Los rangos altos no existen (medio)

El nivel sube con xp × 1,15 por nivel. Jugando todo el curso se llega al nivel
40 (*Poeta*, 170.000 xp). *Dantesco* pide el nivel 45 (unos 312.000 xp) y
*Madrelingua* el 55 (1.260.000 xp, siete veces la carrera entera). Ningún
estudiante los va a ver.

**Qué hacer.** Recalibrar: *Dantesco* al terminar la estación 4 (nivel ~36),
*Madrelingua* al superar el examen final (nivel ~40), o poner los rangos
sobre estrellas y jefes en vez de xp.

## 8. La meta de palabras es inalcanzable (medio)

Oggi mide «palabras practicadas» contra 2.000 en el primer trimestre, 3.500
en el segundo y 5.000 después. El percorso trae 9 a 15 palabras por semana:
al final del año hay **485**. La barra queda al 10 % para siempre. Además,
en 27 semanas al menos 4 de las palabras no tienen frase de ejemplo (semana
2: 11 de 12; semana 11: 11 de 12).

**Qué hacer.** Meta realista (600 palabras del percorso + las del banco que
se practiquen), y completar los ejemplos.

## 9. Carga por semana (medio)

Minutos por semana con todas las misiones (sin pausa ni ripasso diarios):

- Normal: 45 a 100 minutos.
- Picos: semana 9 (159), 17 (138), 19 (123), 30 (130), 38 (111), 50 (178),
  51 (153), **52 (259)**.
- Semana 5: 11 misiones (lección, palabras, entrenamiento, In giro, Al
  mercato, Ponte, Capire, dos bancos, Sfide, dominarla): mucha para la semana
  en que llega el presente.

Los picos vienen de lo anterior (rondas sin fin por la maestría, Sfide
apiladas). Corregidos 3 y 4, la carga queda pareja.

## 10. Lecciones (leve)

- 4,5 chequeos por lección en promedio; con la tercera opción en los pares
  mínimos no queda ninguna lección donde la mayoría sean binarios.
- Bloques sin chequeo: semana 52 (4 de 5), 32 (3 de 4), 26 (3 de 8), 1 (2 de
  7), 10 (2 de 4), 51 (2 de 5). El generador solo pregunta si hay tabla o
  ejemplos traducidos; esos bloques tienen texto suelto.

## 11. Integridad de datos (bien)

- 2.960 ítems: 0 sin respuesta, 0 con la respuesta fuera de las opciones, 0
  con opciones repetidas, 0 duplicados, 0 huérfanos.
- 17 avisos de «restos de formato» son falsos positivos: corchetes usados a
  propósito (*[i baci]*, sonido *[k]*).
- 6 cloze del *Soluzioni* con respuesta de más de 90 caracteres nunca tienen
  versión de reconocimiento: llegan escritos desde la primera vez.
- 0 errores del conjugador en todas las combinaciones verbo × tiempo de las
  52 semanas.

## 12. Medallas no alcanzadas

*Maestro del congiuntivo*, *Penna*, *Scrittore* y *Fulmine* dependen de
frases escritas de memoria y del Lampo, que el simulador no juega. Son
alcanzables.

---

## Estado de las correcciones (23/9)

| Punto | Qué se hizo |
|---|---|
| 1 Ripasso | Fichas **ligeras** para lo que sale bien a la primera en el entrenamiento (vuelven a los 14 días y, si salen bien, se retiran); toda ficha con 45 días de intervalo (cuatro aciertos) se retira; la cola prioriza errores y la semana en curso; Oggi muestra «hoy: 20 (quedan N)». La pausa toma 4 del ripasso. |
| 2 Cobertura | El gimnasio y las palabras ya no cuentan para las estrellas; «Dominala» exige el 60 % del pool visto (o 40 ítems); cada ronda arrastra un par de ejercicios no vistos de las cuatro semanas anteriores. Nunca vistos: de 777 a 262. |
| 3 Maestría | 85 % sobre las **últimas 30** respuestas (`ws.last`), no sobre el acumulado. Ninguna semana queda sin dominar en la simulación. |
| 4 Sfide | Tope de 12 grupos por semana: las semanas de repaso toman una muestra pareja y las semanas propias pasan el sobrante a las siguientes. La 52 baja de 118 a 12. README actualizado. |
| 5 Estación 4 | Cuatro escenas C1 nuevas (mail formal, discutir, aneddoto, burocracia: 64 frases) en las semanas 42-48; Martín 11-13 (C1) en 41, 45 y 49; Cultura repartida (Beccaria 36, Machiavelli 38, Levi 42, Gramsci 45, Ginzburg 48). |
| 6 Jefes | Mitad de la estación que cierra, un cuarto de la anterior, el resto libre; gimnasio al 20 %; resultado por abilità. |
| 7 Rangos | *Poeta* 28, *Dantesco* 34, *Madrelingua* 40: quien termina el curso llega a Madrelingua. |
| 8 Palabras | Meta 800 / 1.800 / 2.800 / 3.800 y *Parole* del banco a un toque en Oggi. Los ejemplos que faltan siguen pendientes. |
| 9 Carga | Con 3 y 4 corregidos, sin picos de Sfide; las semanas quedan entre 60 y 130 minutos. |
| 10 Lecciones | Chequeo «Completá la regla» para los bloques de texto suelto. |

Con todo aplicado, la misma carrera simulada (ahora siete días por semana,
con pausa y ripasso diarios) da: 364 días, 106 horas, nivel 44 *Madrelingua*,
ninguna semana sin dominar, 263 ejercicios nunca vistos (antes 777), cola de
ripasso con máximo 672 y 446 al final (antes 2.722 y 2.206), Sfide a lo sumo
12 por semana, jefes con una o dos preguntas de cada semana de su estación y
el gimnasio al 20 %.

Y, de la guía y para el enganche: sfida del giorno con doble xp, bono de
primera ronda, xp ×1,2 con racha de 7, 🎟️ de doble xp en el cofre, misión
completada y settimana perfetta con +100 xp y medallas, meta de fin de semana
a la mitad, medidor de las cuatro cuerdas, cuaderno itañol. El simulador
(`tools/sim_carriera.js`) ahora juega siete días por semana.

---

## Prioridad (original)

1. Ripasso: fichas solo para errores, frases y palabras; graduación; cola
   priorizada y «hoy: 20» (sección 1).
2. Cobertura: maestría por cobertura del pool y no por 30 respuestas; lo no
   visto pasa a las semanas siguientes (2).
3. Maestría por ventana móvil o por fichas firmes (3).
4. Sfide repartidas con tope por semana; README actualizado (4).
5. Contenido C1: frases, Martín 11-13, cultura repartida (5).
6. Jefes ponderados por estación (6).
7. Rangos y meta de palabras recalibrados (7, 8).
8. Chequeos para los bloques de texto suelto (10).
