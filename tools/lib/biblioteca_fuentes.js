/*
 * Las obras de la Biblioteca: de dónde salen (Project Gutenberg, espejado
 * en GitHub por GITenberg) y cómo se parten en capítulos o cuentos.  Las
 * lee tools/lib/build_biblioteca.js.
 *
 * Todas de autores muertos hace más de 70 años (dominio público).  El orden
 * de cada idioma es el de la biblioteca: cuentos cortos primero, novelas
 * después; build_biblioteca.js lo confirma con la cobertura léxica.  (Cuore
 * y las novelle de Verga no están en GITenberg en italiano: solo en
 * traducción.)
 *
 * Por obra:
 *   repo, file, enc      el repositorio de GITenberg y el .txt (latin1 o utf8)
 *   from: [texto, n]     la línea (recortada) donde empieza el cuerpo: la
 *                        n-ésima vez que aparece después del encabezado
 *   to                   la primera línea que ya no es cuerpo (regex)
 *   stories              [título moderno, línea del encabezado] de cada
 *                        cuento, en orden (colecciones)
 *   parts                encabezados de parte (Primeira parte…), regex
 *   chapter              regex de los capítulos (numeración romana en
 *                        secuencia: I, II, III…; «PRIMEIRO» vale I)
 *   subtitle             largo máximo del renglón que sigue al número y
 *                        es el título del capítulo (0: ninguno)
 *   group                palabras por unidad de lectura (capítulos cortos
 *                        se juntan); split: una unidad más larga que esto
 *                        se parte en sus capítulos
 *   drop                 renglones que se tiran (FIM DA…, numeración de
 *                        los cuentos…)
 */
"use strict";

var ROMAN = "[IVXLC]+";

