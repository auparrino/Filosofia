# Plan: de La Via C1 a Ágora, un curso-juego de filosofía

## Estado

| Paso | Qué | Estado |
|---|---|---|
| 1 | Copiar la base (La Via C1 v3.11.4, sin historial) a `main` | hecho |
| 2 | Diagnóstico: qué es motor, qué es idioma, temario, ejercicios, modos | hecho (abajo) |
| 3 | Separar la app de La Via C1: prefijos, marca, íconos, la edición `es` con las semanas 1-3, las seis épocas; borrar los paquetes de idioma y sus tests | **hecho** (v0.1.0) |
| 4 | Limpiar el núcleo: sacar los módulos de idioma, renombrar los modos, malentendidos en lugar de errores de lengua | pendiente |
| 5 | Ejercicios nuevos: relacioná, tabla de verdad, experimento mental, premisa floja, la pregunta abierta con IA y su rúbrica | pendiente |
| 6 | Contenido `es`: semanas 4-13 y el examen de la Antigüedad; después las estaciones 2, 3 y 4 | pendiente (3 de 52 semanas) |
| 7 | Ediciones it y pt desde la misma fuente, con un test de paridad; después de | pendiente |
| 8 | Lecturas de fuentes y Biblioteca, diálogos a dos voces, «el mismo concepto en cuatro lenguas» | pendiente |
| — | La literatura de las 52 semanas (§7) | **hecho** (los datos; cómo se muestra depende del formato) |
| — | Investigar si el formato de La Via sirve ([FORMATO.md](FORMATO.md)) | **hecho**; falta decidir |

Decisiones ya tomadas:
- **La base** es `main` v3.11.4. La rama `ccr-f31ce70c-nyfpin` no existe, y
  la v1.55 era la rama por defecto, un mes más vieja.
- **El temario** sale de comparar los planes de estudio de las universidades
  (§3).
- **La estética avanza con la historia**, en seis épocas (§4).
- **Una sola fuente de contenido** para las cuatro ediciones.
- **La interfaz, en castellano** en todas las ediciones; lo que cambia es el
  contenido.
- **El nombre** es **Ágora**, provisorio: se cambia en `lang.js`, el
  `manifest`, `index.html` y `boot.js`.

## 1. Qué se hizo en el paso 3

- **Separada de La Via C1.** Las dos apps quedan en el mismo dominio
  (`auparrino.github.io`) y por eso comparten `localStorage` y cachés. Ahora
  todo lo de Ágora lleva el prefijo `agora`:
  - el guardado (`agora-es.save.v1`);
  - las claves (`agora.lang`, `agora.era`, `agora.kb2`,
    `agora.gist.token`);
  - las cachés del service worker (`agora-v0.1.0`, `agora-voci`), que ya no
    borran las `c1-…` de La Via;
  - las copias exportadas (`{app: "agora"}`).

  `boot.js` ya no abre el progreso de italiano. Lo controlan `test_curso.js`
  y `smoke_curso.js`. **Ya se puede activar GitHub Pages** (*Settings →
  Pages → main → /docs*).
- **Marca nueva.** El nombre es Ágora en el título, el `manifest` (nombre,
  descripción, colores y atajos), los metas, la tarjeta para compartir y el
  confetti. El ícono es la lechuza de Atenea en figuras negras sobre
  terracota, con una greca, en SVG y en PNG de 192, 512, maskable y
  apple-touch. Un chequeo (`check_curso.py`) falla si en lo que se ve queda
  «La Via», «C1», «italiano», «portugués» o «alemán».
- **La edición `es`.** Arranca como arrancó el alemán en La Via: `lang.js`,
  `rules.js`, `theme.css` y el curso, y `missing` con todo lo demás. Trae
  las semanas 1 a 3 (108 ejercicios y 36 conceptos, con todas las citas
  con su fuente):
  - ¿Qué es la filosofía?;
  - los milesios, Pitágoras y Jenófanes;
  - Heráclito, Parménides, Zenón y los atomistas.

  La corrección no cuenta las tildes (`grade.ignoreMarks`, una opción nueva
  del motor) y las respuestas se escriben con el teclado del teléfono.
