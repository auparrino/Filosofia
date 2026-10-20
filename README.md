# Ágora — la filosofía en 52 semanas

Un curso-juego para aprender filosofía desde el celular. Recorre la historia,
de los presocráticos a hoy, y las ramas: lógica, ética, epistemología,
metafísica, filosofía política, estética, del lenguaje y de la mente,
antropología filosófica y pensamiento argentino y latinoamericano.

Está hecho para hispanohablantes rioplatenses. Hoy hay una sola edición, en
castellano; después vienen el italiano, el portugués y el alemán, para
estudiar filosofía en la lengua que se está aprendiendo.

> **En construcción.** Por ahora están las tres primeras semanas: qué es la
> filosofía, los milesios y Pitágoras, y Heráclito, Parménides y los
> atomistas. El plan completo, con el temario y los pasos que faltan, está en
> [PLAN.md](PLAN.md).

## Cómo se juega

- **52 semanas en cuatro estaciones**, como una carrera de grado: la
  Antigüedad, del Medioevo a la Modernidad, de Kant al siglo XX y la
  filosofía de hoy. Hay un examen al final de cada estación y uno final en la
  semana 52.
- **Lecciones en pasos cortos**, con un chequeo en cada bloque. Cada semana
  trae ejercicios (¿quién lo dijo?, ¿de qué escuela es esta tesis?, ¿cuál es
  la conclusión?, la cita apócrifa como trampa) y los **conceptos de la
  semana**, cada uno con su definición, un ejemplo y una nota sobre con qué no
  confundirlo.
- **Toda cita lleva su fuente**: obra y pasaje, o el fragmento en la
  numeración de Diels-Kranz. Las que circulan sin estar en el autor se marcan
  como tales.
- Desde el curso de idiomas del que sale vienen también la racha, la meta
  diaria, el repaso espaciado (FSRS), la pausa de 3 minutos, el desafío del
  día, el modo oficina (🤫, nada suena solo) y la copia en un Gist.
- **La estética avanza con la historia.** La app cambia de colores, letra y
  ornamento según la época de la semana en que vas:

| Época | Semanas | Estética |
|---|---|---|
| El ágora | 1-13 | mármol, terracota, figuras negras, la greca |
| El scriptorium | 14-18 | pergamino, tinta, bermellón, lapislázuli y oro |
| El taller del Renacimiento | 19-26 | la sepia de los grabados, el verdín, Garamond |
| El salón | 27-33 | burdeos, azul de Prusia, Didot |
| La vanguardia | 34-45 | rojo, amarillo, azul y negro, letra de palo seco |
| La red | 46-52 | violeta y verde azulado |

Para ver las seis épocas sin avanzar en el curso, agregá `?era=1` a `?era=6`
a la URL.

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
