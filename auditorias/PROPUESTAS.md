# Propuestas: lo que falta según la bibliografía

La app ya cubre casi todo lo replicado sobre memoria y gramática: FSRS,
recuperación, reaprendizaje sucesivo, feedback correctivo, HVPT, dictogloss,
input estructurado, garden path, inundaciones, bloques léxicos, lectura con
audio. Este documento no repite eso: compara la investigación con lo que el
código hace hoy (v44) y ordena lo que falta por **efecto esperado ÷ costo**.

Por ahora **no entra nada que use tu voz** (reconocimiento, grabación,
shadowing): queda para más adelante.

---

## Gramática

### 1. Duelos: formas que se confunden, mezcladas (alta)

**Qué.** Sesiones cortas (10 a 12 preguntas) que mezclan **dos formas que
compiten** en vez de practicar una por vez: passato prossimo o imperfetto,
indicativo o congiuntivo, *ci* o *ne*, *essere* o *avere*, futuro o
condizionale, *che* o *cui*, *di* o *da*, *lo/gli/le*. Después de cada
acierto, un toque más: **«¿qué te lo dijo?»**, y elegís la pista en la
oración (*da tre anni*, *penso che*, *ieri*, *se*). El duelo se abre cuando
las dos formas ya se enseñaron, y vuelve en el repaso.

**Por qué.**
- Intercalar funciona cuando las categorías **se parecen entre sí**: g = 0,42
  en 59 estudios, y el efecto crece con la similitud entre categorías
  (Brunmair & Richter 2019). Mezclar vocabulario suelto, en cambio,
  perjudica (g = −0,39): los duelos son para gramática, y las palabras
  nuevas siguen en bloque, como ahora.
- Pedir que expliques por qué: g = 0,55 en 64 estudios, para conocimiento
  declarativo y procedimental (Bisra et al. 2018). «¿Qué te lo dijo?» es
  la versión de un toque.
- Hoy las rondas se arman por semana, así que cada forma se practica sola
  justo en la semana en que se enseña. Los duelos obligan a elegir entre las
  dos, que es lo que pide hablar de verdad.

**Material.** Ya existe: el banco tiene pares como *Io gliene ___ (parlare)
domani* en futuro y en condicional (d18-001 y d18-036), y los ítems llevan
la semana (`wk`) de su gramática. Falta la lista de duelos y marcar la pista
en cada oración (`tools/authored/`).

**Costo.** Medio.

### 2. Medir la velocidad, no solo el acierto (media)

**Qué.** Registrar cuánto tardás en responder. Tres usos:
1. **FSRS**: correcto pero lento (más del doble de tu mediana en ese tipo de
   pregunta) cuenta como *Hard*; rápido y correcto, como *Easy*. Hoy
   todo acierto vale lo mismo.
2. **Progreso visible**: «el passato prossimo te sale un 40 % más rápido que
   en la semana 12», como los récords que la app ya muestra.
3. **Dominala** y los jefes pasan a premiar el conocimiento automatizado,
   no solo el declarativo.

**Por qué.** La automatización se mide con el tiempo de reacción y su
variabilidad. Saber la regla y usarla rápido son dos conocimientos
distintos (DeKeyser & Suzuki 2025; Suzuki, Maie & Hui 2025).

**Costo.** Bajo: un `performance.now()` al mostrar la pregunta y otro al
responder, y un campo más en el registro de repasos.

### 3. Preguntas nuevas en cada jefe (media)

**Qué.** Un 20 % de preguntas que **nunca aparecieron** en las rondas, sobre
la misma gramática, informadas aparte: «con lo practicado: 88 %; con frases
nuevas: 71 %». No cuentan para aprobar.

**Por qué.** Una pregunta ya practicada mide si la recordás; una nueva mide
si la regla generaliza. Esa brecha explica por qué los estudios de apps
encuentran más avance con el material de la app que en pruebas externas
(Loewen et al. 2019, 2020).

**Costo.** Bajo, tomándolas del banco (`Banca.translateItem`, `gapSession`)
filtradas por semana.

### 4. Prueba de ubicación (media)

**Qué.** Al empezar, *«Ya sé algo de italiano»*: 15 a 25 preguntas
adaptativas con los ítems del curso. Si acertás, la siguiente es de una
semana más avanzada; si fallás, de una anterior (búsqueda binaria sobre
las 52 semanas y un ajuste final de ±2). Abre el curso hasta la semana
estimada y manda al repaso lo fallado de las semanas saltadas.