- **Las épocas.** `data-era` en `<html>` sigue a la semana en que vas, y
  `?era=N` muestra cualquiera (§4).
- **Se borró lo del idioma:**
  - los paquetes `it`, `pt` y `de`;
  - sus herramientas y fuentes (los manuales, el banco, los lexicones, el
    tramo, la radio, la Biblioteca);
  - Tres lenguas;
  - las auditorías y los README de cada idioma;
  - el chequeo de enlaces.

  La app pasó de 43 MB a 2 MB. Todo eso sigue en `auparrino/It`.
- **Tests.**
  - `npm test` corre `check_curso.py`, `test_curso.js` (unos 2.000
    controles) y los tests del núcleo que no dependen de un idioma: versión,
    rutas, estado, racha, «2 minutos», huecos, IA, nube y plan.
  - `npm run sim` simula las tres semanas, y las domina todas.
  - `npm run smoke` recorre en Chromium Hoy, la lección, la ronda, la
    pausa, Yo, la copia en un Gist, las claves, las cachés y las seis épocas.
  - El lint no tiene errores.
  - **Se borraron 51 tests y chequeos de La Via** que probaban contenido de
    idioma:
    - 24 del italiano, el portugués y el alemán (12 + 11 + 1, entre tests y
      chequeos de contenido);
    - 27 de los comunes, entre ellos:
      - los del banco, el glosario, el conjugador, el diagnóstico, lecturas,
        radio, tramo, Biblioteca, «Fuera», trabajo y Tres lenguas;
      - los que probaban **módulos del núcleo sobre ese contenido**: reglas,
        «¿Por qué?», referencia, capas, «una más», lecciones, orden de las
        lecciones, ubicación y mapas, escritura guiada, corrección y
        devoluciones, errores.

    También se fue el chequeo semanal de enlaces de «Fuera de la app».

    Esos últimos se reescriben en el paso 4, cuando cada módulo tenga
    contenido de filosofía.

## 2. Diagnóstico: motor y contenido

### El motor, que se reutiliza

| Pieza | Dónde | Para filosofía |
|---|---|---|
| Arranque y paquetes | `docs/js/boot.js` | tal cual: los paquetes son ediciones |
| Motor | `docs/js/engine.js` | tal cual: estado, guardado, xp, niveles, racha, meta diaria, FSRS |
| Lecciones en pasos | `docs/js/lezione.js` | tal cual: un bloque es una idea, una tesis o un argumento |
| Rondas | `docs/js/drills.js` | tal cual: ronda, Dominala, jefe por destreza, repaso, pausa |
| Camino, misiones, estaciones | `docs/js/app.js`, `docs/js/capas.js` | tal cual |
| Hoy, plan del día, progreso | `docs/js/inicio.js`, `docs/js/plan.js`, `docs/js/progreso.js` | tal cual |
| La regla como ficha, «¿Por qué?» | `docs/js/reglas.js`, `docs/js/porque.js` | se adapta: «¿por qué es esta la respuesta?» lleva al bloque de la idea |
| Corrección y errores | `docs/js/errores.js` | el motor queda; las categorías pasan a ser malentendidos (abajo) |
| IA | `docs/js/ia.js` | tal cual: es la pieza central de las preguntas abiertas |
| Mi gramática → Mis ideas; «Consultar» → diccionario filosófico | `docs/js/referencia.js` | se adapta |
| Ubicación | `docs/js/ubicacion.js` | tal cual: «¿ya sabés algo de filosofía?» |
| Lecturas y Biblioteca | `docs/js/letture.js`, `docs/js/biblioteca.js` | se adaptan: fragmentos de fuentes primarias y obras de dominio público (Platón, Descartes, Hume, Kant, Mill y Nietzsche están en los cuatro idiomas) |
| Escritura guiada, Tres vueltas, Reformulación | `docs/js/escritos.js`, `docs/js/escritura_plus.js` | se adaptan: el argumento escrito tres veces, la objeción |
| Ordená el texto | `docs/js/ordenar.js` | la base para reconstruir argumentos y armar líneas de tiempo |
| Duelos | `docs/js/duelli.js` | duelo de escuelas |
| Modo oficina, PWA, copia en la nube, calendario | `docs/sw.js`, `docs/js/nube.js`, `docs/js/app.js` | tal cual |
| Herramientas | `tools/lib/pack.js`, `tools/lib/sim_carriera.js`, `tools/lib/smoke_curso.js` | tal cual |

