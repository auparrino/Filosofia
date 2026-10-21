# Plan: de La Via C1 a Ágora, una app para leer filosofía

## Estado

| Paso | Qué | Estado |
|---|---|---|
| 1 | Copiar la base (La Via C1 v3.11.4, sin historial) a `main` | hecho |
| 2 | Diagnóstico: qué es motor y qué es idioma | hecho (§6) |
| 3 | Separar la app de La Via C1: prefijos, marca, íconos, la edición `es`; borrar los paquetes de idioma | hecho (v0.1.0) |
| 4 | El temario: 117 semanas en 9 estaciones, comparado con los planes de estudio y con las tradiciones no occidentales | **hecho** (§2) |
| 5 | La literatura de cada semana | **hecho** (§4) |
| 6 | El formato: investigar ([FORMATO.md](FORMATO.md)) y elegir | **hecho**: el híbrido |
| 7 | El motor sin 52 semanas: un examen cada 13 y el final en la última | **hecho** |
| 8 | El seminario semanal, los dilemas y la tarjeta de literatura | **hecho** (hoy, dentro de la semana que se lee) |
| 9 | Ocho épocas en la estética | **hecho** (§3) |
| 10 | El contenido: 108 semanas de contenido (las 9 de repaso se arman solas) | **hecho**: 1748 conceptos (y 5691 ejercicios que quedan en la fuente); falta revisar a mano `REVISAR.md` |
| 11 | Limpiar el núcleo: sacar los módulos de idioma | **hecho** en parte (v0.2.0); el resto (renombrar los modos, los malentendidos) queda **descartado** por el paso 15 |
| 12 | Ejercicios nuevos: relacioná, tabla de verdad, la premisa floja | **descartado** (paso 15) |
| 15 | **El cambio de rumbo:** de curso-juego a app de lectura, sin preguntas: leer la semana de corrido y releer lo leído | **hecho** (v0.3.0, §7) |
| 13 | Ediciones it, pt y de desde la misma fuente, con un test de paridad | pendiente |
| 14 | Leer las obras de dominio público completas dentro de la app | pendiente |

El paso 15 se hizo antes que el 13 y el 14, que son los que siguen.

**Decisiones tomadas:**
- **La base** es `main` v3.11.4 de La Via C1.
- **El nombre** es Ágora.
- **El temario** sale de comparar los planes de estudio de las carreras de
  Filosofía, más las tradiciones no occidentales en su momento.
- **El formato** fue primero el híbrido (lo diario corto, con preguntas, y
  un seminario semanal con un tutor socrático). Desde la v0.3.0 es **de
  lectura**: el dueño pidió sacar todo lo que fueran preguntas y que la app
  explique conceptos y haga leer, no que ejercite como si fuese un idioma
  (§7).
- **La estética** avanza con la historia.
- **Una sola fuente de contenido** para las cuatro ediciones, y la interfaz
  en castellano.
- **La extensión** es la que haga falta: hoy son 117 semanas.

## 1. Cómo se escribe el contenido

Cada semana es un archivo `tools/curso/semanas/wNN.py`. Las reglas están en
[CONTENIDO.md](CONTENIDO.md), y `tools/curso/validar_semana.py NN` controla
cada semana. Una semana tiene lo que se lee:
- lo esencial: el foco y de 4 a 8 claves;
- una lección de al menos 9 bloques en 3 partes;
- al menos 12 conceptos;
- el seminario: de 3 a 6 tramos de texto con sus glosas, el mapa del
  argumento y el texto modelo («una lectura posible»);
- uno o más dilemas, que se leen como casos;
- su literatura.

Los ejercicios, los chequeos, las preguntas de los tramos, la consigna, la
rúbrica y las socráticas siguen en la fuente, pero ya no se piden ni se
muestran. Las semanas se escriben en paralelo, por estación. Cada una se
valida sola, y después `npm test` controla el curso entero. Lo que queda
por revisar a mano son las citas, las fechas y las referencias: los agentes
que escriben anotan las que no pudieron verificar, en `REVISAR.md`.

## 2. El temario: 117 semanas

**Fuentes.** Comparé las materias obligatorias de las carreras de grado en
Filosofía de 14 universidades:
- en Argentina, UBA (plan 2024), UNLP y UNC (texto ordenado 2011);
- Complutense de Madrid;
- en Italia, Bologna (L-5, 2026/27), Statale di Milano y Sapienza;
- USP;
- en Alemania, FU Berlin (B.A., 2022), LMU y Heidelberg;
- Oxford (PPE, primer año, 2026), Harvard y Brown.

Verifiqué el documento completo en 7 (UBA, UNC, Complutense, Bologna, USP,
FU Berlin y Oxford) y en otras 6 de forma parcial. Heidelberg no se pudo
verificar.

**Lo que tienen casi todos los planes:**
- la historia en cuatro períodos (antigua, medieval, moderna y
  contemporánea), cada uno con el mismo peso;
- lógica, ética, gnoseología, metafísica, filosofía de la ciencia y
  filosofía política;
- en Argentina, además, pensamiento argentino y latinoamericano;
- como optativas fuertes o semiobligatorias: filosofía del lenguaje,
  antropología filosófica, estética, filosofía de la historia y
  hermenéutica.

