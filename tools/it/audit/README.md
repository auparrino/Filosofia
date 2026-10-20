# Auditoría de contenido

Objetivo: **0 errores** en todo lo que ve el alumno, con un criterio de parada
verificable, no «hasta que no encuentre más».

## Qué cuenta como error

1. **Italiano** incorrecto o no natural (gramática, ortografía, tildes, uso).
2. **Español** incorrecto (ortografía, gramática; el registro es rioplatense con voseo).
3. **Regla o dato falso** en una explicación, nota, lección o lectura.
4. **Ejercicio roto**: la respuesta aceptada es incorrecta, falta una respuesta
   igual de correcta, hay más de una opción correcta, o la consigna no alcanza
   para saber qué escribir (ambigüedad).
5. **Inglés visible** para el alumno.

## Las dos capas

**Capa 1: automática** (`lint.js`, corre en segundos, sale con 0 o falla):

- diccionarios Hunspell de LibreOffice (italiano, español, inglés) más el
  vocabulario de la banca y todas las formas del conjugador;
- voseo reconocido; las palabras correctas que no están en los diccionarios
  (argentinismos, nombres propios, fragmentos didácticos como *-isc-*) están
  en `whitelist.txt`, cada una revisada;
- reglas ortográficas: *perchè*, *pò*, *qual'è*, *nè*, *un'* + masculino…;
- paréntesis, comillas y signos de pregunta balanceados; espacios;
- estructura: la respuesta está entre las aceptadas, una sola opción correcta,
  el error de «encontrá el error» está en la frase y el corrector lo detecta,
  todas las variantes aceptadas pasan por el corrector.

**Capa 2: revisión nativa por pasadas** (`shard.js` + agentes):

1. `node tools/it/audit/corpus.js` extrae todo a unidades numeradas (≈3.400).
2. `node tools/it/audit/shard.js <n> 12` las reparte en lotes; cada pasada mueve
   los cortes, así cada unidad cae con otros vecinos y bajo otra mirada.
3. Un revisor por lote reporta hallazgos (`out/passN/find_K.json`).
4. Un verificador independiente, que no es el revisor, confirma o rechaza cada
   hallazgo antes de aplicarlo en la fuente (`out/passN/decisions_*.json`).
5. Se reconstruye, se corre la capa 1 y los tests.

**Criterio de parada:** una pasada completa sobre todo el corpus con **0
errores confirmados** y la capa 1 en 0.

## Requisitos

    pip install spylls
    cd tools/it/audit && npm install
    node tools/it/audit/corpus.js && node tools/it/audit/lint.js