**Lo que cambia de contenido, no de mecánica:**
- las categorías de error pasan a ser los **malentendidos**: el autor
  equivocado, la escuela vecina, la cita apócrifa, el anacronismo, validez
  contra verdad, el hombre de paja. El cuaderno es el «📓 Cuaderno de
  malentendidos»;
- las cuatro cuerdas pasan a ser **leer, argumentar, conceptos y rapidez**;
- la frase del día pasa a ser la **cita del día**;
- la palabra del día pasa a ser el **concepto del día**.

### Lo del idioma, que se saca

Ya se borraron los paquetes y las herramientas (paso 3). En el núcleo quedan
módulos que se cargan sin datos y se sacan en el paso 4:
- se borran: el conjugador y el gimnasio de verbos, los sonidos y las voces
  grabadas, el dictado, el dictogloss, el C-test, las variaciones, el
  desglose, los mapas de preposiciones, las fórmulas, la frecuencia, «Para
  el trabajo» y Tres lenguas;
- se adaptan: las frases (pasan a ser citas por autor), la radio (pasa a ser
  diálogos filosóficos a dos voces) y el tramo C1 (pasa a ser una fuente
  larga con un ensayo breve).

## 3. Temario: 52 semanas, según los planes de estudio

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

**Estación 1 · La Antigüedad** (nivel 1)

| # | Semana | Rama | |
|---|---|---|---|
| 1 | ¿Qué es la filosofía? Asombro, mito y logos, las ramas, premisas y conclusión | introducción, lógica | ✓ |
| 2 | Los milesios, Pitágoras y Jenófanes: el *arjé* | metafísica | ✓ |
| 3 | Heráclito, Parménides, Zenón y los atomistas: el devenir y el ser | metafísica, epistemología | ✓ |
| 4 | **Lógica I**: validez y verdad, deducción e inducción, *modus ponens* y *tollens* | lógica | |
| 5 | Los sofistas y Sócrates (*Apología*, *Eutifrón*): relativismo, *élenchos* | ética | |
| 6 | Platón I (*Menón*, *Fedón*): las Ideas, la reminiscencia, el alma | epistemología, metafísica | |
| 7 | Platón II (*República*): la justicia, la línea y la caverna, el filósofo-rey | filosofía política | |
| 8 | Aristóteles I (*Categorías*, *Metafísica*): sustancia, cuatro causas, acto y potencia | metafísica | |
| 9 | **Lógica II**: el silogismo y las falacias | lógica | |
| 10 | Aristóteles II (*Ética a Nicómaco*): *eudaimonía*, virtud, prudencia | ética | |
| 11 | **Estética I**: *mímesis* y catarsis (*República* X contra la *Poética*) | estética | |
| 12 | Los helenísticos: estoicos, epicúreos y escépticos (Sexto Empírico) | ética, epistemología | |
| 13 | 🏛️ **Examen de la Antigüedad** | — | |

**Estación 2 · Del Medioevo a la Modernidad** (nivel 2)

