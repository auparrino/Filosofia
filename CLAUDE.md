# Para Claude

- El alumno (dueño del repo) trabaja en español rioplatense: contestá igual, corto y sin tecnicismos de más.
- Si te pide «seguí con el plan», «ejecutá el paso N» o algo parecido, el plan está en `auditorias/PLAN.md`: leelo entero y seguí su sección «Cómo se usa».
- Antes de tocar contenido, leé el «Procedimiento común» de ese plan (sobre todo: `docs/` se regenera en un clon limpio, si no el CI falla).
- GitHub Pages publica `main/docs`: lo que se mergea a `main` llega a la app.
- Si cambiás contenido (`tools/` o `docs/lang/`), después de regenerar `docs/` corré `node tools/audit/inventario.js --sync` y commiteá `auditorias/registro/`; si no, falla `tools/lib/test_registro.js`.