module.exports = {
  pt: [
    {
      id: "historias-sem-data", title: "Histórias sem data", author: "Machado de Assis", died: 1908, year: 1884,
      kind: "cuentos", gutenberg: 33056, repo: "Historias-Sem-Data_33056", file: "33056-8.txt", enc: "latin1",
      from: ["A EGREJA DO DIABO", 1], to: /^\*\*\* ?END OF/,
      stories: [["A igreja do Diabo", "A EGREJA DO DIABO"], ["O lapso", "O LAPSO"], ["Último capítulo", "ULTIMO CAPITULO"],
        ["Cantiga de esponsais", "CANTIGA DE ESPONSAES"], ["Singular ocorrência", "SINGULAR OCCURRENCIA"],
        ["Galeria póstuma", "GALERIA POSTHUMA"], ["Capítulo dos chapéus", "CAPITULO DOS CHAPÉOS"],
        ["Conto alexandrino", "CONTO ALEXANDRINO"], ["Primas de Sapucaia!", "PRIMAS DE SAPUCAIA!"],
        ["Uma senhora", "UMA SENHORA."], ["Anedota pecuniária", "ANECDOTA PECUNIARIA"], ["Fulano", "FULANO"],
        ["A segunda vida", "A SEGUNDA VIDA"], ["Noite de almirante", "NOITE DE ALMIRANTE"],
        ["Manuscrito de um sacristão", "MANUSCRITO DE UM SACHRISTÃO"], ["Ex cathedra", "EX CATHEDRA"],
        ["A senhora do Galvão", "A SENHORA DO GALVÃO"], ["As academias de Sião", "AS ACADEMIAS DE SIÃO"]],
      chapter: new RegExp("^(CAPITULO )?" + ROMAN + "\\.?$"), subtitle: 70, group: 0, split: 9000,
      drop: [/^FIM D/]
    },
    {
      id: "papeis-avulsos", title: "Papéis avulsos", author: "Machado de Assis", died: 1908, year: 1882,
      kind: "cuentos", gutenberg: 57001, repo: "Papeis-Avulsos_57001", file: "57001-0.txt", enc: "utf8",
      from: ["O ALIENISTA", 1], to: /^INDICE$/,
      stories: [["O alienista", "O ALIENISTA"], ["Teoria do medalhão", "THEORIA DO MEDALHÃO"],
        ["A chinela turca", "A CHINELA TURCA[1]"], ["Na arca", "NA ARCA"], ["D. Benedita", "D. BENEDICTA"],
        ["O segredo do bonzo", "O SEGREDO DO BONZO[1]"], ["O anel de Polícrates", "O ANNEL DE POLYCRATES"],
        ["O empréstimo", "O EMPRESTIMO"], ["A sereníssima república", "A SERENISSIMA REPUBLICA[1]"],
        ["O espelho", "O ESPELHO"], ["Uma visita de Alcibíades", "UMA VISITA DE ALCIBIADES[1]"],
        ["Verba testamentária", "VERBA TESTAMENTARIA"]],
      chapter: new RegExp("^(CAPITULO )?" + ROMAN + "\\.?$"), subtitle: 70, group: 0, split: 9000,
      drop: [/^FIM D/]
    },
    {
      id: "contos-eca", title: "Contos", author: "Eça de Queirós", died: 1900, year: 1902,
      kind: "cuentos", variant: "pt-PT", gutenberg: 31347, repo: "Contos_31347", file: "31347-8.txt", enc: "latin1",
      from: ["SINGULARIDADES DE UMA RAPARIGA LOURA", 1], to: /^FIM$/,
      stories: [["Singularidades de uma rapariga loura", "SINGULARIDADES DE UMA RAPARIGA LOURA"],
        ["Um poeta lírico", "UM POETA LÍRICO"], ["No moinho", "NO MOINHO"], ["Civilização", "CIVILIZAÇÃO"],
        ["O tesouro", "O TESOIRO"], ["Frei Genebro", "FREI GENEBRO"], ["Adão e Eva no Paraíso", "ADÃO E EVA NO PARAÍSO"],
        ["A aia", "A AIA"], ["O defunto", "O DEFUNTO"], ["José Matias", "JOSE MATIAS"], ["A perfeição", "A PERFEIÇÃO"],
        ["O suave milagre", "O SUAVE MILAGRE!"]],
      chapter: new RegExp("^" + ROMAN + "$"), subtitle: 0, group: 0, split: 9000, drop: []
    },
    {
      id: "o-mandarim", title: "O mandarim", author: "Eça de Queirós", died: 1900, year: 1880,
      kind: "novela corta", variant: "pt-PT", gutenberg: 16384, repo: "O-Mandarim_16384", file: "16384-8.txt", enc: "latin1",
      from: ["PROLOGO", 1], to: /^PORTO--TYP/,
      prologue: "Prólogo",
      chapter: new RegExp("^" + ROMAN + "$"), subtitle: 0, group: 2600, drop: [/^\(COMEDIA INEDITA\)\.$/]
    },
    {
      id: "dom-casmurro", title: "Dom Casmurro", author: "Machado de Assis", died: 1908, year: 1899,
      kind: "novela", gutenberg: 55752, repo: "Dom-Casmurro_55752", file: "55752-8.txt", enc: "latin1",
      from: ["I", 1], to: /^FIM$|^INDICE$|^End of the Project/,
      chapter: new RegExp("^" + ROMAN + "\\.?$"), subtitle: 70, group: 2600, drop: []
    },
    {
      id: "memorial-de-aires", title: "Memorial de Aires", author: "Machado de Assis", died: 1908, year: 1908,
      kind: "novela", gutenberg: 55797, repo: "Memorial-de-Ayres_55797", file: "55797-0.txt", enc: "utf8",
      from: ["9 de Janeiro.", 1], to: /^FIM$/,
      chapter: /^\d{1,2} de [A-ZÀ-Úa-zçã]+\.?$/, dated: true, subtitle: 0, group: 2600, drop: [/^1[89]\d\d$/]
    },
    {
      id: "quincas-borba", title: "Quincas Borba", author: "Machado de Assis", died: 1908, year: 1891,
      kind: "novela", gutenberg: 55682, repo: "Quincas-Borba_55682", file: "55682-8.txt", enc: "latin1",
      from: ["CAPITULO PRIMEIRO", 1], to: /^FIM$/,
      chapter: new RegExp("^CAPITULO (PRIMEIRO|" + ROMAN + ")$"), subtitle: 0, group: 2600, drop: []
    },
    {
      id: "policarpo-quaresma", title: "Triste fim de Policarpo Quaresma", author: "Lima Barreto", died: 1922, year: 1915,
      kind: "novela", gutenberg: 67535, repo: "Triste-Fim-de-Polycarpo-Quaresma_67535", file: "67535-0.txt", enc: "utf8",
      from: ["PRIMEIRA PARTE", 1], to: /^FIM$|^\*\*\* ?END OF/,
      parts: /^(PRIMEIRA|SEGUNDA|TERCEIRA) PARTE$/,
      chapter: new RegExp("^" + ROMAN + "$"), subtitle: 70, group: 0, drop: []
    },
    {
      id: "o-cortico", title: "O cortiço", author: "Aluísio Azevedo", died: 1913, year: 1890,
      kind: "novela", gutenberg: 69187, repo: "O-Cortico_69187", file: "69187-0.txt", enc: "utf8",
      from: ["I", 1], to: /^FIM$|^\*\*\* ?END OF/,
      chapter: new RegExp("^" + ROMAN + "$"), subtitle: 0, group: 0, drop: []
    }
  ],

  it: [
    {
      id: "pinocchio", title: "Le avventure di Pinocchio", author: "Carlo Collodi", died: 1890, year: 1883,
      kind: "novela", gutenberg: 52484, repo: "Le-avventure-di-Pinocchio-Storia-di-un-burattino_52484", file: "52484-0.txt", enc: "utf8",
      from: ["I.", 1], to: /^FINE\.$/,
      chapter: new RegExp("^" + ROMAN + "\\.$"), subtitle: 260, group: 2200, drop: []
    },
    {
      id: "cavallo-nella-luna", title: "Un cavallo nella luna", author: "Luigi Pirandello", died: 1936, year: 1918,
      kind: "cuentos", gutenberg: 56775, repo: "Un-cavallo-nella-luna-Novelle_56775", file: "56775-0.txt", enc: "utf8",
      from: ["UN CAVALLO NELLA LUNA.", 2], to: /^INDICE\.$/,
      stories: [["Un cavallo nella luna", "UN CAVALLO NELLA LUNA."], ["Il capretto nero", "IL CAPRETTO NERO."],
        ["I pensionati della memoria", "I PENSIONATI DELLA MEMORIA."], ["Rondone e rondinella", "RONDONE E RONDINELLA."],
        ["Il gatto, un cardellino e le stelle", "IL GATTO, UN CARDELLINO E LE STELLE."], ["Donna Mimma", "_DONNA MIMMA._"],
        ["La vendetta del cane", "LA VENDETTA DEL CANE."], ["Il saltamartino", "IL SALTAMARTINO."],
        ["Quando si comprende", "QUANDO SI COMPRENDE."], ["Visitare gl'infermi", "VISITARE GL'INFERMI."],
        ["L'abito nuovo", "L'ABITO NUOVO."]],
      chapter: new RegExp("^" + ROMAN + "\\.$"), subtitle: 0, group: 0, split: 9000, drop: []
    },
    {
      id: "come-l-onda", title: "Come l'onda…", author: "Luigi Capuana", died: 1915, year: 1921,
      kind: "cuentos", gutenberg: 42610, repo: "Come-l-onda...Novelle_42610", file: "42610-8.txt", enc: "latin1",
      from: ["JELA.", 1], to: /^FINE\.$/,
      stories: [["Jela", "JELA."], ["Orrori", "ORRORI."], ["Sogno vivente", "SOGNO VIVENTE."],
        ["La bella bruttina", "LA BELLA BRUTTINA."], ["Marito giustiziere", "MARITO GIUSTIZIERE."], ["Il suo amore", "IL SUO AMORE."],
        ["Ci siamo?", "CI SIAMO?"], ["L'uomo rappresentativo", "L'UOMO RAPPRESENTATIVO."], ["Nella pensione", "NELLA PENSIONE."],
        ["Al bivio", "AL BIVIO."], ["L'ostacolo", "L'OSTACOLO."], ["Il mistero di don Ciccio", "IL MISTERO DI DON CICCIO."]],
      chapter: /^$^/, subtitle: 0, group: 0, split: 0, drop: [new RegExp("^" + ROMAN + "\\.$")]
    },
    {
      id: "novelle-de-amicis", title: "Novelle", author: "Edmondo De Amicis", died: 1908, year: 1878,
      kind: "cuentos", gutenberg: 58341, repo: "Novelle_58341", file: "58341-0.txt", enc: "utf8",
      from: ["GLI AMICI DI COLLEGIO.", 1], to: /^FINE\.$/,
      stories: [["Gli amici di collegio", "GLI AMICI DI COLLEGIO."], ["Camilla", "CAMILLA."], ["Furio", "FURIO."],
        ["Un gran giorno", "UN GRAN GIORNO."], ["Alberto", "ALBERTO."], ["Fortezza", "FORTEZZA."],
        ["La casa paterna", "LA CASA PATERNA."]],
      chapter: new RegExp("^" + ROMAN + "\\.$"), subtitle: 0, group: 0, split: 7000, drop: [/^RACCONTO\.$/]
    },
    {
      id: "nuove-paesane", title: "Nuove «Paesane»", author: "Luigi Capuana", died: 1915, year: 1898,
      kind: "cuentos", gutenberg: 42608, repo: "Nuove--Paesane-_42608", file: "42608-8.txt", enc: "latin1",
      from: ["IL BARONE DI FONTANE ASCIUTTE", 1], to: /^FINE\.$/,
      stories: [["Il barone di Fontane Asciutte", "IL BARONE DI FONTANE ASCIUTTE"], ["Un tipo", "UN TIPO"],
        ["Il «mulo» di Rosa", "IL «MULO» DI ROSA"], ["Un eccentrico", "UN ECCENTRICO"], ["Il fascio del cavaliere", "IL FASCIO DEL CAVALIERE"],
        ["Le verginelle", "LE VERGINELLE"], ["Donna Stràula", "DONNA STRÀULA"], ["La casa nuova", "LA CASA NUOVA"]],
      chapter: new RegExp("^" + ROMAN + "\\.?$"), subtitle: 0, group: 0, split: 9000, drop: []
    },
    {
      id: "robinson-italiani", title: "I Robinson italiani", author: "Emilio Salgari", died: 1911, year: 1897,
      kind: "novela", gutenberg: 61209, repo: "I-Robinson-italiani_61209", file: "61209-0.txt", enc: "utf8",
      from: ["CAPITOLO I", 1], to: /^INDICE$/,
      chapter: new RegExp("^CAPITOLO " + ROMAN + "$"), subtitle: 70, group: 0, drop: [/^(\. ){3,}\.?$/]
    },
    {
      id: "dopo-il-divorzio", title: "Dopo il divorzio", author: "Grazia Deledda", died: 1936, year: 1902,
      kind: "novela", gutenberg: 43226, repo: "Dopo-il-divorzio_43226", file: "43226-0.txt", enc: "utf8",
      from: ["I.", 1], to: /^FINE\.$/,
      parts: /^PARTE (PRIMA|SECONDA)$/,
      chapter: new RegExp("^" + ROMAN + "\\.$"), subtitle: 0, group: 0, drop: [/^FINE DELLA PARTE/, /^G\. D\.$/]
    }
  ]
};