| # | Semana | Rama |
|---|---|---|
| 14 | Plotino y Agustín: lo Uno, el mal, el tiempo, el maestro interior | antropología filosófica, metafísica |
| 15 | Boecio, Anselmo (el argumento ontológico) y Abelardo (los universales) | filosofía de la religión, del lenguaje |
| 16 | Avicena, Averroes y Maimónides: fe y razón, esencia y existencia | metafísica, filosofía de la religión |
| 17 | Tomás de Aquino: las cinco vías, la ley natural, el alma | metafísica, ética |
| 18 | Escoto y Ockham: univocidad, nominalismo, la navaja | filosofía del lenguaje, metafísica |
| 19 | Renacimiento y ciencia nueva: Pico, Galileo, Bacon; Las Casas contra Sepúlveda | antropología filosófica, filosofía de la ciencia |
| 20 | **Política I**: Maquiavelo y Hobbes | filosofía política |
| 21 | Descartes: la duda, el *cogito*, el dualismo | epistemología |
| 22 | Spinoza y Leibniz: sustancia, mónadas, necesidad | metafísica |
| 23 | Locke y Berkeley: ideas, cualidades, inmaterialismo | epistemología |
| 24 | Hume: causalidad, inducción, el yo, el «es» y el «debe» | epistemología, ética |
| 25 | **Política II**: Locke, Montesquieu y Rousseau | filosofía política |
| 26 | 📜 **Examen del Medioevo y la Modernidad** | — |

**Estación 3 · De Kant al siglo XX** (nivel 3)

| # | Semana | Rama |
|---|---|---|
| 27 | Kant I (*Crítica de la razón pura*): el giro copernicano, los juicios sintéticos *a priori* | epistemología, metafísica |
| 28 | Kant II (*Fundamentación*, «¿Qué es la Ilustración?»): el imperativo categórico | ética |
| 29 | El idealismo alemán y Hegel: dialéctica, amo y esclavo, la historia | filosofía de la historia |
| 30 | Schopenhauer y Kierkegaard: la voluntad, el arte, la angustia, los estadios | antropología filosófica |
| 31 | **Ética III**: el utilitarismo de Bentham y Mill | ética |
| 32 | Marx: alienación, materialismo histórico, ideología | filosofía política, de la historia |
| 33 | Nietzsche: la genealogía de la moral, la muerte de Dios | ética, antropología filosófica |
| 34 | **Lógica III y lenguaje I**: Frege y Russell; lógica proposicional y cuantificadores | lógica, filosofía del lenguaje |
| 35 | El pragmatismo: Peirce, James, Dewey | epistemología |
| 36 | Wittgenstein I (*Tractatus*) y el Círculo de Viena | filosofía del lenguaje, de la ciencia |
| 37 | Husserl: intencionalidad y *epojé* | epistemología |
| 38 | Heidegger (*Ser y tiempo*): la pregunta por el ser, el *Dasein* | metafísica |
| 39 | ☕ **Examen de Kant al siglo XX** | — |

**Estación 4 · La filosofía de hoy** (nivel 4)

| # | Semana | Rama |
|---|---|---|
| 40 | Antropología filosófica y existencialismo: Scheler, Sartre, Beauvoir, Camus | antropología filosófica |
| 41 | **Lenguaje II y hermenéutica**: Wittgenstein II, Austin, Gadamer | filosofía del lenguaje, hermenéutica |
| 42 | Filosofía de la ciencia: Popper, Kuhn, Lakatos | filosofía de la ciencia |
| 43 | **Epistemología II**: Gettier, internismo y externismo, el escepticismo | epistemología |
| 44 | Filosofía de la mente: dualismo, identidad, funcionalismo, Nagel, la habitación china | filosofía de la mente |
| 45 | **Metafísica**: identidad personal, libre albedrío, modalidad | metafísica |
| 46 | La Escuela de Frankfurt, Foucault y Derrida | filosofía política |
| 47 | **Política III**: Rawls, Nozick, Arendt | filosofía política |
| 48 | Filosofía feminista: Beauvoir, Butler, Fraser, las epistemologías situadas | ética, filosofía política |
| 49 | Pensamiento argentino y latinoamericano: Alberdi, Korn, Astrada, Kusch, Roig, Zea y Salazar Bondy, Dussel | pensamiento argentino y latinoamericano |
| 50 | **Estética II**: Kant (*Crítica del juicio*), Hegel, Benjamin, Danto | estética |
| 51 | Ética aplicada (el tranvía, la bioética), técnica e IA, el sentido de la vida | ética |
| 52 | 🎓 **Examen final** (tres versiones) | — |

