# Registro de la auditoría

Qué está revisado y qué no, unidad por unidad, para los dos idiomas
(`it.json`, `pt.json`) y lo que es de los dos (`comun.json`: «Tres lenguas»).
Lo usan los pasos de [`../PLAN.md`](../PLAN.md); el criterio de «terminado» es
que todas las unidades estén en `revisada-2` y sin hallazgos abiertos.

## Qué es una unidad

Todo lo revisable, con un id estable `<idioma>:<módulo>:<clave>`:

- del curso (`data/course.json`): `items`, `sfide`, `leccion` (un bloque de
  teoría), `semana` (la ficha: título, foco, `fare`, intro y partes de la
  lección) y `vocab-semana` (las palabras de la semana);
- del banco (`data/bank.json`): `banco-sustantivos`, `-verbos`, `-adjetivos`,
  `-palabras`, `-frases`, `-errores`, `-es-<código>`, `-falsos`, `-ortografia`
  (y `-regencia` en portugués);
- de cada módulo de `docs/lang/<código>/*_data.js`: una lectura, un episodio,
  un par mínimo, un duelo, una escena de frases, una ficha de «Fuera de la
  app»… (la lista completa sale de `npm run cobertura`);
- de `docs/lang/tres_lenguas_data.js`: lo compartido.

No entran la lógica de los módulos ni las listas de configuración
(`freq_data.js`, `rules.js`, `escritura_plus_data.js`), ni lo derivado
(`formule_data.js`, `frequenza.json`, la Biblioteca): no son contenido que se
revise a mano. El detalle está en el encabezado de
`tools/audit/inventario.js`.

## Formato

```json
"it:items:d03-001": {"hash": "a1b2c3d4e5", "estado": "revisada-2",
  "revisores": ["A", "B"], "fecha": "2026-10-05",
  "hallazgos": [{"texto": "falta la variante «F»", "abierto": false}]}
```

- `estado`: `pendiente` · `revisada-1` · `revisada-2` · `disputa` (los dos
  revisores no coinciden; un tercero decide y la pasa a `revisada-2`).
- `hash`: del contenido que se revisó. **Si el contenido cambia, la unidad
  vuelve a `pendiente`** (`--sync`), así lo nuevo o editado no queda sin
  revisar. Las pendientes solo llevan `hash` y `estado`.
- `hallazgos`: `[{texto, abierto}]`. Una unidad con algún hallazgo abierto no
  está terminada aunque tenga dos revisiones.

## Comandos

```
node tools/audit/inventario.js                   cuántas unidades hay, por módulo
node tools/audit/inventario.js --sync            pone al día el registro (hace falta
                                                 cada vez que cambia el contenido)
node tools/audit/inventario.js --marcar it lote.json
                                                 anota una pasada: [{id, estado, revisor, hallazgos}]
npm run cobertura                                tablero por idioma y módulo
npm run cobertura -- --readme                    reescribe el resumen de abajo
```

**Cada vez que se agrega, borra o edita contenido**, el PR corre `--sync` y
commitea el registro (después de regenerar `docs/`): el test
`tools/lib/test_registro.js` falla si el registro no coincide con el
inventario (unidades sin registrar, huérfanas, o revisadas con un hash viejo).

## Cobertura

`2×` revisadas por dos revisores · `1×` por uno · `disp` en disputa ·
`pend` sin revisar · `abiertos` con algún hallazgo abierto · `terminado` =
`2×` sobre el total.

<!-- cobertura:inicio -->

| idioma | unidades | 2× | 1× | disp | pend | abiertos | terminado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| it | 14278 | 249 | 0 | 0 | 14029 | 0 | 1,7 % |
| pt | 11827 | 0 | 0 | 0 | 11827 | 0 | 0,0 % |
| comun | 204 | 0 | 0 | 0 | 204 | 0 | 0,0 % |

<details><summary>it por módulo</summary>

