# La Via C1 · Rumo C1 · Weg C1 — idiomas hasta C1 en un año

Una sola app para hispanohablantes rioplatenses con dos cursos completos y uno que arranca:

| | Idioma | Estética | Detalle |
|---|---|---|---|
| 🇮🇹 **La Via C1** | Italiano, de cero a C1 (CILS / CELI / PLIDA) | La Costiera Amalfitana: mayólicas, limones, Playfair Display | [README-italiano.md](README-italiano.md) |
| 🇧🇷 **Rumo C1** | Portugués de Brasil, de cero a C1 (Celpe-Bras) | Carioca: el calçadão, el mar de Ipanema, el Pão de Açúcar | [README-portugues.md](README-portugues.md) |
| 🇩🇪 **Weg C1** | Alemán desde cero: por ahora las seis semanas de A1 (Goethe-Zertifikat A1), en construcción | Berlín: el rojo, el negro y el oro, el azul del Spree | [README-aleman.md](README-aleman.md) |

Los tres comparten el mismo motor y la misma didáctica (el alemán, por ahora, con lo esencial): 52 semanas en cuatro
estaciones con jefes, lecciones en pasos cortos con chequeos, repaso
espaciado con FSRS, diagnóstico de los errores típicos del hispanohablante
con pistas antes que respuestas, frases de conversación, lecturas graduadas,
pares mínimos, dictogloss, duelos, escritura libre y un examen final C1. Cada
palabra de la semana y cada frase traen **cómo se usa**: la construcción, el
régimen, el género, el contraste con el español.

Al abrir la app elegís el idioma, y lo cambiás cuando quieras desde el
perfil. Cada idioma guarda su propio progreso (quien ya estudiaba italiano
sigue donde estaba).

## Las respuestas, con el teclado de la app

En el celular, las respuestas en la lengua del curso se escriben con un
**teclado propio** que aparece en pantalla, con la distribución del idioma
(QWERTY con *à è ì ò ù*, con *ã ç õ*, o QWERTZ con *ä ö ü ß*) y sin el
autocorrector en castellano. Una página web no puede poner el teclado del
teléfono en otro idioma (Chrome en Android no se lo pide al teclado; Safari
tampoco), así que este es el camino. Con ⌨️ volvés al teclado del teléfono
cuando quieras, y la app lo recuerda (también se elige en el perfil).

## La IA, con Claude Haiku

La corrección con IA, las pistas, el role-play y las historias usan
**Claude Haiku** (`claude-haiku-5-5`, de Anthropic) con una clave tuya
(*console.anthropic.com → API keys*). La clave queda en el teléfono; la API
se paga por uso, y con Haiku son centavos. Si Anthropic contesta que la clave
«is not scoped to a workspace», en el perfil va también el ID del workspace
(`wrkspc_…`, en *Settings → Workspaces*): la app lo manda en el encabezado
`anthropic-workspace-id`.

## En el celular

Es una app web instalable (PWA) que funciona sin internet y guarda todo en
el teléfono. Publicá `docs/` con GitHub Pages (*Settings → Pages → Deploy
from a branch*, carpeta `/docs`), abrí la URL una vez con internet y agregala
a la pantalla de inicio. `?lang=it`, `?lang=pt` o `?lang=de` en la URL abre
directo un idioma.

## Cómo está hecha

Un **núcleo** común (`docs/js/`) y un **paquete** por idioma
(`docs/lang/it/`, `docs/lang/pt/`, `docs/lang/de/`) con su conjugador, su
diagnóstico, su contenido, su interfaz y su tema. Un arreglo en el núcleo vale
para todos los idiomas. Detalle en [ARQUITECTURA.md](ARQUITECTURA.md); para aportar
contenido, [CONTENIDO.md](CONTENIDO.md); las auditorías, en
[auditorias/](auditorias/README.md).

```sh
npm run build      # compila banco, curso, tramo C1 y Biblioteca de los dos idiomas
npm test           # los tests de cada idioma, los comunes y los chequeos de contenido
npm run lint       # eslint sobre docs/
npm run sim        # un año simulado en cada idioma (falla si algo no se puede jugar)
npm run smoke      # la app entera en Chromium (necesita Playwright)
npm start          # http://localhost:8000
```