**Por qué.** Un test adaptativo estima el nivel con muchas menos preguntas
que uno fijo. Hoy alguien con B1 tiene que hacer 25 semanas de misiones
antes de llegar a su nivel.

**Costo.** Medio; se prueba entero con `tools/sim_carriera.js`.

### 5. Pragmática explícita (baja)

**Qué.** Seis a ocho microlecciones a lo largo del año sobre actos de
habla, con la regla dicha: pedir, rechazar, quejarse, disculparse, tú o
*Lei* según el contexto, suavizadores (*magari, un attimo, volevo
chiedere*). Cada una con situaciones de elegir la opción adecuada.

**Por qué.** La pragmática se puede enseñar, y la instrucción explícita
supera a la implícita (Taguchi 2015; Plonsky & Zhuang 2019). Hoy la
cortesía aparece en frases sueltas (*Frasi*, *sportello*), nunca como regla.

**Costo.** Bajo en código; el trabajo es escribir el contenido.

---

## Lectura

### 6. Glosas de opción múltiple (alta)

**Qué.** En cada lectura, las 3 a 5 palabras nuevas que importan dejan de
ser «tocá y te digo»: al llegar a ellas aparece una glosa con dos o tres
significados en castellano, elegís el correcto **por el contexto** y
seguís leyendo. Las demás palabras quedan con el toque de siempre. Las
elegidas entran al repaso.

**Por qué.** Metaanálisis de 42 estudios y 3.802 participantes (Yanagisawa,
Webb & Uchihara 2020): leer con glosas deja un 45 % de las palabras frente
a un 27 % sin glosas, y **las de opción múltiple son las más efectivas**,
mientras que los glosarios y las glosas en el texto (lo que la app hace
hoy) son las menos. Las glosas en la lengua materna rinden más que en L2,
así que van en castellano.

**Costo.** Bajo: las lecturas ya tienen glosario y la app ya arma
distractores de la misma clase y frecuencia (`frequenza.js`).

### 7. Más lectura graduada, sobre todo al principio (alta)

**Qué.** Hoy hay 35 textos para 52 semanas, y en las semanas 1 a 10 solo
tres: dos episodios de Martín y una inundación. La propuesta es **un texto
corto por semana** (150 a 400 palabras) que use la gramática de esa semana
y las palabras ya vistas. Se escriben una vez, se revisan con las
herramientas que ya existen (`sillabo.py` para la gramática y `lessico.py`
para que el 98 % de las palabras sean conocidas) y quedan en el curso,
disponibles sin conexión. No es la *Storia* de la IA, que es opcional y
necesita clave.

**Por qué.**
- Lectura extensiva: d = 0,57 frente a grupos control, más en adultos y con
  textos digitales (Jeon & Day 2016).
- Para leer sin diccionario hace falta conocer el 98 % de las palabras del
  texto (Hu & Nation 2000): el curso ya sabe qué palabras conocés en cada
  semana, así que puede garantizarlo.
- El año de la app es corto para llegar a C1 (el FSI calcula 600 a 750
  horas de clase para el italiano): la lectura es la forma más barata de
  sumar volumen.

**Costo.** Medio: el trabajo es escribir o generar y revisar unos 30 textos.

### 8. Lectura cronometrada y relectura (media)

**Qué.** Las lecturas miden **palabras por minuto** (desde que abrís el
texto hasta que tocás «Terminé», antes de las preguntas) y la comprensión
tiene que quedar en 70 % o más para que el tiempo cuente. Te muestra la
curva del año. Un episodio ya leído se puede releer para bajar el tiempo;
la cuarta lectura es la que más rinde. Todo en silencio: no hace falta leer
en voz alta.

**Por qué.** Con lectura cronometrada, estudiantes de L2 subieron entre 13 y
27 palabras por minuto en un semestre (*Reading in a Foreign Language*,
2018), y la fluidez crece más con cuatro lecturas del mismo texto. Leer
rápido libera atención para la gramática y el sentido.

**Costo.** Bajo.

### 9. Input fuera de la app, contado (media)

**Qué.** Una misión opcional por semana: 📺 *Fuori dalla app*. La app
sugiere qué ver, escuchar o leer según el nivel (A2: series con subtítulos
en italiano; B1: podcasts para estudiantes; B2 en adelante: RaiPlay, radio,
diarios) y vos anotás los minutos con un toque. Esos minutos entran en la
cuerda *input* y en la meta semanal.

