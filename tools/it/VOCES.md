# Voces reales: paso a paso

## Lo que ya está hecho (v1.48)

**Lingua Libre en Suoni, desde el teléfono.** La app busca en Wikimedia
Commons la grabación real de cada palabra de los pares mínimos la primera
vez que aparece (`docs/js/voci.js`). Cada toque del 🔊 usa un hablante
distinto y muestra su nombre y la licencia (CC BY-SA 4.0), y el service
worker guarda el audio para usarlo sin conexión. En *Io* aparecen los
créditos de todas las voces usadas. Si una palabra no tiene grabación, no
hay internet la primera vez o es un par de vocal abierta/cerrada
(*pèsca/pésca*, que el nombre del archivo no distingue), suena la voz del
teléfono como antes. No hizo falta bajar nada al repositorio.

**Common Voice en Suoni (✓ hecho, v1.49).** Del paquete Common Voice
Italian 27.0 (bajado en la PC), `tools/it/voci_cv.py` eligió 446 oraciones por
votos, largo y semana. Muchas eran fichas de Wikipedia (condados, discos,
fútbol) o tenían la semana mal asignada, así que las revisé a mano: quedaron
**128** naturales, con la semana corregida, en `docs/lang/it/voci_cv_data.js`, y
sus audios en `docs/lang/it/audio/cv/` (5 MB; los otros 318 se sacaron del repo).
- **Dictado de Suoni**: dos de cada tres veces, una oración grabada.
- **«¿Qué forma escuchaste?»** (26 oraciones): el verbo en blanco y la
  forma que compite (*andassi / andavo*, *esca / esce*), una por sesión desde
  la semana de esa forma.
- Crédito en *Io* (CC0, no es obligatorio, pero se agradece).

**Para sumar más:** volver a correr `tools/it/voci_cv.py` sobre el paquete con
`--por-semana 40` (o más), revisar a mano y agregar las buenas a
`voci_cv_data.js`. Hay pocas oraciones en las semanas 1 a 4: ahí conviene
buscar a mano oraciones simples en `validated.tsv`.

Lo que falta: **Tatoeba** (caso 3), opcional.

## Cómo seguir en otra sesión (elegí un camino)

**Camino A: dar acceso a la red a la sesión en la nube.** Seguí «Antes que
nada», acá abajo, y en una sesión nueva decime «voces: caso 2».

**Camino B: una sesión que corra en tu PC.** Tu PC sí tiene internet sin
restricciones. Yo no puedo entrar a tu navegador desde la nube, pero una
sesión que corre en tu PC sí descarga con tu conexión:
1. Instalá la app **Claude** de escritorio (o Claude Code en la terminal) y
   abrí la carpeta del repositorio clonado en tu PC
   (`git clone https://github.com/auparrino/It`).
2. En la app de escritorio, abrí una sesión de Claude Code en esa carpeta.
   Desde la terminal también sirve: `claude remote-control` dentro de la
   carpeta, y la sesión aparece en la app de Claude Code, así la seguís
   desde el celular.
3. Pedile: «seguí tools/it/VOCES.md, caso 2 (Common Voice)». Para Common Voice
   igual vas a necesitar la cuenta de Mozilla Data Collective (paso 1 del
   caso 2), porque Mozilla exige aceptar sus términos para descargarlo.

---

## Antes que nada: dar acceso a la red (una vez, para todos los casos)

El entorno donde trabajo bloquea esos sitios. Para habilitarlos:

1. En la sesión de Claude Code, arriba, abrí el menú del **entorno** (el
   nombre del entorno en la barra de título) y tocá **Edit**.
2. En **Network access**, elegí un nivel más amplio o agregá a la lista de
   dominios permitidos los que correspondan:
   - Lingua Libre: `commons.wikimedia.org`, `upload.wikimedia.org`
   - Common Voice: `datacollective.mozillafoundation.org`, `commonvoice.mozilla.org`
     y el dominio de descarga que te dé el link (suele ser un almacenamiento
     en la nube; si falla, te digo cuál pide)
   - Tatoeba: `tatoeba.org`, `api.tatoeba.org`, `audio.tatoeba.org`
3. Guardá. Si la sesión no toma el cambio, abrí una sesión nueva.

Documentación: <https://code.claude.com/docs/en/claude-code-on-the-web>

---

## Caso 1 · Lingua Libre: los pares mínimos de Suoni (✓ hecho, desde el teléfono)

**Qué es.** Unas 11.900 grabaciones de **palabras sueltas** en italiano, de
varios hablantes, en Wikimedia Commons. Licencia **CC BY-SA 4.0**: se puede
usar gratis, pero hay que dar crédito a cada hablante.

**Para qué.** Las 190 palabras de los pares mínimos de Suoni (*pala/palla*,
*nono/nonno*, *pesca/pèsca*) con voces humanas y distintas: el entrenamiento
de sonidos (HVPT) funciona justamente por esa variedad.

