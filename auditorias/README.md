# Auditorías y propuestas

Las revisiones del curso, de la más reciente a la más vieja. Cada una describe
el repo **como estaba cuando se hizo**: las rutas y los números que cita pueden
haber cambiado después (por eso el test de rutas de los `.md`,
`tools/lib/test_rutas.js`, no mira esta carpeta).

| Documento | Versión | Qué mira |
|---|---|---|
| [PLAN.md](PLAN.md) | v3.4 → | **El plan vigente**: auditoría exhaustiva con registro, hábito y ruta de trabajo, didáctica. Se ejecuta paso a paso («Seguí con el plan») |
| [2026-10-portugues-contenido.md](2026-10-portugues-contenido.md) | v3.4 | Auditoría de contenido de *Rumo C1*, semana por semana |
| [2026-09-semanal.md](2026-09-semanal.md) | v3.4 | Auditoría semanal de *La Via C1*, ejercicio por ejercicio |
| [2026-09-v3.md](2026-09-v3.md) | v2.8 → 3.0 | Síntesis de la auditoría para la 3.0; el detalle por frente está en [2026-09-v3/](2026-09-v3/) (A núcleo, B experiencia, C corrección, D italiano, E portugués, F módulos, G base técnica) |
| [2026-09-general.md](2026-09-general.md) | v2.5 | Auditoría general: núcleo, teléfono, herramientas y CI (sección B), contenido de los dos idiomas |
| [2026-09-italiano.md](2026-09-italiano.md) | v2.1 | *La Via C1* jugada como principiante absoluto |
| [2026-09-portugues.md](2026-09-portugues.md) | v2.1 | *Rumo C1* y el núcleo común |
| [PROPUESTAS.md](PROPUESTAS.md) | v44 (numeración vieja) | Lo que falta según la bibliografía, ordenado por efecto ÷ costo |
| [AUDITORIA-2.md](AUDITORIA-2.md) | numeración vieja (service worker v23-v24) | Segunda vuelta: principiante disperso y carrera completa |
| [AUDITORIA-carrera.md](AUDITORIA-carrera.md) | numeración vieja | Una carrera de 52 semanas con la simulación (hoy `tools/lib/sim_carriera.js`) |
| [AUDITORIA-principiante.md](AUDITORIA-principiante.md) | numeración vieja | Una partida de un principiante disperso |

La numeración de versiones fue para atrás una vez (v47 → 1.48 → 2.x). Desde la
2.8 hay una sola fuente: `package.json` (2.8.0), que tiene que coincidir con
`APP_VERSION` de `docs/js/app.js` y `VERSION` de `docs/sw.js`
(lo controla `tools/lib/test_version.js`).

Documentación de proceso que antes estaba en la raíz: las voces reales del
italiano (Lingua Libre, Common Voice) están en `tools/it/VOCES.md`.