| módulo | unidades | 2× | 1× | disp | pend | abiertos | terminado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ascolto-acento | 30 | 0 | 0 | 0 | 30 | 0 | 0,0 % |
| ascolto-conectado | 50 | 0 | 0 | 0 | 50 | 0 | 0,0 % |
| ascolto-intonacion | 50 | 0 | 0 | 0 | 50 | 0 | 0,0 % |
| ascolto-pares | 190 | 0 | 0 | 0 | 190 | 0 | 0,0 % |
| banco-adjetivos | 423 | 0 | 0 | 0 | 423 | 0 | 0,0 % |
| banco-errores | 584 | 0 | 0 | 0 | 584 | 0 | 0,0 % |
| banco-es-it | 1137 | 0 | 0 | 0 | 1137 | 0 | 0,0 % |
| banco-falsos | 97 | 0 | 0 | 0 | 97 | 0 | 0,0 % |
| banco-frases | 864 | 0 | 0 | 0 | 864 | 0 | 0,0 % |
| banco-ortografia | 48 | 0 | 0 | 0 | 48 | 0 | 0,0 % |
| banco-palabras | 354 | 0 | 0 | 0 | 354 | 0 | 0,0 % |
| banco-sustantivos | 1827 | 0 | 0 | 0 | 1827 | 0 | 0,0 % |
| banco-verbos | 636 | 0 | 0 | 0 | 636 | 0 | 0,0 % |
| biblioteca-cognados | 10 | 0 | 0 | 0 | 10 | 0 | 0,0 % |
| biblioteca-raices | 50 | 0 | 0 | 0 | 50 | 0 | 0,0 % |
| desglose | 38 | 0 | 0 | 0 | 38 | 0 | 0,0 % |
| devolucion | 2 | 0 | 0 | 0 | 2 | 0 | 0,0 % |
| devolucion-terminos | 31 | 0 | 0 | 0 | 31 | 0 | 0,0 % |
| dictogloss | 47 | 0 | 0 | 0 | 47 | 0 | 0,0 % |
| duelos | 8 | 0 | 0 | 0 | 8 | 0 | 0,0 % |
| escritos-conectores | 31 | 0 | 0 | 0 | 31 | 0 | 0,0 % |
| escritos-equivalencias | 6 | 0 | 0 | 0 | 6 | 0 | 0,0 % |
| escritos-pistas | 28 | 0 | 0 | 0 | 28 | 0 | 0,0 % |
| escritos-preposiciones | 39 | 0 | 0 | 0 | 39 | 0 | 0,0 % |
| examen-ascolto | 3 | 0 | 0 | 0 | 3 | 0 | 0,0 % |
| examen-lettura | 3 | 0 | 0 | 0 | 3 | 0 | 0,0 % |
| examen-monologhi | 3 | 0 | 0 | 0 | 3 | 0 | 0,0 % |
| examen-ricostruzione | 3 | 0 | 0 | 0 | 3 | 0 | 0,0 % |
| examen-scritture | 6 | 0 | 0 | 0 | 6 | 0 | 0,0 % |
| examen-versioni | 3 | 0 | 0 | 0 | 3 | 0 | 0,0 % |
| frases | 358 | 0 | 0 | 0 | 358 | 0 | 0,0 % |
| frases-escena | 21 | 0 | 0 | 0 | 21 | 0 | 0,0 % |
| fuera | 47 | 0 | 0 | 0 | 47 | 0 | 0,0 % |
| items | 4853 | 0 | 0 | 0 | 4853 | 0 | 0,0 % |
| lab-capire | 6 | 0 | 0 | 0 | 6 | 0 | 0,0 % |
| lab-falsos | 28 | 0 | 0 | 0 | 28 | 0 | 0,0 % |
| lab-reglas | 9 | 0 | 0 | 0 | 9 | 0 | 0,0 % |
| leccion | 387 | 0 | 0 | 0 | 387 | 0 | 0,0 % |
| lectura-semana | 52 | 0 | 0 | 0 | 52 | 0 | 0,0 % |
| lectura-serie | 59 | 0 | 0 | 0 | 59 | 0 | 0,0 % |
| mapas-bloques | 2 | 0 | 0 | 0 | 2 | 0 | 0,0 % |
| mapas-escenas | 16 | 0 | 0 | 0 | 16 | 0 | 0,0 % |
| porque | 26 | 0 | 0 | 0 | 26 | 0 | 0,0 % |
| radio | 19 | 0 | 0 | 0 | 19 | 0 | 0,0 % |
| scrivi | 48 | 0 | 0 | 0 | 48 | 0 | 0,0 % |
| semana | 52 | 0 | 0 | 0 | 52 | 0 | 0,0 % |
| sfide | 339 | 0 | 0 | 0 | 339 | 0 | 0,0 % |
| trabajo-escena | 13 | 13 | 0 | 0 | 0 | 0 | 100,0 % |
| trabajo-frases | 158 | 158 | 0 | 0 | 0 | 0 | 100,0 % |
| trabajo-items | 78 | 78 | 0 | 0 | 0 | 0 | 100,0 % |
| tramo | 24 | 0 | 0 | 0 | 24 | 0 | 0,0 % |
| tramo-generos | 8 | 0 | 0 | 0 | 8 | 0 | 0,0 % |
| variaciones | 29 | 0 | 0 | 0 | 29 | 0 | 0,0 % |
| vocab-semana | 917 | 0 | 0 | 0 | 917 | 0 | 0,0 % |
| voces | 128 | 0 | 0 | 0 | 128 | 0 | 0,0 % |
| **total it** | 14278 | 249 | 0 | 0 | 14029 | 0 | 1,7 % |

</details>

<details><summary>pt por módulo</summary>

