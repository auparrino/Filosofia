#!/bin/sh
# Copia la app (docs/) al repo auparrino/agora, que la publica en
# https://auparrino.github.io/agora/ (GitHub Pages desde main, la raíz).
# Ágora se publica ahí y no en /Filosofia/ porque Chrome en Android quedó con
# una instalación trabada de esa dirección.
#
# Uso: sh tools/publicar_agora.sh [carpeta del clon de agora]   (por defecto ../agora)
# Después: entrar al clon, revisar, commitear y pushear.
set -e
AQUI=$(cd "$(dirname "$0")/.." && pwd)
DEST=${1:-$AQUI/../agora}
[ -d "$DEST/.git" ] || { echo "no encuentro el clon de agora en $DEST"; exit 1; }
# todo lo de antes se va, salvo .git y los dos archivos propios del repo
find "$DEST" -mindepth 1 -maxdepth 1 ! -name .git ! -name README.md ! -name .nojekyll -exec rm -rf {} +
cp -R "$AQUI/docs/." "$DEST/"
touch "$DEST/.nojekyll"
[ -f "$DEST/README.md" ] || cat > "$DEST/README.md" <<'MD'
# Ágora

La app de lectura de filosofía, publicada en **https://auparrino.github.io/agora/**.

Este repo solo publica: el código y el contenido viven en
[auparrino/Filosofia](https://github.com/auparrino/Filosofia), y se copian
acá con `tools/publicar_agora.sh`. No edites a mano lo que hay acá.
MD
echo "copiado a $DEST: $(cd "$DEST" && git status --short | wc -l) cambios"