**Lo que cambió respecto del primer temario:**
- la filosofía medieval pasa de 2,5 a 5 semanas;
- la filosofía del lenguaje gana 2 semanas;
- aparecen la antropología filosófica, la hermenéutica (Gadamer) y la
  filosofía de la historia, que faltaban;
- la filosofía argentina va con nombres propios (Alberdi, Korn, Astrada,
  Kusch, Roig);
- la gnoseología queda marcada como rama;
- los presocráticos pasan de 3 a 2 semanas (semanas 2 y 3), y la semana 4 es
  lógica;
- Frankfurt y el posestructuralismo comparten una semana.

Lo que el primer temario tenía y los planes casi no (feminismo, ética
aplicada, técnica e IA) queda, más comprimido.

**Las fuentes por universidad:**
- UBA, plan 2024: https://filosofia.filo.uba.ar/sites/filosofia.filo.uba.ar/files/PE%20Licenciatura%20Filosof%C3%ADa%202024.pdf
- UNLP: https://unlp.edu.ar/wp-content/uploads/83/883/6d84448c88c21af050d6d9b33b1c27ec.pdf
- UNC: https://sitio.ffyh.unc.edu.ar/escueladefilosofia/wp-content/blogs.dir/101/files/sites/23/2023/12/RHCS_80_2011-TO-Lic-en-Filosofia.pdf
- Complutense: https://www.ucm.es/estudios/grado-filosofia-estudios-estructura
- Bologna: https://corsi.unibo.it/laurea/Filosofia/insegnamenti/piano/2026/6665/A86/000/2026
- USP: https://graduacao.fflch.usp.br/sites/graduacao.fflch.usp.br/files/inline-files/LEVANTA%20filosofia.pdf
- FU Berlin: https://www.fu-berlin.de/service/zuvdocs/amtsblatt/2022/ab212022.pdf
- Oxford: https://www.some.ox.ac.uk/wp-content/uploads/2026/08/Prelim-Philosophy-PPE-letter-2026.pdf

**Lo que sumó la segunda vuelta:**
- **La extensión:** las 52 semanas pasan a 117, en 9 estaciones.
- **Tradiciones no occidentales, cada una en su momento:**
  - la India antigua (5) y China antigua (6), junto a los presocráticos;
  - el islam (33-34) y el judaísmo medieval (35);
  - África (113) y Asia (114: Nagarjuna, el neoconfucianismo, la Escuela de
    Kioto, Gandhi).
- **Medioevo:** pasa de 5 a 12 semanas.
- **Autores con semana propia o compartida:** Pascal, los cínicos, el
  escepticismo antiguo, la Escuela de Salamanca y la conquista, Bergson y
  la antropología filosófica, Beauvoir, Arendt, Quine y Kripke, la
  filosofía de la religión contemporánea, la filosofía de la matemática.
- **Pensamiento latinoamericano y argentino:** el XIX en la semana 75 y dos
  semanas propias (111-112).


**Estación 1 · Grecia: del mito a Platón**

| # | Semana | Ramas |
|---|---|---|
| 1 | ¿Qué es la filosofía? | introducción, lógica |
| 2 | Los milesios, Pitágoras y Jenófanes | metafísica |
| 3 | Heráclito, Parménides, Zenón y los atomistas | metafísica, epistemología |
| 4 | Lógica I: validez, verdad y forma | lógica |
| 5 | La India antigua: Upanishads, Buda y Mahavira | metafísica, ética, antropología filosófica |
| 6 | China antigua: Confucio, Laozi, Mozi y Zhuangzi | ética, filosofía política, metafísica |
| 7 | Los sofistas | ética, epistemología, filosofía política |
| 8 | Sócrates | ética, lógica |
| 9 | Platón I: el alma y el conocimiento | epistemología, metafísica |
| 10 | Platón II: la justicia (República I-IV) | filosofía política, ética |
| 11 | Platón III: el filósofo y el Bien (República V-VII, Banquete) | metafísica, epistemología, filosofía política |
| 12 | Platón IV: el conocimiento y la crítica de las Ideas | epistemología, metafísica |
| 13 | 🎓 **Examen: Grecia, del mito a Platón** | — |

**Estación 2 · Aristóteles, helenísticos y Roma**

| # | Semana | Ramas |
|---|---|---|
| 14 | Aristóteles I: categorías y sustancia | metafísica, lógica |
| 15 | Aristóteles II: la naturaleza (Física) | metafísica, filosofía de la ciencia |
| 16 | Aristóteles III: el ser y el alma (Metafísica, Acerca del alma) | metafísica, antropología filosófica |
| 17 | Lógica II: el silogismo y las falacias | lógica |
| 18 | Aristóteles IV: la ética (Ética a Nicómaco) | ética |
| 19 | Aristóteles V: política, retórica y poética | filosofía política, estética |
| 20 | Cínicos y cirenaicos | ética |
| 21 | Epicuro y el epicureísmo | ética, metafísica |
| 22 | Los estoicos griegos: lógica, física y ética | ética, lógica, metafísica |
| 23 | El estoicismo en Roma | ética, filosofía política |
| 24 | Los escépticos | epistemología |
| 25 | Plotino y el neoplatonismo | metafísica, antropología filosófica |
| 26 | 🎓 **Examen: Aristóteles, helenísticos y Roma** | — |

