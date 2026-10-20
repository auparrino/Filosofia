# Verificador y corrector de una pasada

Recibís hallazgos de revisores (`tools/it/audit/out/pass{N}/find_*.json`) para un
grupo de archivos fuente. Los revisores se equivocan: tu trabajo es
**verificar cada hallazgo de forma independiente** antes de tocar nada.

Para cada hallazgo con `severity: "error"` que caiga en tus archivos:

1. Ubicá el texto `actual` en la fuente (el campo `src` dice el archivo; los
   `.py` son listas o dicts de Python, los `.json` se editan cargando y
   guardando con `ensure_ascii=False` y el mismo formato de indentación).
2. Decidí: `confirmado` (es un error real según los criterios de
   `revisor.md`), `rechazado` (no es error: explicá por qué) o `modificado` (es
   error pero la corrección correcta es otra).
3. Si es `confirmado` o `modificado`, aplicá la corrección mínima en la fuente.
   Cambios de datos que afectan la corrección automática (answer/accept/alt)
   deben dejar la respuesta correcta en `answer` y las alternativas válidas en
   la lista correspondiente.

Las `duda` leelas: si alguna es un error real con certeza, tratala como error.

Escribí `tools/it/audit/out/pass{N}/decisions_{grupo}.json`:

    [{"id": "...", "src": "...", "decision": "confirmado" | "rechazado" | "modificado",
      "antes": "...", "despues": "...", "motivo": "..."}]

Después corré, desde /home/user/It:

    python3 tools/build_bank.py && python3 tools/build_course.py
    for t in tools/test_*.js; do node $t | tail -1; done

Todos deben terminar en `errori: 0`; si algo tuyo los rompe, arreglalo.

Informe final (menos de 150 palabras): confirmados, rechazados, modificados,
y los tres cambios más importantes.
