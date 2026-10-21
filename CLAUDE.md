# Para Claude

- El dueño del repo trabaja en español rioplatense: contestá igual, corto y sin tecnicismos de más.
- Ágora es una app de lectura (sin preguntas ni ejercicios). El plan está en `PLAN.md`: si te pide «seguí con el plan», leelo entero y tomá el primer paso pendiente.
- El contenido se escribe en `tools/curso/semanas/wNN.py` (reglas en `CONTENIDO.md`); después, `npm run build` y commiteá también lo que cambie en `docs/lang/<edición>/data/`, si no el CI falla.
- Antes de pushear: `npm test`, `npm run lint` y, si tocaste la interfaz, `npm run smoke`.
- Todo lo que la app guarda lleva el prefijo `agora` (la clave `agora.lector.v1`, las cachés `agora-…`): La Via C1 vive en el mismo origen y no hay que tocar sus datos.
- La app se publica en https://auparrino.github.io/agora/ (repo `auparrino/agora`): después de mergear a `main`, `sh tools/publicar_agora.sh` copia `docs/` al clon de agora, y ahí se commitea y pushea a su `main`. `main/docs` de este repo también se publica, en /Filosofia/.
