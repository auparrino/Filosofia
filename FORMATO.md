# ¿Sirve el formato de La Via para aprender filosofía?

> **Nota (v0.3.0).** Esta investigación llevó al formato híbrido del
> curso-juego. Después el dueño cambió de rumbo: Ágora es ahora una app de
> lectura, sin preguntas ni ejercicios (ver [PLAN.md](PLAN.md), §7). Queda
> como antecedente.

Este documento resume una investigación de octubre de 2026 sobre qué formato
conviene para una app de filosofía autodidacta. La pregunta era si el motor
de La Via (lecciones en pasos, opción múltiple, repaso espaciado, racha, xp,
misiones) sirve o si hay formatos mejores. La decisión está pendiente (ver
el final).

## En corto

El formato de curso-juego sirve para **una parte** de la filosofía:

- los conceptos y las distinciones;
- quién dijo qué y dentro de qué corriente;
- la estructura de los argumentos clásicos.

No sirve para **la parte central**: reconstruir un argumento, objetarlo y
escribir una posición propia. La mejor evidencia sobre pensamiento crítico
apunta a otras tres cosas:

- **práctica guiada con devolución** (mapas de argumentos);
- **diálogo**;
- **problemas auténticos**.

Las preguntas cerradas con xp no están en esa lista.

## La evidencia

**Sólida** (metaanálisis o ensayos grandes):

- **Enseñar pensamiento crítico funciona, con efecto chico** (g ≈ 0,30).
  Lo que más rinde es combinar **diálogo**, **casos auténticos** y
  **mentoría o devolución**: así llega a g ≈ 0,57 (Abrami y otros, 2015,
  341 efectos).
- **La recuperación con preguntas de hechos no mejora las preguntas de
  orden superior.** Las de aplicación y análisis sí mejoran, y la mezcla anda
  bien en los dos tipos (Agarwal, 2019). Es el dato que más toca al diseño
  actual: las preguntas tienen que ser de aplicación («¿qué premisa ataca
  esta objeción?»), no solo «¿quién lo dijo?».
- **La gamificación tiene efectos chicos y positivos**, más firmes en lo
  cognitivo que en la motivación (Sailer y Homner, 2020).
- **Escribir para aprender tiene efecto chico** (≈ 0,2-0,3), mayor con
  consignas metacognitivas (Bangert-Drowns, 2004; Graham, 2020).
- **Las rachas sostienen el hábito, pero una racha rota lleva al
  abandono.** El efecto se atenúa si la racha se puede reparar (Silverman y
  Barasch, 2023).
- **Los MOOC se terminan poco**, y eso no mejoró en seis años (Reich y
  Ruipérez-Valiente, *Science*, 2019).
- **Philosophy for Children:** el ensayo grande de la EEF (2021, 198
  escuelas) no encontró impacto.

**Moderada:**

- **Mapas de argumentos.** Los cursos intensivos de mapeo dan ≈ 0,8 DE, más
  del doble que un curso estándar (van Gelder; Twardy, 2004). El mecanismo
  sería la práctica deliberada, graduada y con devolución. Advertencia: casi
  todo sale del mismo grupo de investigadores, y una de las cifras (Alvarez
  Ortiz, 2007) es de una tesis no publicada.
- **Tutores de IA:**
  - Uno que no da la respuesta y obliga a razonar duplicó la ganancia en
    física (Harvard, Kestin y otros, 2025).
  - GPT-4 sin límites empeoró el desempeño posterior en un 17 %; con límites
    (pistas en vez de respuestas), el daño se neutralizó (Bastani y otros,
    *PNAS*, 2025).
  - Khanmigo dio ganancias chicas y se usó poco.
  - No hay ensayos de tutores de IA en filosofía.
- **Repaso espaciado de material conceptual dentro de un texto** (Quantum
  Country, Matuschak y Nielsen): son notas, no ensayos, pero sugieren que
  funciona y que lo conceptual se olvida más lento.

**Sin estudios de resultados** (solo tradición o diseño):

- el tutorial de Oxford (un ensayo por semana, discutido con el tutor);
- el seminario de fuentes primarias de St. John's College;
- Kialo;
- los juegos de Baggini y Stangroom (*Battleground God*);
- los videojuegos filosóficos;
- *Fathom*, la única «app tipo Duolingo» de filosofía que apareció.

## Tres formatos y un híbrido

**A. Taller de argumentos.**
- **Cómo es:** diez minutos por día para reconstruir un argumento breve
  (premisas, conclusión, objeción, réplica) ordenando bloques, y compararlo
  con el mapa de un experto. Una vez por semana, un argumento «salvaje» (una
  columna, un fragmento), con la crítica de la IA.