**Por qué.** Video con subtítulos en italiano: g = 0,56 en vocabulario en 49
estudios (Kurokawa, Hein & Uchihara 2025) y un efecto grande en
comprensión auditiva (Montero Perez et al. 2013).

**Costo.** Bajo.

### 10. Con la IA, primero vos (baja)

**Qué.** En Scrivi y en *Explicame*, antes de mostrar la corrección de la
IA: «¿qué creés que está mal?», una línea, que después se compara con lo
que marcó la IA.

**Por qué.** Con IA generativa la tarea sale mejor, pero el que aprende
controla menos lo que hace y no aprende más: la llaman «pereza
metacognitiva» (Fan et al. 2024). Las pistas graduadas ya van en esa
dirección; esto cubre Scrivi.

**Costo.** Bajo.

---

## Voces reales en vez de la voz del teléfono

La voz sintética varía mucho según el teléfono y en algunos casi no se
distinguen las dobles. Para el entrenamiento de sonidos (HVPT) lo que
importa es escuchar **muchos hablantes reales**. Hay tres fuentes
libres, y cada una sirve para algo distinto:

| Fuente | Qué trae | Licencia | Para qué sirve |
|---|---|---|---|
| **Mozilla Common Voice** (italiano) | Cientos de horas de **oraciones** leídas por miles de voluntarios, con votos de validación | CC0 (sin atribución) | Dictado y escucha de gramática con voces reales |
| **Lingua Libre** (Wikimedia Commons) | Unas 11.900 grabaciones de **palabras sueltas** en italiano, varios hablantes | CC BY-SA 4.0 (hay que atribuir) | Pares mínimos de Suoni (*pala/palla, nono/nonno*) |
| **Tatoeba** | Oraciones cortas con audio y traducción | Varía según quien grabó | Complemento de frases |

**Propuesta con Common Voice, pensada para gramática:**
1. Del conjunto validado de italiano, quedarse con oraciones cortas (5 a 12
   palabras) que tengan al menos dos votos a favor y ninguno en contra.
2. Pasarlas por `sillabo.py`, que ya reconoce tiempos y construcciones, para
   asignarles la semana: «esta usa congiuntivo imperfetto → semana 30»,
   «esta tiene *ne* partitivo → semana 21».
3. Elegir unas 10 por semana, de hablantes distintos, y guardarlas en
   `docs/audio/cv/`. Son unas 500 oraciones, que en MP3 pesan unos 15 a
   20 MB y funcionan sin conexión.
4. Usarlas en el **dictado de Suoni** y en un ejercicio nuevo: escuchás la
   oración y elegís o escribís la forma que oíste (*andasse / andava*).
   Esto es escuchar la gramática, no solo los sonidos.

**Y para los pares mínimos**, Lingua Libre: bajar las grabaciones de las
190 palabras de los pares de `ascolto_data.js` cuando existan, con dos o
tres hablantes por palabra, y usar la voz del teléfono solo para las que
falten. La atribución va en una página de créditos.

**Qué hace falta para avanzar.** Desde este entorno no puedo bajar nada: la
red bloquea `commonvoice.mozilla.org`, `datacollective.mozillafoundation.org`,
`commons.wikimedia.org` y `tatoeba.org`. Además, hoy Common Voice se
descarga desde Mozilla Data Collective con una cuenta y aceptando sus
términos. Dos caminos:
- **(a)** Agregar esos dominios a *Network access* en la configuración del
  entorno. Con eso bajo y proceso Lingua Libre directamente, y para Common
  Voice me pasás el archivo del conjunto italiano o el link de descarga.
- **(b)** La app los busca en el teléfono la primera vez (la API de Commons
  permite consultas desde el navegador) y los guarda en caché. No hace
  falta bajar nada acá, pero no lo puedo probar hasta que lo abras vos, y la
  primera vez necesita internet.

Recomiendo **(a)**: los audios quedan revisados y en el repositorio.

---

## Orden sugerido

| # | Propuesta | Efecto esperado | Costo |
|---|---|---|---|
| 6 | Glosas de opción múltiple | Alto | Bajo |
| 1 | Duelos de formas parecidas + «¿qué te lo dijo?» | Alto | Medio |
| 7 | Un texto graduado por semana | Alto (volumen) | Medio |
| — | Voces reales (Lingua Libre + Common Voice) | Medio-alto | Medio, necesita red |
| 2 | Tiempo de respuesta → FSRS y récords | Medio | Bajo |
| 8 | Lectura cronometrada y relectura | Medio | Bajo |
| 3 | Preguntas nuevas en el jefe | Medio (medir bien) | Bajo |
| 9 | Input fuera de la app | Medio | Bajo |
| 4 | Prueba de ubicación | Alto si no empezás de cero | Medio |
| 5 | Pragmática | Bajo-medio | Bajo |
| 10 | IA: primero vos | Bajo | Bajo |

