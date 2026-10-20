# Weg C1 — alemán desde cero (en construcción)

El tercer idioma de la app, para hispanohablantes rioplatenses. Se elige en
el selector del primer arranque o desde el perfil (*Ich*: «Cambiar a…»), y
guarda su propio progreso, racha, meta y repaso (`wegc1.save.v1`): cambiar
de idioma no toca el italiano ni el portugués.

Por ahora es un **arranque A1 de seis semanas**, con contenido escrito para el
curso (no sale de un manual), siguiendo el MCER y los temas del
*Goethe-Zertifikat A1*:

1. **Hallo!** La pronunciación (w, v, z, ei, ie, sch, ch, ä ö ü ß), saludar, deletrear, *du* y *Sie*.
2. **Ich bin…** *sein*, *heißen*, *kommen aus*, las preguntas W, el verbo en segundo lugar.
3. **Der, die, das.** Los tres géneros, *ein / eine*, *kein*, plurales, sustantivos con mayúscula.
4. **Ich habe, ich möchte.** El presente, *haben*, el acusativo (*den / einen*), *nicht* y *kein*.
5. **Zahlen und Einkaufen.** 0-100 (*einundzwanzig*), precios, *Ich hätte gern…*.
6. **Mein Tag.** Verbos que cambian la vocal (*fährt, isst*), días y horas (*halb neun* = 8:30), la rutina.

## Qué tiene y qué no

**Tiene**: el camino (*Weg*) con lecciones en pasos cortos y sus chequeos, el
entrenamiento y la *Dominala* de cada semana, las palabras de la semana, la
pausa (*Kaffeepause*), el desafío del día, el repaso con FSRS y la palabra del
día. La voz es la del teléfono en alemán (`de-DE`). Los ejercicios escritos
usan el teclado de la app en QWERTZ, con *ä ö ü ß* (o el del teléfono, con una
fila de *ä ö ü ß*). La corrección no mira mayúsculas, y marca como *casi* lo
que solo pierde la diéresis o escribe *ss* en vez de *ß*.

**Todavía no tiene** (el paquete los declara en `missing`, en `docs/js/boot.js`,
y el núcleo anda sin ellos): conjugador y gimnasio de verbos, diagnóstico de
errores por categoría, escritura libre (*Scrivi*) y la IA, frases de
conversación, lecturas, radio, sonidos, dictogloss, duelos, banco, Biblioteca,
el tramo C1 y el examen.

## Dónde está

| Qué | Dónde |
|---|---|
| El contenido (lecciones, ejercicios, palabras) | `tools/de/curso.py` (Python legible) |
| El curso compilado | `docs/lang/de/data/course.json` (lo arma `tools/de/build_course.py`) |
| La configuración, la interfaz y las reglas | `docs/lang/de/lang.js`, `docs/lang/de/rules.js` |
| El tema (Berlín) | `docs/lang/de/theme.css` |
| Los tests | `tools/de/test_curso.js` (en `npm test`), `tools/lib/smoke_aleman.js` (en el navegador), `npm run sim` |

Lo ideal es que un hablante nativo revise el contenido. Los puntos dudosos
que dejó anotados quien lo escribió:
- **Las letras y su sonido:** cómo se nombran algunas letras (*Ypsilon*, *Eszett*) y cómo se aproxima su pronunciación con letras del castellano.
- **La *s* delante de vocal:** se presenta como sonora, como en el norte (en el sur y en Austria suena sorda).
- **Los saludos según la hora:** desde qué hora se dice *Guten Abend*.
- **Frases hechas antes de su gramática:** algunas aparecen antes de que se enseñe la regla (*aus der Schweiz*, *im Café*, *nach Hause*).
- **Respuestas aceptadas:** algunas que se dan por buenas en traducciones, como *Ich habe keine Brüder* para «no tengo hermanos».