- **Reutiliza:** las lecciones, el repaso (los mapas vuelven como «¿qué
  premisa falta?»), las misiones y la PWA.
- **Hay que hacer:** un mapa táctil por indentación y unos 50 a 100
  argumentos curados.
- **Costo:** medio.
- **Es lo mejor para** la habilidad analítica, que es lo que tiene la mejor
  evidencia.

**B. Seminario de lectura lenta.**
- **Cómo es:** un texto corto de dominio público por semana, en cinco
  tramos de 10 a 15 minutos. Después de cada tramo, una pregunta abierta y un
  diálogo con la IA configurada para **preguntar y señalar tensiones, no
  responder**. El domingo, una respuesta de unas 300 palabras.
- **Reutiliza:** el lector y la Biblioteca de La Via, la IA, las misiones y
  el repaso de conceptos.
- **Hay que hacer:** el prompt socrático con límites, el historial de
  diálogos y una versión sin IA (rúbrica de autoevaluación).
- **Costo:** medio en código, alto en curaduría.
- **Es lo mejor para** la comprensión profunda y el hábito de leer.
- **La literatura entra acá:** 65 de las 103 obras de
  `tools/curso/literatura.py` son de dominio público y se pueden leer enteras
  en la app.

**C. Dilemas y consistencia** (como *Battleground God* o Sandel).
- **Cómo es:** un caso (el tranvía, la máquina de experiencias, el barco de
  Teseo) en el que te comprometés con una posición. Semanas después, la app
  te muestra un caso que choca con lo que dijiste, y la IA te da la mejor
  objeción.
- **Reutiliza:** casi todo; acá la opción múltiple es legítima, porque no
  hay una respuesta correcta.
- **Hay que hacer:** un registro de tus posiciones y de los choques entre
  ellas.
- **Costo:** bajo a medio.
- **Es lo mejor para** el enganche y para conocer tus propias posiciones.
- **Evidencia de aprendizaje:** ninguna; es una apuesta de diseño.

**Híbrido (la recomendación de la investigación):**
- **Todos los días, de 5 a 8 minutos:** el motor actual con repaso espaciado
  de conceptos **y** preguntas de aplicación (encontrar la premisa, la
  falacia, la objeción que le pega a una tesis), más un dilema de vez en
  cuando.
- **Una vez por semana, de 60 a 90 minutos:** un texto en tramos (B), un mapa
  del argumento central (A) y un párrafo de posición propia con devolución
  socrática de la IA.
- **La literatura:** la obra de la semana, como lectura y como caso para
  discutir.
- **Las recompensas:** el xp premia lo que cuesta (mapas, escritos), no los
  toques, y la racha se puede reparar.
- **El orden para construirlo:**
  1. preguntas de aplicación y dilemas, que salen casi gratis;
  2. el lector con la pregunta abierta;
  3. el mapa de argumentos.

## Fuentes

- Abrami y otros, 2015: https://www.clearinghouse.edu.tum.de/wp-content/uploads/2023/12/CHU_KR18_ENG_Abrami_2015.pdf
- Huber y Kuncel, 2016: https://www.aera.net/Newsroom/Does-College-Teach-Critical-Thinking-A-Meta-Analysis
- Twardy, 2004: https://philarchive.org/rec/TWAAMI
- van Gelder: https://timvangelder.com/research
- Agarwal, 2019: https://www.learningscientists.org/blog/2019/6/27-1
- Sailer y Homner, 2020: https://link.springer.com/article/10.1007/s10648-019-09498-w
- Escribir para aprender: https://www.clearinghouse.edu.tum.de/wp-content/uploads/2023/08/CHU-KR-29_ENG_Graham-2020.pdf
- EEF, P4C: https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/philosophy-for-children-effectiveness-trial
- Rachas: https://www.colorado.edu/business/faculty-research/2023/04/19/or-track-how-broken-streaks-affect-consumer-decisions
- Mal uso de la gamificación en Duolingo: https://arxiv.org/abs/2203.16175
- MOOC: https://tsl.mit.edu/research/the-mooc-pivot/
- Tutor de IA, Harvard: https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/
- Bastani y otros, 2025: https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education
- Khanmigo: https://www.nber.org/papers/w35620
- Quantum Country: https://notes.andymatuschak.org/z5fqaiYdbfoGyKF4KU8MV7MFPFe467n2a5LAP
- Philosophy Experiments: https://philosophyexperiments.com/
- St. John's College: https://www.sjc.edu/academic-programs/undergraduate/classes/seminar