**Estación 3 · El Medioevo**

| # | Semana | Ramas |
|---|---|---|
| 27 | Fe y razón: los primeros cristianos | filosofía de la religión, metafísica |
| 28 | Agustín I: el mal, la libertad y el tiempo | metafísica, ética, antropología filosófica |
| 29 | Agustín II: la verdad y la historia | epistemología, filosofía de la historia, filosofía política |
| 30 | Boecio, el Pseudo-Dionisio y Eriúgena | metafísica, filosofía de la religión |
| 31 | Anselmo y el argumento ontológico | filosofía de la religión, lógica |
| 32 | La querella de los universales | metafísica, filosofía del lenguaje |
| 33 | La filosofía en el islam I: al-Kindi, al-Farabi y Avicena | metafísica, filosofía de la religión, antropología filosófica |
| 34 | La filosofía en el islam II: al-Ghazali, Averroes e Ibn Jaldún | filosofía de la religión, metafísica, filosofía de la historia |
| 35 | La filosofía judía medieval: Saadia, Halevi y Maimónides | filosofía de la religión, metafísica |
| 36 | Tomás de Aquino I: fe, razón y las cinco vías | filosofía de la religión, metafísica |
| 37 | Tomás de Aquino II: el alma, la ley y la acción | ética, filosofía política, antropología filosófica |
| 38 | Duns Escoto, Ockham y el fin de la escolástica | metafísica, filosofía del lenguaje, epistemología |
| 39 | 🎓 **Examen: el Medioevo** | — |

**Estación 4 · Renacimiento y siglo XVII**

| # | Semana | Ramas |
|---|---|---|
| 40 | El humanismo renacentista | antropología filosófica, ética |
| 41 | Maquiavelo | filosofía política |
| 42 | La conquista y la Escuela de Salamanca | filosofía política, ética, pensamiento argentino y latinoamericano |
| 43 | Montaigne y el escepticismo renacentista | epistemología, ética, antropología filosófica |
| 44 | La revolución científica | filosofía de la ciencia, epistemología |
| 45 | Hobbes | filosofía política, metafísica |
| 46 | Descartes I: la duda y el cogito | epistemología |
| 47 | Descartes II: Dios, el mundo y el dualismo | metafísica, filosofía de la mente, filosofía de la religión |
| 48 | Pascal | filosofía de la religión, antropología filosófica, lógica |
| 49 | Spinoza I: Dios o la naturaleza | metafísica, filosofía de la religión |
| 50 | Spinoza II: los afectos, la libertad y la política | ética, filosofía política, antropología filosófica |
| 51 | Leibniz | metafísica, lógica, filosofía de la religión |
| 52 | 🎓 **Examen: Renacimiento y siglo XVII** | — |

**Estación 5 · La Ilustración**

| # | Semana | Ramas |
|---|---|---|
| 53 | Locke I: la experiencia | epistemología, metafísica |
| 54 | Locke II: el gobierno y la tolerancia | filosofía política |
| 55 | Berkeley | metafísica, epistemología |
| 56 | Hume I: la causalidad y la inducción | epistemología |
| 57 | Hume II: el yo, la religión y la moral | ética, metafísica, filosofía de la religión |
| 58 | La Ilustración francesa | filosofía política, metafísica, filosofía de la religión |
| 59 | Montesquieu y Rousseau I | filosofía política, antropología filosófica |
| 60 | Rousseau II y la Ilustración escocesa | filosofía política, ética |
| 61 | Los derechos y la revolución: Wollstonecraft, Burke y Paine | filosofía política, ética |
| 62 | Kant I: el giro copernicano | epistemología, metafísica |
| 63 | Kant II: los límites de la razón | epistemología, metafísica, filosofía de la religión |
| 64 | Kant III: la ética del deber | ética |
| 65 | 🎓 **Examen: la Ilustración** | — |

**Estación 6 · El siglo XIX**

| # | Semana | Ramas |
|---|---|---|
| 66 | Kant IV: lo bello, lo sublime y la paz | estética, filosofía política |
| 67 | El idealismo alemán y el romanticismo | metafísica, estética |
| 68 | Hegel I: la Fenomenología del espíritu | metafísica, epistemología, antropología filosófica |
| 69 | Hegel II: el Estado y la historia | filosofía de la historia, filosofía política, estética |
| 70 | Schopenhauer | metafísica, ética, estética |
| 71 | Kierkegaard | ética, filosofía de la religión, antropología filosófica |
| 72 | Feuerbach y Marx I: la alienación | filosofía política, antropología filosófica, filosofía de la religión |
| 73 | Marx II: la historia y el capital | filosofía política, filosofía de la historia |
| 74 | El utilitarismo: Bentham y Mill | ética, filosofía política |
| 75 | Positivismo, evolución y el siglo XIX latinoamericano | filosofía de la ciencia, pensamiento argentino y latinoamericano, filosofía de la historia |
| 76 | Nietzsche I: la tragedia y la verdad | estética, epistemología |
| 77 | Nietzsche II: la moral y la muerte de Dios | ética, antropología filosófica, filosofía de la religión |
| 78 | 🎓 **Examen: el siglo XIX** | — |

