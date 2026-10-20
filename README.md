# Ágora — la filosofía, de los presocráticos a hoy

Un curso-juego para aprender filosofía desde el celular: **117 semanas en
nueve estaciones**, con toda la historia y todas las ramas. Está hecho para
hispanohablantes rioplatenses. Hoy hay una sola edición, en castellano;
después vienen el italiano, el portugués y el alemán.

- **La historia:** de los presocráticos a hoy.
- **Las tradiciones no occidentales,** cada una en su momento: la India y
  China junto a los presocráticos, el islam y el judaísmo en el Medioevo,
  África y Asia hoy.
- **Las ramas:** lógica, ética, epistemología, metafísica, filosofía
  política, estética, filosofía del lenguaje, de la mente, de la ciencia, de
  la historia y de la religión, antropología filosófica, hermenéutica y
  pensamiento argentino y latinoamericano.

> **Las 117 semanas están escritas:** 5691 ejercicios, 1748 conceptos, un
> seminario y dos dilemas por semana. Las citas y fechas que hay que revisar
> a mano están en [REVISAR.md](REVISAR.md), y lo que sigue, en
> [PLAN.md](PLAN.md).

## Cómo se juega

El formato es **híbrido**. Sale de una investigación sobre cómo se aprende
filosofía, que está en [FORMATO.md](FORMATO.md).

**Todos los días, de 5 a 8 minutos.** Una lección en pasos cortos con
chequeos, y ejercicios: al menos el 40 % de cada semana es de
**aplicación**, y el resto de memoria. Hay de varios tipos:
- ¿cuál es la conclusión?, ¿qué premisa falta?;
- ¿qué ataca esta objeción?, ¿qué falacia es?;
- ¿qué diría este autor de un caso de hoy?;
- ¿quién lo dijo? (con la fuente);
- la cita apócrifa usada como trampa.

También están los **conceptos de la semana**, el repaso espaciado (FSRS), la
pausa de 3 minutos, el desafío del día y la racha. Y los **dilemas**: casos
sin respuesta correcta en los que tomás posición, ves quién más la sostiene
y qué objeción tiene que responder. «Tus posiciones» junta todo lo que
elegiste, para que mires si sos consistente.

**Una vez por semana, de 60 a 90 minutos: el seminario.** Se lee despacio
un texto de la semana, en tramos, con glosas y preguntas abiertas. Después
se arma el **mapa del argumento**: ordenar las premisas, la premisa
implícita, la objeción y la réplica. Al final se **escribe** una posición
propia, con una rúbrica y la devolución de un **tutor socrático**. El tutor
es la IA, con tu clave de Claude: te pregunta y te señala tensiones, pero no
te da la respuesta ni te reescribe el texto. Sin IA, hace de tutor el curso,
con sus propias preguntas.

**La literatura.** Cada semana trae ficción que cae dentro de la corriente o
la muestra, con el porqué: Borges, Voltaire, Kafka, Camus, Sor Juana, el
*Martín Fierro*, Pizarnik, Rulfo, Rumi, Ishiguro y muchos más. Son 590 entradas
(522 obras distintas), entre 4 y 7 por semana: 353 de dominio público y 144
argentinas o latinoamericanas, con poesía, teatro, cuento y novela.

**Los exámenes.** Hay uno al final de cada estación (las semanas 13, 26,
39, …) y el examen final en la 117.

**La estética avanza con la historia.** La app cambia de colores, letra y
ornamento según la época de la semana en que vas:

| Época | Semanas | Estética |
|---|---|---|
| El ágora | 1-19 | Grecia: mármol, terracota, figuras negras, la greca |
| La stoa | 20-26 | Roma y los helenísticos: travertino, pórfido, bronce |
| El scriptorium | 27-39 | el Medioevo: pergamino, tinta, bermellón, lapislázuli y oro |
| El taller del Renacimiento | 40-52 | la sepia de los grabados, el verdín, Garamond |
| El salón | 53-66 | la Ilustración: burdeos, azul de Prusia, Didot |
| La imprenta de vapor | 67-78 | el siglo XIX: papel de diario, hollín, bronce |
| La vanguardia | 79-91 | el siglo XX: rojo, amarillo, azul y negro, letra de palo seco |
| La red | 92-117 | hoy: violeta y verde azulado |

Para ver las ocho épocas sin avanzar en el curso, agregá a la URL un número
del 1 al 8: `?era=1`, `?era=2`, etc.

## En el celular

Es una app web instalable (PWA): funciona sin internet y guarda todo en el
teléfono. Para publicarla, en GitHub andá a *Settings → Pages → Deploy from a
branch*, elegí `main` y la carpeta `/docs`. Después abrí la URL una vez con
internet y agregala a la pantalla de inicio.

Puede vivir en el mismo dominio que La Via C1 (`auparrino.github.io`) sin
tocarla: todo lo que guarda va con el prefijo `agora`, en el guardado, en las
claves y en las cachés del service worker.

## Cómo está hecha

Es un sitio estático, sin dependencias. Hay un **núcleo** común (`docs/js/`)
que viene de La Via C1 v3.11.4, y un **paquete por edición**
(`docs/lang/es/`) con su configuración, sus reglas, su tema y el curso
compilado. El contenido se escribe en Python legible, una semana por archivo
(`tools/curso/semanas/`), y desde esa única fuente salen todas las ediciones.
El temario está en `tools/curso/temario.py` y la literatura, en
`tools/curso/literatura.py`.
El detalle está en [ARQUITECTURA.md](ARQUITECTURA.md); para escribir
contenido, en [CONTENIDO.md](CONTENIDO.md).

```sh
npm run build      # compila el curso (tools/curso → docs/lang/<edición>/data/course.json)
npm test           # chequeos del contenido, el curso jugado por el motor y los tests del núcleo
npm run lint       # eslint sobre docs/
npm run sim        # un año simulado (falla si una semana no se puede dominar)
npm run smoke      # la app entera en Chromium (necesita Playwright)
npm start          # http://localhost:8000
```