Los exámenes de estación son por destreza (`Drills.buildBoss` ya lo hace):
**comprensión** de un fragmento, **conceptos**, **argumentos**
(reconstruir y evaluar) y **contexto** (autor, escuela, época). Cada uno pide
su 55 %.

## 4. La estética, por época

`tools/curso/curso.py` (`ERAS`) define seis épocas. La app las pinta con
`data-era`, sin tipografías descargadas:

| Época | Semanas | Colores y letra | Filete y ornamento |
|---|---|---|---|
| 1 El ágora | 1-13 | mármol, terracota, figuras negras; Georgia | la greca |
| 2 El scriptorium | 14-18 | pergamino, tinta ferrogálica, bermellón, lapislázuli y oro; Palatino | las bandas de un códice, la capitular en rojo |
| 3 El taller del Renacimiento | 19-26 | sepia, verdín, ocre; Garamond | el rayado de un grabado |
| 4 El salón | 27-33 | crema, burdeos, azul de Prusia; Didot o Bodoni | bandas de salón |
| 5 La vanguardia | 34-45 | rojo, amarillo, azul y negro; palo seco | bloques de color, sin esquinas redondeadas |
| 6 La red | 46-52 | violeta y verde azulado; la letra del sistema | un degradé |

Cada época tiene su versión oscura. Se pueden mirar con `?era=1` a `?era=6`.

## 5. Ejercicios para filosofía

| Ejercicio | Ejemplo | Sale de | Estado |
|---|---|---|---|
| ¿Quién lo dijo? | «Lo mismo es pensar y ser» → Parménides | `choice` | en uso |
| ¿De qué escuela, de qué rama? | «¿Cómo sé que no estoy soñando?» → epistemología | `choice` | en uso |
| ¿Cuál es la conclusión? | separar premisas y conclusión | `choice` | en uso |
| ¿Mito o logos?, ¿Heráclito o Parménides? | dos opciones | `choice` | en uso |
| La trampa | *panta rhei* no está en Heráclito | `choice` con nota | en uso |
| Completá el concepto | «el *___* de Anaximandro» → ápeiron | `cloze` | en uso |
| Escribí el término | *dóxa* | `typed` | en uso |
| ¿Es válido?, detectá la falacia | afirmación del consecuente, hombre de paja | `choice` | semanas 4 y 9 |
| La premisa floja | tocá la premisa falsa | `fixerr` adaptado | paso 5 |
| Reconstruí el argumento, línea de tiempo | ordenar premisas o autores | `ordenar.js` | paso 5 |
| Relacioná | 4 conceptos con 4 escuelas | renderer nuevo | paso 5 |
| Tabla de verdad | *p → q* | renderer nuevo | paso 5 (semanas 4 y 34) |
| Experimento mental | el tranvía, el velo de Rawls: sin respuesta correcta, con la objeción | renderer nuevo | paso 5 |
| Lectura de fuente | un fragmento con preguntas | `letture.js` | paso 8 |
| Pregunta abierta con IA | «¿Por qué Hume duda de la causalidad?», con rúbrica (tesis, razones, conceptos, objeción) | Scrivi + `errores.js` + `ia.js` | paso 5 |
| Diálogo socrático con IA | la IA hace de Sócrates | el role-play (Parla) | paso 5 |

## 6. Los modos