**Estación 7 · El siglo XX**

| # | Semana | Ramas |
|---|---|---|
| 79 | Frege y la lógica moderna | lógica, filosofía del lenguaje |
| 80 | Russell y Moore | lógica, filosofía del lenguaje, metafísica, ética |
| 81 | Wittgenstein I y el Círculo de Viena | filosofía del lenguaje, filosofía de la ciencia, lógica |
| 82 | El pragmatismo | epistemología, filosofía de la ciencia, filosofía de la religión |
| 83 | Husserl y la fenomenología | epistemología, metafísica |
| 84 | Heidegger | metafísica, antropología filosófica |
| 85 | Bergson y la antropología filosófica | antropología filosófica, metafísica |
| 86 | El existencialismo: Sartre, Camus y Merleau-Ponty | ética, antropología filosófica, metafísica |
| 87 | Simone de Beauvoir | ética, filosofía política, antropología filosófica |
| 88 | Wittgenstein II y el lenguaje ordinario | filosofía del lenguaje |
| 89 | La Escuela de Frankfurt y Habermas | filosofía política, estética, filosofía de la historia |
| 90 | La hermenéutica: Gadamer y Ricoeur | hermenéutica, filosofía del lenguaje, epistemología |
| 91 | 🎓 **Examen: el siglo XX** | — |

**Estación 8 · Hoy I: conocimiento, ciencia, mente y ser**

| # | Semana | Ramas |
|---|---|---|
| 92 | Popper | filosofía de la ciencia, filosofía política |
| 93 | Kuhn, Lakatos y Feyerabend | filosofía de la ciencia |
| 94 | Quine y Kripke: el lenguaje y la necesidad | filosofía del lenguaje, metafísica, epistemología |
| 95 | Epistemología contemporánea I: el conocimiento | epistemología |
| 96 | Epistemología contemporánea II: escepticismo, testimonio e injusticia | epistemología, ética |
| 97 | Filosofía de la mente I: ¿qué es la mente? | filosofía de la mente, metafísica |
| 98 | Filosofía de la mente II: la conciencia | filosofía de la mente |
| 99 | Metafísica contemporánea I: la identidad personal | metafísica, antropología filosófica |
| 100 | Metafísica contemporánea II: libertad, posibilidad y tiempo | metafísica, ética |
| 101 | Filosofía de la religión contemporánea | filosofía de la religión, epistemología |
| 102 | Filosofía de la matemática y lógicas no clásicas | lógica, metafísica, epistemología |
| 103 | Estética II: ¿qué es arte? | estética |
| 104 | 🎓 **Examen: hoy I** | — |

**Estación 9 · Hoy II: ética, política y otras tradiciones**

| # | Semana | Ramas |
|---|---|---|
| 105 | Metaética: ¿hay hechos morales? | ética, epistemología |
| 106 | Ética normativa hoy: el tranvía, las virtudes y el cuidado | ética |
| 107 | Justicia: Rawls, Nozick y sus críticos | filosofía política, ética |
| 108 | Hannah Arendt | filosofía política, ética |
| 109 | Foucault, Derrida y Deleuze | filosofía política, filosofía del lenguaje, epistemología |
| 110 | Feminismos y filosofía del género | ética, filosofía política, epistemología |
| 111 | Pensamiento latinoamericano I: identidad y liberación | pensamiento argentino y latinoamericano, filosofía política, filosofía de la historia |
| 112 | Pensamiento argentino | pensamiento argentino y latinoamericano, antropología filosófica, metafísica |
| 113 | Filosofía africana y de la diáspora | ética, antropología filosófica, filosofía política |
| 114 | Asia: el budismo madhyamaka, el neoconfucianismo y la Escuela de Kioto | metafísica, ética, antropología filosófica |
| 115 | Ética aplicada: la vida, los animales y la tierra | ética |
| 116 | La técnica, la IA y el sentido de la vida | ética, filosofía de la mente, antropología filosófica |
| 117 | 🎓 **Examen final** | — |

## 3. La estética, por época

`tools/curso/curso.py` (`ERAS`) define ocho épocas; la app las pinta con
`data-era` en claro y en oscuro, y `?era=N` las muestra todas:

| Época | Semanas | Colores, letra y ornamento |
|---|---|---|
| 1 El ágora | 1-19 | mármol, terracota, figuras negras; Georgia; la greca |
| 2 La stoa | 20-26 | travertino, pórfido, bronce; Optima; bandas imperiales |
| 3 El scriptorium | 27-39 | pergamino, tinta, bermellón, lapislázuli y oro; Palatino; la capitular en rojo |
| 4 El taller del Renacimiento | 40-52 | sepia, verdín, ocre; Garamond; el rayado de un grabado |
| 5 El salón | 53-66 | crema, burdeos, azul de Prusia; Didot |
| 6 La imprenta de vapor | 67-78 | papel de diario, hollín, bronce, el verde de las oficinas; Century o Rockwell; las columnas de un diario |
| 7 La vanguardia | 79-91 | rojo, amarillo, azul y negro; palo seco; sin esquinas redondeadas |
| 8 La red | 92-117 | violeta y verde azulado; la letra del sistema |

