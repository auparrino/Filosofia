# Ágora — la filosofía, de los presocráticos a hoy

Una app para **leer** filosofía desde el celular: **117 semanas en nueve
estaciones**, con toda la historia y todas las ramas, explicadas en
castellano rioplatense. No hay preguntas ni ejercicios: cada semana se lee
de corrido, como un capítulo, y después la app te trae de vuelta lo que
leíste para releerlo.

- **La historia:** de los presocráticos a hoy.
- **Las tradiciones no occidentales,** cada una en su momento: la India y
  China junto a los presocráticos, el islam y el judaísmo en el Medioevo,
  África y Asia hoy.
- **Las ramas:** lógica, ética, epistemología, metafísica, filosofía
  política, estética, filosofía del lenguaje, de la mente, de la ciencia, de
  la historia y de la religión, antropología filosófica, hermenéutica y
  pensamiento argentino y latinoamericano.

> **Las 117 semanas están escritas:** 108 semanas de lectura, 9 repasos de
> estación y 1748 conceptos. Las citas y fechas que hay que revisar a mano
> están en [REVISAR.md](REVISAR.md), y lo que sigue, en [PLAN.md](PLAN.md).

## Cómo se usa

**Inicio** te dice por dónde seguir leyendo (la semana y la sección donde
quedaste), cuántas tarjetas tenés para repasar hoy, en qué estación y época
vas, y cuántas de las 117 semanas leíste.

**El índice** tiene las nueve estaciones con sus semanas. Están todas
abiertas: conviene leerlas en orden, pero podés empezar por cualquiera.

**Una semana** se lee de arriba abajo, con un índice de secciones arriba
para saltar de una a otra. La app recuerda dónde quedaste.
1. **Lo esencial:** de qué se trata y sus claves.
2. **La lección,** en tres partes: las ideas, con citas, ejemplos y tablas,
   y un «Ojo» para lo que se suele confundir.
3. **El texto:** un pasaje de la obra de la semana (Platón, Aristóteles,
   Kant, Simone de Beauvoir…), en tramos, con notas para las palabras
   difíciles. Si el autor es de dominio público va en traducción propia; si
   no, contado en nuestras palabras, con citas breves.
4. **El argumento** del texto, paso a paso: las premisas, la que no se dice,
   la conclusión, la objeción y la réplica.
5. **Una lectura posible:** una manera de tomar posición frente al texto.
6. **Un caso:** un dilema sin respuesta correcta, con las posiciones
   posibles, quién las sostendría y qué tienen que responder.
7. **Los conceptos** de la semana, con qué no confundirlos.
8. **La literatura:** cuentos, novelas, poemas y obras de teatro donde
   aparecen esas ideas (Borges, Voltaire, Kafka, Sor Juana, el *Martín
   Fierro*, Pizarnik, Rulfo, Ishiguro…), con el porqué. Son 590 entradas.

Al final, **«Terminé de leer»** marca la semana como leída. Las semanas 13,
26, 39, … y 117 son el **repaso de la estación**: lo esencial de cada
semana, con su enlace.

**El repaso** es para releer, sin puntaje: el resumen de cada semana leída
y cada uno de sus conceptos vuelven al día siguiente, a la semana, al mes,
a los tres meses y después cada seis. Con «Releído» la tarjeta pasa a la
vuelta siguiente; con «Releer la semana» abrís la semana entera. Son como
mucho 20 por día, primero las más viejas.

**El glosario** junta los 1748 conceptos del curso, con un buscador al que
no le importan las tildes ni las mayúsculas, y cada uno te lleva a su
semana.

**Ajustes:** tema claro, oscuro o el del teléfono; cuatro tamaños de letra;
exportar el progreso a un archivo e importarlo (en este teléfono o en
otro), y borrarlo.

**La estética avanza con la historia.** La app cambia de colores, letra y
ornamento según la época de la semana que estás leyendo:

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

Para ver las ocho épocas, agregá a la URL un número del 1 al 8: `?era=1`,
`?era=2`, etc.

## En el celular

Es una app web instalable (PWA): después de abrirla una vez con internet,
se lee entera sin conexión, y guarda tu progreso en el teléfono.
- **En Android (Chrome):** abrí https://auparrino.github.io/Filosofia/ y
  tocá *Instalar app* (o, en el menú ⋮, *Agregar a la pantalla principal*).
- **En el iPhone (Safari):** abrila, tocá *Compartir* y *Agregar a
  inicio*.

Para cambiar de teléfono, exportá el progreso en Ajustes y en el otro
importá el archivo.

Para publicarla, en GitHub andá a *Settings → Pages → Deploy from a
branch*, elegí `main` y la carpeta `/docs`. Puede vivir en el mismo dominio
que La Via C1 (`auparrino.github.io`) sin tocarla: todo lo que guarda va con
el prefijo `agora` (`agora.lector.v1`) y sus cachés se llaman `agora-…`.

## Cómo está hecha

Es un sitio estático, sin dependencias: `docs/index.html`, un lector en
JavaScript plano (`docs/js/`), sus estilos (`docs/css/app.css`) y las ocho
épocas (`docs/lang/es/theme.css`). El contenido se escribe en Python
legible, una semana por archivo (`tools/curso/semanas/`), y el build lo
convierte en los datos de lectura (`docs/lang/es/data/`): un índice chico y
un archivo por estación. El temario está en `tools/curso/temario.py` y la
literatura, en `tools/curso/literatura.py`. El detalle está en
[ARQUITECTURA.md](ARQUITECTURA.md); para escribir contenido, en
[CONTENIDO.md](CONTENIDO.md). La investigación sobre el formato que tuvo
antes (un curso-juego) está en [FORMATO.md](FORMATO.md).

```sh
npm run build      # arma los datos de lectura (tools/curso → docs/lang/<edición>/data/)
npm test           # chequeos del contenido y de los datos, el lector, la versión y las rutas
npm run lint       # eslint sobre docs/ y tools/lib/
npm run smoke      # la app entera en Chromium, en un celular (necesita Playwright)
npm start          # http://localhost:8000
```