| Modo de La Via | En Ágora | Estado |
|---|---|---|
| ☕ Pausa caffè | ☕ **Pausa**: 3 minutos con lo de tu semana | anda |
| 🎯 Sfida del giorno | 🎯 **Desafío del día**: 6 preguntas a doble xp | anda |
| 🔁 Repaso, repaso de 2 min, «2 minutos», Dominala | tal cual | anda |
| ⚡ Lampo 60″ | ⚡ **¿Quién lo dijo? 60″**: citas contra reloj | nombre listo; las citas, en el paso 4 |
| 🧠 Parola o no? | 🧠 **¿Lo dijo o no?**: citas reales y apócrifas | nombre listo; las citas, en el paso 4 |
| 🩺 Clínica y cuaderno de errores | 🩺 **Clínica** y 📓 **Cuaderno de malentendidos** | paso 4 |
| Frase / palabra del día | **Cita** / **concepto del día** | el concepto del día anda |
| Escenas y frases, Parla | **Citas** por autor y **diálogo socrático** | paso 5 |
| ⚔️ Duelos | ⚔️ **Duelo de escuelas** | paso 5 |
| ✍️ Scrivi, Tres vueltas, Reformulación | ✍️ **Argumentá** | paso 5 |
| 📖 Leggi, Biblioteca, Radio, Tramo | 📖 **Leer**: fuentes, obras enteras, diálogos, ensayo | paso 8 |
| Ubicación, jefes, examen C1 | **¿Ya sabés filosofía?**, exámenes de estación, examen final | paso 6 |
| 🤫 Modo oficina, plan del día, progreso, racha, meta, copia, nube, calendario | tal cual | anda |
| Gimnasio de verbos, sonidos, dictado, dictogloss, C-test, variaciones, desglose, mapas, fórmulas, frecuencia, trabajo, Tres lenguas | se eliminan | Tres lenguas ya está afuera; el resto, en el paso 4 |

## 7. La literatura de cada semana

Cada semana trae una o más obras de ficción que caen dentro de la corriente
o la ejemplifican: una novela, un cuento, un poema, una obra de teatro o un
diálogo. Cada una va con el porqué: qué idea muestra y en qué escena o
pasaje. Son **103 obras**, de las cuales **65 son de dominio público** (📖:
se pueden leer enteras en la app) y **21 son argentinas o
latinoamericanas** (🇦🇷). Borges aparece casi en cada estación.
- **Los datos:** `tools/curso/literatura.py`.
- **Qué controla `check_curso.py`:** que todas las semanas tengan obra,
  salvo las de examen, que cada una diga por qué está y que haya por lo menos
  15 obras argentinas o latinoamericanas.
- **Cómo se muestra:** depende del formato que se elija (ver
  [FORMATO.md](FORMATO.md)). Puede ser un bloque «En la literatura» en la
  lección, una lectura de la semana o un caso para discutir.