## 4. La literatura de cada semana

Son **590 entradas** (522 obras distintas, de 4 a 7 por semana) de ficción, teatro, poesía, diálogo o testimonio que caen
dentro de la corriente o la muestran, cada una con el porqué: **353 de
dominio público** (📖) y **144 argentinas o latinoamericanas** (🇦🇷). La
base está en `tools/curso/literatura.py` y las que se sumaron después, en `tools/curso/lit/`; la tabla de abajo es la base. Las
semanas de examen no traen obra nueva.
- **Los datos:** `tools/curso/literatura.py`.
- **En la app:** la tarjeta «📚 En la literatura» de cada semana.

| # | Obras |
|---|---|
| 1 | Jostein Gaarder, *El mundo de Sofía*; Antoine de Saint-Exupéry, *El principito* |
| 2 | Hesíodo, *Teogonía* 📖; Ovidio, *Metamorfosis, libro XV* 📖 |
| 3 | Lucrecio, *De la naturaleza de las cosas* 📖; Jorge Luis Borges, *«La perpetua carrera de Aquiles y la tortuga» y «Avatares de la tortuga» (Discusión)* 🇦🇷 |
| 4 | Lewis Carroll, *«Lo que la tortuga le dijo a Aquiles»* 📖; Arthur Conan Doyle, *Estudio en escarlata* 📖 |
| 5 | Hermann Hesse, *Siddhartha*; Milindapañha (anónimo), *Las preguntas del rey Milinda* 📖 |
| 6 | Ursula K. Le Guin, *La rueda celeste*; Bertolt Brecht, *«Leyenda del origen del libro Tao Te King durante el camino de Laozi a la emigración»* |
| 7 | Aristófanes, *Las nubes* 📖; Gorgias, *Encomio de Helena* 📖 |
| 8 | Platón, *Apología de Sócrates* 📖; Platón, *Critón* 📖 |
| 9 | William Wordsworth, *Oda: Indicios de inmortalidad* 📖; Platón, *Fedón (la muerte de Sócrates)* 📖 |
| 10 | Aldous Huxley, *Un mundo feliz*; H. G. Wells, *El hombre invisible* 📖 |
| 11 | José Saramago, *La caverna*; Platón, *Banquete* 📖 |
| 12 | Platón, *Timeo y Critias (la Atlántida)* 📖 |
| 14 | Jorge Luis Borges, *«El idioma analítico de John Wilkins» (Otras inquisiciones)* 🇦🇷 |
| 15 | Mary Shelley, *Frankenstein* 📖 |
| 16 | Ovidio, *Metamorfosis, libro X (Pigmalión)* 📖 |
| 17 | Lewis Carroll, *Alicia en el país de las maravillas* 📖; Jonathan Swift, *Una modesta proposición* 📖 |
| 18 | Homero, *Ilíada* 📖; Jane Austen, *Orgullo y prejuicio* 📖 |
| 19 | Sófocles, *Edipo rey* 📖; Umberto Eco, *El nombre de la rosa* |
| 20 | Diógenes Laercio, *Vidas de los filósofos ilustres, libro VI* 📖; Luciano de Samósata, *Diálogos de los muertos* 📖 |
| 21 | Horacio, *Odas I 11 («carpe diem»)* 📖; Lucrecio, *De la naturaleza de las cosas, libro III* 📖 |
| 22 | Cicerón, *El sueño de Escipión (República VI)* 📖 |
| 23 | Marguerite Yourcenar, *Memorias de Adriano*; Séneca, *Fedra* 📖 |
| 24 | Luciano de Samósata, *Hermótimo* 📖 |
| 25 | Jorge Luis Borges, *«Historia de la eternidad» (Historia de la eternidad)* 🇦🇷; Porfirio, *Vida de Plotino* 📖 |
| 27 | Evangelio de Juan, *Prólogo (1, 1-14)* 📖; Fiódor Dostoievski, *Los hermanos Karamázov, «El gran inquisidor» (libro V, cap. 5)* 📖 |
| 28 | Agustín de Hipona, *Confesiones* 📖 |
| 29 | Jorge Luis Borges, *«Los teólogos» (El Aleph)* 🇦🇷 |
| 30 | Boecio, *La consolación de la filosofía* 📖; Dante Alighieri, *Divina comedia, Paraíso* 📖 |
| 31 | Anselmo de Canterbury, *Proslogion, cap. 1 (la oración inicial)* 📖 |
| 32 | Abelardo y Eloísa, *Cartas* 📖; Jorge Luis Borges, *«Funes el memorioso» (Ficciones)* 🇦🇷 |
| 33 | Las mil y una noches, *(anónimo; versión de Galland)* 📖; Avicena, *Hayy ibn Yaqzan (El vivo, hijo del despierto)* 📖 |
| 34 | Jorge Luis Borges, *«La busca de Averroes» (El Aleph)* 🇦🇷; Ibn Tufail, *El filósofo autodidacta* 📖 |
| 35 | Yehudá Halevi, *El Cuzarí* 📖; Jorge Luis Borges, *«El Golem» (El otro, el mismo)* 🇦🇷 |
| 36 | Dante Alighieri, *Divina comedia, Paraíso, cantos X-XIII* 📖 |
| 37 | Dante Alighieri, *Divina comedia, Purgatorio, cantos XVII-XVIII* 📖 |
| 38 | Umberto Eco, *El nombre de la rosa* |
| 40 | Tomás Moro, *Utopía* 📖; Erasmo de Rotterdam, *Elogio de la locura* 📖 |
| 41 | Nicolás Maquiavelo, *La mandrágora* 📖 |
| 42 | William Shakespeare, *La tempestad* 📖; Bartolomé de las Casas, *Brevísima relación de la destrucción de las Indias* 📖 🇦🇷 |
| 43 | Miguel de Cervantes, *Don Quijote de la Mancha* 📖; William Shakespeare, *Hamlet* 📖 |
| 44 | Bertolt Brecht, *Vida de Galileo*; Johannes Kepler, *El sueño (Somnium)* 📖; Francis Bacon, *La nueva Atlántida* 📖 |
| 45 | William Golding, *El señor de las moscas* |
| 46 | Pedro Calderón de la Barca, *La vida es sueño* 📖; Jorge Luis Borges, *«Las ruinas circulares» (Ficciones)* 🇦🇷 |
| 47 | Auguste Villiers de l'Isle-Adam, *La Eva futura* 📖 |
| 48 | Jorge Luis Borges, *«La esfera de Pascal» (Otras inquisiciones)* 🇦🇷; Blaise Pascal, *Pensamientos* 📖 |
| 49 | Jorge Luis Borges, *«Spinoza» y «Baruch Spinoza» (poemas)* 🇦🇷 |
| 50 | Isaac Bashevis Singer, *«El Spinoza de la calle Market»* |
| 51 | Voltaire, *Cándido o el optimismo* 📖 |
| 53 | Laurence Sterne, *Tristram Shandy* 📖 |
| 54 | Daniel Defoe, *Robinson Crusoe* 📖 |
| 55 | Jorge Luis Borges, *«Tlön, Uqbar, Orbis Tertius» (Ficciones)* 🇦🇷 |
| 56 | Jorge Luis Borges, *«Nueva refutación del tiempo» (Otras inquisiciones)* 🇦🇷 |
| 57 | Luigi Pirandello, *Uno, ninguno y cien mil* 📖 |
| 58 | Denis Diderot, *Jacques el fatalista* 📖; Voltaire, *Micromegas* 📖 |
| 59 | Montesquieu, *Cartas persas* 📖; Voltaire, *El ingenuo* 📖 |
| 60 | Jean-Jacques Rousseau, *Emilio* 📖 |
| 61 | Mary Wollstonecraft, *María, o los agravios de la mujer* 📖; Olaudah Equiano, *La interesante narración de la vida de Olaudah Equiano* 📖 |
| 62 | Heinrich von Kleist, *Carta a Wilhelmine von Zenge (22 de marzo de 1801) y «Sobre el teatro de marionetas»* 📖; Thomas De Quincey, *Los últimos días de Immanuel Kant* 📖 |
| 63 | Jorge Luis Borges, *«El libro de arena» (El libro de arena)* 🇦🇷 |
| 64 | Heinrich von Kleist, *Michael Kohlhaas* 📖; Mark Twain, *Las aventuras de Huckleberry Finn* 📖 |
| 66 | Friedrich Schiller, *Cartas sobre la educación estética del hombre* 📖; Friedrich Hölderlin, *Hiperión* 📖 |
| 67 | Johann Wolfgang von Goethe, *Fausto* 📖; Novalis, *Enrique de Ofterdingen* 📖 |
| 68 | Sófocles, *Antígona* 📖 |
| 69 | León Tolstói, *Guerra y paz, epílogo, segunda parte* 📖 |
| 70 | Thomas Mann, *Los Buddenbrook* 📖 |
| 71 | Søren Kierkegaard, *Diario de un seductor (en O lo uno o lo otro)* 📖 |
| 72 | Herman Melville, *«Bartleby, el escribiente»* 📖 |
| 73 | Émile Zola, *Germinal* 📖; Roberto Arlt, *Los siete locos* 📖 🇦🇷 |
| 74 | Charles Dickens, *Tiempos difíciles* 📖; Fiódor Dostoievski, *Los hermanos Karamázov (la rebelión de Iván, libro V)* 📖 |
| 75 | Domingo Faustino Sarmiento, *Facundo* 📖 🇦🇷; H. G. Wells, *La máquina del tiempo* 📖 |
| 76 | Thomas Mann, *La muerte en Venecia* 📖 |
| 77 | Fiódor Dostoievski, *Crimen y castigo* 📖; Hermann Hesse, *Demian* |
| 79 | Lewis Carroll, *A través del espejo, cap. VI (Humpty Dumpty)* 📖 |
| 80 | Lewis Carroll, *A través del espejo, cap. VII* 📖 |
| 81 | Hugo von Hofmannsthal, *Carta de Lord Chandos* 📖; Robert Musil, *Las tribulaciones del estudiante Törless* 📖 |
| 82 | Ursula K. Le Guin, *«Los que se alejan de Omelas»*; Henry James, *Otra vuelta de tuerca* 📖 |
| 83 | Marcel Proust, *Por el camino de Swann* 📖 |
| 84 | León Tolstói, *La muerte de Iván Ilich* 📖; Rainer Maria Rilke, *Elegías de Duino* 📖 |
| 85 | Thomas Mann, *La montaña mágica* 📖; Franz Kafka, *«Informe para una academia»* 📖 |
| 86 | Albert Camus, *El extranjero*; Jean-Paul Sartre, *La náusea*; Ernesto Sabato, *El túnel* 🇦🇷 |
| 87 | Virginia Woolf, *Orlando* 📖 |
| 88 | Julio Cortázar, *Historias de cronopios y de famas* 🇦🇷 |
| 89 | Ray Bradbury, *Fahrenheit 451*; Aldous Huxley, *Un mundo feliz* |
| 90 | Jorge Luis Borges, *«Pierre Menard, autor del Quijote» (Ficciones)* 🇦🇷 |
| 92 | Jorge Luis Borges, *«Del rigor en la ciencia» (El hacedor)* 🇦🇷 |
| 93 | Stanisław Lem, *Solaris* |
| 94 | Italo Calvino, *Las ciudades invisibles* |
| 95 | Ryūnosuke Akutagawa, *«En el bosque»* 📖 |
| 96 | Adolfo Bioy Casares, *La invención de Morel* 🇦🇷 |
| 97 | Franz Kafka, *La metamorfosis* 📖 |
| 98 | Philip K. Dick, *¿Sueñan los androides con ovejas eléctricas?* |
| 99 | Jorge Luis Borges, *«Borges y yo» (El hacedor) y «El otro» (El libro de arena)* 🇦🇷; Robert Louis Stevenson, *El extraño caso del doctor Jekyll y míster Hyde* 📖 |
| 100 | Jorge Luis Borges, *«El jardín de senderos que se bifurcan» (Ficciones)* 🇦🇷 |
| 101 | Albert Camus, *La peste*; Jorge Luis Borges, *«Tres versiones de Judas» (Ficciones)* 🇦🇷 |
| 102 | Edwin A. Abbott, *Planilandia* 📖; Jorge Luis Borges, *«La biblioteca de Babel» (Ficciones)* 🇦🇷 |
| 103 | Oscar Wilde, *El retrato de Dorian Gray* 📖 |
| 105 | Herman Melville, *Billy Budd, marinero* 📖 |
| 106 | William Styron, *La decisión de Sophie* |
| 107 | Ursula K. Le Guin, *Los desposeídos* |
| 108 | Primo Levi, *Si esto es un hombre* |
| 109 | Franz Kafka, *El proceso* 📖; George Orwell, *1984* 📖 |
| 110 | Sor Juana Inés de la Cruz, *Respuesta a sor Filotea de la Cruz* 📖 🇦🇷; Virginia Woolf, *Un cuarto propio* 📖; Margaret Atwood, *El cuento de la criada* |
| 111 | José Martí, *Nuestra América* 📖 🇦🇷; José Enrique Rodó, *Ariel* 📖 🇦🇷 |
| 112 | José Hernández, *Martín Fierro* 📖 🇦🇷; Leopoldo Marechal, *Adán Buenosayres* 🇦🇷; Juan Rulfo, *Pedro Páramo* 🇦🇷 |
| 113 | Chinua Achebe, *Todo se desmorona* |
| 114 | Natsume Sōseki, *Kokoro* 📖; Rabindranath Tagore, *Gitanjali* 📖 |
| 115 | Kazuo Ishiguro, *Nunca me abandones*; Mary Shelley, *Frankenstein* 📖 |
| 116 | Kazuo Ishiguro, *Klara y el sol*; Douglas Adams, *Guía del autoestopista galáctico* |

