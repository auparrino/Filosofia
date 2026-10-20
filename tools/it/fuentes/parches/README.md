# Parches del audit

- `dummies/chNN.json`: reescritura de los ejercicios de *Italian Grammar For Dummies*
  para que se entiendan en español (consigna, enunciado, respuestas). Los aplica
  `python3 tools/it/build_course.py` al armar el curso.
- `sfide/chNN.json`: clave de respuestas de los desafíos del *Soluzioni* para que
  se jueguen corregidos automáticamente. Los lee `tools/it/build_course.py`.