## Bibliografía

- Bisra, K., Liu, Q., Nesbit, J., Salimi, F. & Winne, P. (2018). Inducing self-explanation: A meta-analysis. *Educational Psychology Review*, 30.
- Brunmair, M. & Richter, T. (2019). Similarity matters: A meta-analysis of interleaved learning and its moderators. *Psychological Bulletin*, 145(11).
- DeKeyser, R. & Suzuki, Y. (2025). Skill acquisition theory. En VanPatten, Keating & Wulff (eds.), *Theories in SLA* (4.ª ed.). Routledge.
- Fan, Y. et al. (2024). Beware of metacognitive laziness: Effects of generative AI on learning motivation, processes, and performance. arXiv:2412.09315.
- Hu, M. & Nation, P. (2000). Unknown vocabulary density and reading comprehension. *Reading in a Foreign Language*, 13(1).
- Jeon, E.-Y. & Day, R. (2016). The effectiveness of ER on reading proficiency: A meta-analysis. *Reading in a Foreign Language*, 28(2).
- Kurokawa, S., Hein, A. & Uchihara, T. (2025). Incidental vocabulary acquisition through captioned viewing: A meta-analysis. *Language Learning*, 75(4).
- Loewen, S. et al. (2019). Mobile-assisted language learning: A Duolingo case study. *ReCALL*, 31(3).
- Loewen, S., Isbell, D. & Sporn, Z. (2020). The effectiveness of app-based language instruction. *Foreign Language Annals*, 53(2).
- Montero Perez, M., Van Den Noortgate, W. & Desmet, P. (2013). Captioned video for L2 listening and vocabulary learning: A meta-analysis. *System*, 41(3).
- Plonsky, L. & Zhuang, J. (2019). A meta-analysis of L2 pragmatics instruction. En Taguchi (ed.), *Routledge Handbook of SLA and Pragmatics*.
- Suzuki, Y., Maie, R. & Hui, B. (2025). Research timeline: Automatization in second language learning. *Language Teaching*.
- Taguchi, N. (2015). Instructed pragmatics at a glance. *Language Teaching*, 48(1).
- Yanagisawa, A., Webb, S. & Uchihara, T. (2020). How do different forms of glossing contribute to L2 vocabulary learning from reading? A meta-regression analysis. *Studies in Second Language Acquisition*, 42(2), 411–438.
- L2 reading fluency progression using timed reading and repeated oral reading (2018). *Reading in a Foreign Language*, 30(1).

Fuentes consultadas: [Brunmair & Richter 2019](https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf) ·
[Bisra et al. 2018](https://link.springer.com/article/10.1007/s10648-018-9434-x) ·
[Yanagisawa et al. 2020](https://eric.ed.gov/?id=EJ1251024) ·
[Lectura cronometrada (RFL 2018)](https://eric.ed.gov/?id=EJ1176224) ·
[Jeon & Day 2016](https://files.eric.ed.gov/fulltext/EJ1117026.pdf) ·
[Kurokawa et al. 2025](https://onlinelibrary.wiley.com/doi/10.1111/lang.12697) ·
[Montero Perez et al. 2013](https://www.sciencedirect.com/science/article/abs/pii/S0346251X13001012) ·
[Suzuki, Maie & Hui 2025](https://www.academia.edu/130123550/) ·
[Loewen et al. 2019](https://www.cambridge.org/core/journals/recall/article/abs/mobileassisted-language-learning-a-duolingo-case-study/A4D7C8F71782A37D258C19F357DDBCBE) ·
[Taguchi 2015](https://www.researchgate.net/publication/270899654_Instructed_pragmatics_at_a_glance_Where_instructional_studies_were_are_and_should_be_going) ·
[Fan et al. 2024](https://arxiv.org/pdf/2412.09315) ·
[Lingua Libre](https://en.wikipedia.org/wiki/Lingua_Libre) ·
[Lingua Libre en italiano (Commons)](https://commons.wikimedia.org/wiki/Category:Italian_pronunciation)