## 5. El formato híbrido (hasta la v0.2.0)

> Reemplazado en la v0.3.0 por la app de lectura (§7). Queda como
> historia: así estaba hecho el curso-juego.

La investigación está en [FORMATO.md](FORMATO.md), y en la app quedó así:
- **Lo diario:** la lección, las rondas, el repaso espaciado y los
  conceptos, con preguntas de aplicación (al menos el 40 %%), la pausa y el
  desafío del día. Además, los **dilemas** (`seminario.js`): tomás
  posición, ves quién más la sostiene y la objeción, después una vuelta del
  caso, y «Tus posiciones» junta todo para mirar la consistencia.
- **Lo semanal:** el **seminario** (`seminario.js`, misión obligatoria de la
  semana):
  1. el texto en tramos, con glosas, chequeos y preguntas abiertas con lugar
     para anotar;
  2. el mapa del argumento: ordenar las premisas, la premisa implícita, la
     objeción y la réplica;
  3. el escrito, con la cuenta de palabras, la rúbrica para autoevaluarse,
     el tutor y el modelo.

  El **tutor socrático** es la IA con tu clave. Tiene límites estrictos: no
  da la respuesta, no reescribe el texto, no dice qué posición es la
  correcta, hace como mucho dos preguntas y señala una tensión. Esos límites
  vienen de la evidencia de Bastani y otros (2025). Sin clave, el tutor son
  las preguntas del curso.