| módulo | unidades | 2× | 1× | disp | pend | abiertos | terminado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ascolto-acento | 35 | 0 | 0 | 0 | 35 | 0 | 0,0 % |
| ascolto-conectado | 48 | 0 | 0 | 0 | 48 | 0 | 0,0 % |
| ascolto-intonacion | 80 | 0 | 0 | 0 | 80 | 0 | 0,0 % |
| ascolto-pares | 181 | 0 | 0 | 0 | 181 | 0 | 0,0 % |
| banco-adjetivos | 448 | 0 | 0 | 0 | 448 | 0 | 0,0 % |
| banco-errores | 516 | 0 | 0 | 0 | 516 | 0 | 0,0 % |
| banco-es-pt | 1095 | 0 | 0 | 0 | 1095 | 0 | 0,0 % |
| banco-falsos | 148 | 0 | 0 | 0 | 148 | 0 | 0,0 % |
| banco-frases | 700 | 0 | 0 | 0 | 700 | 0 | 0,0 % |
| banco-ortografia | 67 | 0 | 0 | 0 | 67 | 0 | 0,0 % |
| banco-palabras | 463 | 0 | 0 | 0 | 463 | 0 | 0,0 % |
| banco-regencia | 132 | 0 | 0 | 0 | 132 | 0 | 0,0 % |
| banco-sustantivos | 1836 | 0 | 0 | 0 | 1836 | 0 | 0,0 % |
| banco-verbos | 674 | 0 | 0 | 0 | 674 | 0 | 0,0 % |
| biblioteca-cognados | 11 | 0 | 0 | 0 | 11 | 0 | 0,0 % |
| biblioteca-raices | 35 | 0 | 0 | 0 | 35 | 0 | 0,0 % |
| desglose | 39 | 0 | 0 | 0 | 39 | 0 | 0,0 % |
| devolucion | 2 | 0 | 0 | 0 | 2 | 0 | 0,0 % |
| devolucion-terminos | 30 | 0 | 0 | 0 | 30 | 0 | 0,0 % |
| dictogloss | 47 | 0 | 0 | 0 | 47 | 0 | 0,0 % |
| duelos | 8 | 0 | 0 | 0 | 8 | 0 | 0,0 % |
| escritos-conectores | 24 | 0 | 0 | 0 | 24 | 0 | 0,0 % |
| escritos-equivalencias | 6 | 0 | 0 | 0 | 6 | 0 | 0,0 % |
| escritos-pistas | 26 | 0 | 0 | 0 | 26 | 0 | 0,0 % |
| escritos-preposiciones | 32 | 0 | 0 | 0 | 32 | 0 | 0,0 % |
| examen-ascolto | 3 | 0 | 0 | 0 | 3 | 0 | 0,0 % |
| examen-lettura | 3 | 0 | 0 | 0 | 3 | 0 | 0,0 % |
| examen-scrittura | 4 | 0 | 0 | 0 | 4 | 0 | 0,0 % |
| examen-versoes | 3 | 0 | 0 | 0 | 3 | 0 | 0,0 % |
| frases | 539 | 0 | 0 | 0 | 539 | 0 | 0,0 % |
| frases-escena | 32 | 0 | 0 | 0 | 32 | 0 | 0,0 % |
| fuera | 47 | 0 | 0 | 0 | 47 | 0 | 0,0 % |
| items | 2681 | 0 | 0 | 0 | 2681 | 0 | 0,0 % |
| lab-capire | 10 | 0 | 0 | 0 | 10 | 0 | 0,0 % |
| lab-falsos | 103 | 0 | 0 | 0 | 103 | 0 | 0,0 % |
| lab-reglas | 16 | 0 | 0 | 0 | 16 | 0 | 0,0 % |
| leccion | 373 | 0 | 0 | 0 | 373 | 0 | 0,0 % |
| lectura-semana | 52 | 0 | 0 | 0 | 52 | 0 | 0,0 % |
| lectura-serie | 45 | 0 | 0 | 0 | 45 | 0 | 0,0 % |
| mapas-bloques | 2 | 0 | 0 | 0 | 2 | 0 | 0,0 % |
| mapas-escenas | 9 | 0 | 0 | 0 | 9 | 0 | 0,0 % |
| porque | 31 | 0 | 0 | 0 | 31 | 0 | 0,0 % |
| radio | 19 | 0 | 0 | 0 | 19 | 0 | 0,0 % |
| scrivi | 48 | 0 | 0 | 0 | 48 | 0 | 0,0 % |
| semana | 52 | 0 | 0 | 0 | 52 | 0 | 0,0 % |
| tramo | 24 | 0 | 0 | 0 | 24 | 0 | 0,0 % |
| tramo-generos | 12 | 0 | 0 | 0 | 12 | 0 | 0,0 % |
| variaciones | 28 | 0 | 0 | 0 | 28 | 0 | 0,0 % |
| vocab-semana | 1008 | 0 | 0 | 0 | 1008 | 0 | 0,0 % |
| **total pt** | 11827 | 0 | 0 | 0 | 11827 | 0 | 0,0 % |

</details>

<details><summary>comun por módulo</summary>

| módulo | unidades | 2× | 1× | disp | pend | abiertos | terminado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| tres-lenguas-contrastes | 3 | 0 | 0 | 0 | 3 | 0 | 0,0 % |
| tres-lenguas-duelo | 61 | 0 | 0 | 0 | 61 | 0 | 0,0 % |
| tres-lenguas-pares | 140 | 0 | 0 | 0 | 140 | 0 | 0,0 % |
| **total comun** | 204 | 0 | 0 | 0 | 204 | 0 | 0,0 % |

</details>

<!-- cobertura:fin -->
