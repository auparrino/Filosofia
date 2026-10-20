# Para Claude

- El dueño del repo trabaja en español rioplatense: contestá igual, corto y sin tecnicismos de más.
- El plan de la adaptación (de La Via C1 a Ágora) está en `PLAN.md`: si te pide «seguí con el plan», leelo entero y tomá el primer paso pendiente.
- El contenido se escribe en `tools/curso/semanas/wNN.py` (reglas en `CONTENIDO.md`); después, `npm run build` y commiteá también `docs/lang/<edición>/data/course.json`, si no el CI falla.
- Antes de pushear: `npm test`, `npm run lint`, `npm run sim` y, si tocaste la interfaz, `npm run smoke`.
- Todo lo que la app guarda lleva el prefijo `agora` (guardado, claves, cachés): La Via C1 vive en el mismo origen y no hay que tocar sus datos.
- GitHub Pages publica `main/docs`: lo que se mergea a `main` llega a la app.