- **Los exámenes de estación** se arman con los ejercicios de su estación y
  un bloque de repaso por semana. Tienen dos partes (para escribir y de
  opción múltiple), cada una con su mínimo.

## 6. Lo que quedaba de La Via C1 en el núcleo (hasta la v0.2.0)

> En la v0.3.0 el núcleo entero se reemplazó por el lector (§7): lo que
> sigue queda como historia.

**Primera parte, hecha (v0.2.0): los módulos de idioma, afuera.** Se
borraron del núcleo 17 módulos que solo servían para aprender un idioma y
no tenían datos en Ágora: frases, fórmulas, laboratorio, lecturas, mapas de
preposiciones, frecuencia, sonidos, voces, variaciones, C-test, desglose,
escritura plus, radio, tramo, «Fuera de la app», «Para el trabajo» y el
banco. Con ellos se fueron sus datos (que la edición ya no tenía: el
conjugador, el diagnóstico, el corrector de textos, la escucha, el
dictogloss, el examen C1, el glosario y la frecuencia) y todo lo que los
nombraba en `app.js`:
- las pantallas de la lectura, el relámpago, el dictogloss, el examen C1,
  el texto de la semana (Scrivi), la historia con IA y Parla (el role-play:
  vivía de los pedidos a la IA de Scrivi, que Ágora nunca tuvo);