| # | Obras |
|---|---|
| 1 | Jostein Gaarder, *El mundo de Sofía*; Antoine de Saint-Exupéry, *El principito* |
| 2 | Hesíodo, *Teogonía* 📖; Ovidio, *Metamorfosis, libro XV* 📖 |
| 3 | Lucrecio, *De la naturaleza de las cosas* 📖; Hermann Hesse, *Siddhartha*; Jorge Luis Borges, *«La perpetua carrera de Aquiles y la tortuga» y «Avatares de la tortuga» (Discusión)* 🇦🇷 |
| 4 | Lewis Carroll, *«Lo que la tortuga le dijo a Aquiles»* 📖; Arthur Conan Doyle, *Estudio en escarlata* 📖 |
| 5 | Aristófanes, *Las nubes* 📖; Platón, *Apología de Sócrates* 📖 |
| 6 | William Wordsworth, *Oda: Indicios de inmortalidad* 📖; Platón, *Fedón (la muerte de Sócrates)* 📖 |
| 7 | José Saramago, *La caverna*; Aldous Huxley, *Un mundo feliz* |
| 8 | Jorge Luis Borges, *«El idioma analítico de John Wilkins» (Otras inquisiciones)* 🇦🇷; Mary Shelley, *Frankenstein* 📖 |
| 9 | Lewis Carroll, *Alicia en el país de las maravillas* 📖; Jonathan Swift, *Una modesta proposición* 📖 |
| 10 | Homero, *Ilíada* 📖; Jane Austen, *Orgullo y prejuicio* 📖 |
| 11 | Sófocles, *Edipo rey* 📖; Umberto Eco, *El nombre de la rosa* |
| 12 | Marguerite Yourcenar, *Memorias de Adriano*; Séneca, *Fedra* 📖 |
| 13 | *(examen: repasa las obras de la estación)* |
| 14 | Agustín de Hipona, *Confesiones* 📖; Dante Alighieri, *Divina comedia, Paraíso* 📖 |
| 15 | Boecio, *La consolación de la filosofía* 📖; Abelardo y Eloísa, *Cartas* 📖 |
| 16 | Jorge Luis Borges, *«La busca de Averroes» (El Aleph)* 🇦🇷; Las mil y una noches, *(anónimo; versión de Galland)* 📖 |
| 17 | Dante Alighieri, *Divina comedia, Paraíso, cantos X-XIII* 📖 |
| 18 | Umberto Eco, *El nombre de la rosa*; Jorge Luis Borges, *«Funes el memorioso» (Ficciones)* 🇦🇷 |
| 19 | Tomás Moro, *Utopía* 📖; William Shakespeare, *La tempestad* 📖; Bertolt Brecht, *Vida de Galileo* |
| 20 | Nicolás Maquiavelo, *La mandrágora* 📖; William Golding, *El señor de las moscas* |
| 21 | Pedro Calderón de la Barca, *La vida es sueño* 📖; Jorge Luis Borges, *«Las ruinas circulares» (Ficciones)* 🇦🇷 |
| 22 | Voltaire, *Cándido o el optimismo* 📖; Jorge Luis Borges, *«Spinoza» y «Baruch Spinoza» (poemas)* 🇦🇷 |
| 23 | Jorge Luis Borges, *«Tlön, Uqbar, Orbis Tertius» (Ficciones)* 🇦🇷; Laurence Sterne, *Tristram Shandy* 📖 |
| 24 | Luigi Pirandello, *Uno, ninguno y cien mil* 📖; Jorge Luis Borges, *«Nueva refutación del tiempo» (Otras inquisiciones)* 🇦🇷 |
| 25 | Montesquieu, *Cartas persas* 📖; Daniel Defoe, *Robinson Crusoe* 📖; Jean-Jacques Rousseau, *Emilio* 📖 |
| 26 | *(examen: repasa las obras de la estación)* |
| 27 | Heinrich von Kleist, *Carta a Wilhelmine von Zenge (22 de marzo de 1801) y «Sobre el teatro de marionetas»* 📖; Thomas De Quincey, *Los últimos días de Immanuel Kant* 📖 |
| 28 | Heinrich von Kleist, *Michael Kohlhaas* 📖; Mark Twain, *Las aventuras de Huckleberry Finn* 📖 |
| 29 | Sófocles, *Antígona* 📖; Johann Wolfgang von Goethe, *Fausto* 📖 |
| 30 | Thomas Mann, *Los Buddenbrook* 📖; Søren Kierkegaard, *Diario de un seductor (en O lo uno o lo otro)* 📖 |
| 31 | Charles Dickens, *Tiempos difíciles* 📖; Fiódor Dostoievski, *Los hermanos Karamázov (la rebelión de Iván, libro V)* 📖 |
| 32 | Émile Zola, *Germinal* 📖; Roberto Arlt, *Los siete locos* 📖 🇦🇷 |
| 33 | Fiódor Dostoievski, *Crimen y castigo* 📖; Hermann Hesse, *Demian* |
| 34 | Lewis Carroll, *A través del espejo, cap. VII* 📖; Lewis Carroll, *A través del espejo, cap. VI (Humpty Dumpty)* 📖 |
| 35 | Ursula K. Le Guin, *«Los que se alejan de Omelas»*; Henry James, *Otra vuelta de tuerca* 📖 |
| 36 | Hugo von Hofmannsthal, *Carta de Lord Chandos* 📖; Robert Musil, *Las tribulaciones del estudiante Törless* 📖 |
| 37 | Marcel Proust, *Por el camino de Swann* 📖 |
| 38 | León Tolstói, *La muerte de Iván Ilich* 📖; Rainer Maria Rilke, *Elegías de Duino* 📖 |
| 39 | *(examen: repasa las obras de la estación)* |
| 40 | Albert Camus, *El extranjero*; Jean-Paul Sartre, *La náusea*; Ernesto Sabato, *El túnel* 🇦🇷 |
| 41 | Jorge Luis Borges, *«Pierre Menard, autor del Quijote» (Ficciones)* 🇦🇷; Julio Cortázar, *Historias de cronopios y de famas* 🇦🇷 |
| 42 | Stanisław Lem, *Solaris*; Jorge Luis Borges, *«Del rigor en la ciencia» (El hacedor)* 🇦🇷 |
| 43 | Ryūnosuke Akutagawa, *«En el bosque»* 📖; Adolfo Bioy Casares, *La invención de Morel* 🇦🇷 |
| 44 | Franz Kafka, *La metamorfosis* 📖; Philip K. Dick, *¿Sueñan los androides con ovejas eléctricas?* |
| 45 | Jorge Luis Borges, *«Borges y yo» (El hacedor) y «El otro» (El libro de arena)* 🇦🇷; Robert Louis Stevenson, *El extraño caso del doctor Jekyll y míster Hyde* 📖; Jorge Luis Borges, *«El jardín de senderos que se bifurcan» (Ficciones)* 🇦🇷 |
| 46 | Franz Kafka, *El proceso* 📖; George Orwell, *1984* 📖 |
| 47 | Ursula K. Le Guin, *Los desposeídos*; Primo Levi, *Si esto es un hombre* |
| 48 | Sor Juana Inés de la Cruz, *Respuesta a sor Filotea de la Cruz* 📖 🇦🇷; Virginia Woolf, *Un cuarto propio* 📖; Margaret Atwood, *El cuento de la criada* |
| 49 | Domingo Faustino Sarmiento, *Facundo* 📖 🇦🇷; José Hernández, *Martín Fierro* 📖 🇦🇷; Leopoldo Marechal, *Adán Buenosayres* 🇦🇷; Juan Rulfo, *Pedro Páramo* 🇦🇷 |
| 50 | Oscar Wilde, *El retrato de Dorian Gray* 📖; Thomas Mann, *La muerte en Venecia* 📖 |
| 51 | Mary Shelley, *Frankenstein* 📖; Kazuo Ishiguro, *Nunca me abandones*; Kazuo Ishiguro, *Klara y el sol* |
| 52 | *(examen: repasa las obras de la estación)* |

## Para decidir

0. **El formato.** La investigación ([FORMATO.md](FORMATO.md)) dice que el
   curso-juego sirve para los conceptos y la estructura de los argumentos,
   pero no para practicar filosofía: reconstruir, objetar y escribir.
   Recomienda un **híbrido**: el motor actual como práctica diaria de 5 a 8
   minutos, con preguntas de aplicación y dilemas, más una sesión semanal con
   un texto en tramos, un mapa del argumento y un párrafo propio con
   devolución socrática de la IA.

1. **La filosofía no occidental.** Ningún plan de estudio la tiene como
   obligatoria, por eso la investigación la sacó de las 52 semanas. Hay tres
   opciones:
   - dejarla como contenido opcional (una ficha extra en la estación 1:
     Confucio, Laozi, el budismo);
   - fundirla con la semana 51;
   - devolverle una semana propia y comprimir otra.
2. **El nombre.** ¿Queda «Ágora»?