**Lo que hacés vos:**
1. Habilitar `commons.wikimedia.org` y `upload.wikimedia.org` (arriba).
2. Pedirme: «bajá las voces de Lingua Libre para Suoni».

**Lo que hago yo:**
1. Busco en Commons, por la API, los archivos `LL-Q652 (ita)-<hablante>-<palabra>.wav`
   de cada palabra de `docs/lang/it/ascolto_data.js`.
2. Me quedo con 2 o 3 hablantes por palabra, los convierto a un formato
   liviano (Opus o MP3, unos 10-20 KB por palabra) y recorto el silencio.
3. Los guardo en `docs/lang/it/audio/`, en una carpeta nueva `ll/`, con un índice `palabra → [archivos]`.
   Son unos 3-6 MB en total y quedan en la caché para usar sin conexión.
4. Suoni usa el audio real cuando existe y la voz del teléfono cuando no.
5. Agrego una página de **créditos** en *Io* con el nombre de cada hablante y
   la licencia.
6. Pruebo en el navegador, corro los tests y te mando cuántas palabras
   quedaron con voz real.

**Tiempo:** una sesión. **Riesgo:** algunas palabras raras pueden no estar
grabadas; esas siguen con la voz del teléfono.

---

## Caso 2 · Common Voice: escuchar gramática con voces reales (✓ hecho)

**Qué es.** Cientos de horas de **oraciones** leídas por miles de
voluntarios, con votos que validan cada grabación. Licencia **CC0**: uso
libre, sin crédito obligatorio.

**Para qué.** Dictado y escucha **de gramática**: oraciones reales con la
forma de la semana (*andasse / andava*, *ne*, *ci*, congiuntivo) dichas por
personas distintas.

**Lo que hacés vos:**
1. Crear una cuenta gratuita en **Mozilla Data Collective**
   (<https://datacollective.mozillafoundation.org>), buscar *Common Voice
   Italian*, aceptar los términos y copiar el **link de descarga**. Hoy es la
   única forma de bajarlo: Mozilla pide cuenta y aceptación.
2. Habilitar `datacollective.mozillafoundation.org` (y el dominio del link)
   en la red.
3. Pasarme el link. Si no querés habilitar la red, otra opción es bajar vos
   el archivo y subirlo al repositorio (es grande, varios GB: mejor el link).

**Lo que hago yo:**
1. Leo solo el índice de oraciones validadas (`validated.tsv`) sin bajar todo
   el audio.
2. Filtro oraciones de 5 a 12 palabras, con al menos dos votos a favor y
   ninguno en contra.
3. Las paso por `tools/it/sillabo.py` para asignarles la semana según la
   gramática que usan, y por `tools/it/lessico.py` para que el vocabulario sea
   conocido.
4. Elijo unas 10 por semana, de hablantes distintos, y bajo solo esos
   audios (unas 500 oraciones, 15-20 MB).
5. Los guardo en `docs/lang/it/audio/cv/` y los integro en:
   - el **dictado de Suoni** (en vez de la voz del teléfono);
   - un ejercicio nuevo, **«¿Qué forma escuchaste?»**: oís la oración y
     elegís entre dos formas que compiten (como los duelos, pero de oído).
6. Pruebo, corro los tests y te mando ejemplos por semana.

**Tiempo:** una o dos sesiones. **Riesgo:** algunas oraciones de Common
Voice salen de Wikipedia y son raras o formales; el filtro por semana y
vocabulario descarta la mayoría, y reviso a mano las que quedan.

---

## Caso 3 · Tatoeba: complemento para frases

**Qué es.** Oraciones cortas con traducción y, algunas, con audio. La
**licencia varía por hablante** (CC BY, CC BY-NC y otras): hay que revisar
cada una.

**Para qué.** Frases cotidianas con traducción al castellano, útiles para
*Frasi* y la Pausa caffè.

**Lo que hacés vos:**
1. Habilitar `tatoeba.org`, `api.tatoeba.org` y `audio.tatoeba.org`.
2. Decirme si aceptás licencias **no comerciales** (CC BY-NC). La app no es
   comercial, así que en principio sirven; si algún día la vendieras, habría
   que sacarlas.

**Lo que hago yo:**
1. Busco oraciones italianas con audio y traducción al castellano.
2. Me quedo con las de licencia compatible y con las que coinciden con
   frases del curso o de la semana.
3. Guardo el audio en `docs/lang/it/audio/`, en una carpeta nueva `tt/`, agrego los créditos y lo integro
   donde hoy se lee una frase con la voz del teléfono.

**Tiempo:** una sesión. **Recomendación:** dejarlo último; Lingua Libre y
Common Voice cubren más con menos trámite de licencias.

---

## Orden sugerido

1. **Lingua Libre** → Suoni con voces reales (lo que más se nota).
2. **Common Voice** → dictado y «¿qué forma escuchaste?».
3. **Tatoeba** → solo si después querés más.

Cuando quieras arrancar, alcanza con decirme «voces: caso 1» (o 2, o 3)
después de habilitar la red.