- el gimnasio de verbos, las escenas de frases, las rondas del banco y la
  clínica, el mini diagnóstico después del test de ubicación;
- la corrección por diagnóstico del idioma y el juez de la IA de las
  respuestas no previstas (quedan «🙋 Mi respuesta es válida» y la nota);
- «🧐 ¿Qué tenía de malo?» de `porque.js`, que salía entero del diagnóstico.

Lo que queda y se simplificó: `drills.js` (sin conjugación ni banco),
`reglas.js` y `unamas.js` (la regla vuelve con otro ejercicio del curso),
`plan.js` (el día es repaso, misión y Biblioteca), `referencia.js` (el
diccionario de «Consultar» son los conceptos del curso), `escritos.js` (solo
«Ordená el texto», todavía sin textos) y `biblioteca.js` (sin glosario ni
frecuencias). También se borraron sus estilos y las medallas que ya no se
podían ganar.

**Falta, la segunda parte:**
- adaptar los que sí sirven: la Biblioteca para leer las obras 📖, el duelo
  como duelo de escuelas, Parla como diálogo socrático (rehecho sobre
  `IA.llm`, como el tutor del seminario);
- pasar las categorías de error a **malentendidos**: el autor equivocado, la
  escuela vecina, la cita apócrifa, el anacronismo, validez contra verdad,
  el hombre de paja.

Los tests de La Via que probaban esos módulos con contenido de idioma se
borraron en el paso 3, y se reescriben cuando cada módulo tenga contenido de
filosofía.

## 7. El cambio de rumbo: una app de lectura (v0.3.0)

El dueño pidió: «Sacá todo lo que sea preguntas. Que sea de lectura y
repaso de la lectura la app. Que se enfoque en explicar conceptos y leer, no
ejercitar como si fuese un idioma.» Se hizo así:

- **El núcleo del juego se borró** (el motor, las rondas, los ejercicios, el
  seminario con escrito y tutor, la IA, la nube, el teclado, la racha, las
  medallas, los exámenes) con sus tests y la simulación. La historia de git
  lo conserva. En su lugar hay un lector chico en JavaScript plano:
  `docs/js/nucleo.js` (el estado, la agenda, el buscador y la copia, sin
  pantalla) y `docs/js/lector.js` (las pantallas).
- **La semana se lee de corrido**, como un capítulo: lo esencial, la
  lección, el texto (con sus glosas como notas), el argumento, una lectura
  posible, los casos, los conceptos y la literatura, con un índice interno
  y la app recordando dónde quedaste. Las semanas 13, 26, …, 117 son el
  repaso de su estación.
- **El repaso es releer**, sin preguntas ni puntaje: al terminar una semana
  vuelven su resumen y cada concepto a +1, +7, +30 y +90 días, y después
  cada 180; hasta 20 por día, primero las más viejas.
- **El glosario** junta los 1748 conceptos, con un buscador que ignora
  tildes y mayúsculas.
- **Los datos** son solo lo que se lee: un índice chico
  (`docs/lang/es/data/course.json`, 38 KB) y un archivo por estación
  (`estacion-N.json`). Antes era un solo `course.json` de 8,2 MB; ahora son
  3,8 MB en total, y la primera carga baja solo el índice. El service
  worker guarda todo para leer sin internet.
- **Las ocho épocas** siguen (`docs/lang/es/theme.css`).
- **El contenido no se tocó**: los ejercicios siguen en `wNN.py` por si
  algún día vuelven, pero el build no los saca y los chequeos no los piden.
