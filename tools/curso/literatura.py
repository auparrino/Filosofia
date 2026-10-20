# -*- coding: utf-8 -*-
"""La literatura de cada semana: ficción que cae dentro de una corriente o la ejemplifica.

LITERATURA = {semana: [obra, …]}; cada obra es un dict:
  autor, obra, año (de la primera edición; negativo = a. C.),
  tipo     novela | cuento | poema | teatro | ensayo literario | testimonio | diálogo
  por_que  qué idea de la semana muestra y cómo (con la escena o el pasaje cuando importa)
  dp       True si está en dominio público (autor muerto hace más de 70 años: se puede
           leer entero dentro de la app, como la Biblioteca de La Via)
  arg      True si es de un autor argentino o latinoamericano

Las semanas de examen (cada 13: 13, 26, …, 117) no traen obra nueva: repasan las de su estación.
Las semanas siguen el temario (tools/curso/temario.py).
Lo controla tools/curso/check_curso.py.
"""


def o(autor, obra, año, tipo, por_que, dp=False, arg=False):
    return {"autor": autor, "obra": obra, "año": año, "tipo": tipo, "por_que": por_que, "dp": dp, "arg": arg}


LITERATURA = {
    # 1 · ¿Qué es la filosofía?
    1: [
        o('Jostein Gaarder', 'El mundo de Sofía', 1991, 'novela',
          'Una chica recibe dos preguntas en el buzón («¿Quién sos?», «¿De dónde viene el mundo?»): el asombro como comienzo, y la novela recorre la historia de la filosofía que vas a estudiar.'),
        o('Antoine de Saint-Exupéry', 'El principito', 1943, 'novela',
          'Los adultos que dan todo por obvio frente al chico que pregunta: la costumbre contra el asombro.'),
    ],
    # 2 · Los milesios, Pitágoras y Jenófanes
    2: [
        o('Hesíodo', 'Teogonía', -700, 'poema',
          'El origen del mundo contado como genealogía de dioses: el mito del que se separan los milesios.', dp=True),
        o('Ovidio', 'Metamorfosis, libro XV', 8, 'poema',
          'Pitágoras aparece como personaje y da un largo discurso sobre la transmigración de las almas y el cambio de todas las cosas.', dp=True),
    ],
    # 3 · Heráclito, Parménides, Zenón y los atomistas
    3: [
        o('Lucrecio', 'De la naturaleza de las cosas', -55, 'poema',
          'El atomismo de Demócrito y Epicuro en verso: átomos y vacío, nada nace de la nada.', dp=True),
        o('Jorge Luis Borges', '«La perpetua carrera de Aquiles y la tortuga» y «Avatares de la tortuga» (Discusión)', 1932, 'ensayo literario',
          'Borges cuenta la paradoja de Zenón y la persigue por la historia de la filosofía.', arg=True),
    ],
    # 4 · Lógica I: validez, verdad y forma
    4: [
        o('Lewis Carroll', '«Lo que la tortuga le dijo a Aquiles»', 1895, 'diálogo',
          'Publicado en la revista *Mind*: la tortuga acepta las premisas de un *modus ponens* pero no la conclusión, y obliga a Aquiles a agregar premisas al infinito. La pregunta de qué es «seguirse».', dp=True),
        o('Arthur Conan Doyle', 'Estudio en escarlata', 1887, 'novela',
          'Lo que Holmes llama «deducción» suele ser inducción o abducción: un buen caso para separar los tipos de razonamiento.', dp=True),
    ],
    # 5 · La India antigua: Upanishads, Buda y Mahavira
    5: [
        o('Hermann Hesse', 'Siddhartha', 1922, 'novela',
          'El río que siempre es el mismo y siempre otro le enseña al protagonista la unidad de los contrarios: Heráclito por otro camino.'),
        o('Milindapañha (anónimo)', 'Las preguntas del rey Milinda', -100, 'diálogo',
          'El rey griego Menandro discute con el monje Nagasena: el carro no es ninguna de sus partes, y el yo tampoco. El budismo en forma de diálogo, casi un diálogo platónico.', dp=True),
    ],
    # 6 · China antigua: Confucio, Laozi, Mozi y Zhuangzi
    6: [
        o('Ursula K. Le Guin', 'La rueda celeste', 1971, 'novela',
          'Un hombre cuyos sueños cambian la realidad, y un psiquiatra que quiere usarlos para mejorar el mundo: el wu wei taoísta contra la voluntad de controlar (los epígrafes son de Zhuangzi).'),
        o('Bertolt Brecht', '«Leyenda del origen del libro Tao Te King durante el camino de Laozi a la emigración»', 1938, 'poema',
          'Laozi se va del país y un aduanero le pide que deje escrita su sabiduría: «lo blando vence a lo duro».'),
    ],
    # 7 · Los sofistas
    7: [
        o('Aristófanes', 'Las nubes', -423, 'teatro',
          'Sócrates caricaturizado como un sofista que enseña a ganar cualquier discusión: la imagen que Platón quiere desmentir en la *Apología*.', dp=True),
        o('Gorgias', 'Encomio de Helena', -415, 'ensayo literario',
          'Gorgias defiende a Helena de Troya para mostrar el poder de la palabra: un ejercicio retórico que es, a la vez, una teoría del lenguaje como droga.', dp=True),
    ],
    # 8 · Sócrates
    8: [
        o('Platón', 'Apología de Sócrates', -390, 'diálogo',
          'El juicio contado como drama: la defensa, la condena y el «una vida sin examen no merece ser vivida». La filosofía como literatura.', dp=True),
        o('Platón', 'Critón', -390, 'diálogo',
          'En la cárcel, Critón le ofrece a Sócrates escapar; Sócrates le contesta con un diálogo imaginario con las Leyes de Atenas.', dp=True),
    ],
    # 9 · Platón I: el alma y el conocimiento
    9: [
        o('William Wordsworth', 'Oda: Indicios de inmortalidad', 1807, 'poema',
          'El alma viene de otra vida y el niño todavía la recuerda: la reminiscencia platónica en el Romanticismo inglés.', dp=True),
        o('Platón', 'Fedón (la muerte de Sócrates)', -380, 'diálogo',
          'La última conversación antes de la cicuta: los argumentos por la inmortalidad del alma, en una de las escenas más famosas de la literatura griega.', dp=True),
    ],
    # 10 · Platón II: la justicia (República I-IV)
    10: [
        o('Aldous Huxley', 'Un mundo feliz', 1932, 'novela',
          'Una sociedad ordenada por castas, con la verdad administrada desde arriba: para discutir la ciudad justa, el filósofo-rey y la «noble mentira».'),
        o('H. G. Wells', 'El hombre invisible', 1897, 'novela',
          'Un científico que se vuelve invisible deja de respetar cualquier límite: el anillo de Giges hecho novela.', dp=True),
    ],
    # 11 · Platón III: el filósofo y el Bien (República V-VII, Banquete)
    11: [
        o('José Saramago', 'La caverna', 2000, 'novela',
          'Un alfarero y un shopping que esconde, en el subsuelo, la caverna de Platón (el epígrafe es de la *República*).'),
        o('Platón', 'Banquete', -380, 'diálogo',
          'Una fiesta donde cada invitado elogia a Eros, hasta el discurso de Diotima y la entrada de Alcibíades borracho: el diálogo más literario de Platón.', dp=True),
    ],
    # 12 · Platón IV: el conocimiento y la crítica de las Ideas
    12: [
        o('Platón', 'Timeo y Critias (la Atlántida)', -360, 'diálogo',
          'El mito de la Atlántida, la isla que se hundió por su soberbia: Platón inventa una historia para pensar la ciudad ideal en acción.', dp=True),
    ],
    # 13 · Examen: Grecia, del mito a Platón
    13: [],
    # 14 · Aristóteles I: categorías y sustancia
    14: [
        o('Jorge Luis Borges', '«El idioma analítico de John Wilkins» (Otras inquisiciones)', 1952, 'ensayo literario',
          'Una enciclopedia china imaginaria que divide a los animales en «pertenecientes al emperador», «embalsamados»…: ¿hay categorías naturales o todas son arbitrarias? Aristóteles contra la clasificación caprichosa.', arg=True),
    ],
    # 15 · Aristóteles II: la naturaleza (Física)
    15: [
        o('Mary Shelley', 'Frankenstein', 1818, 'novela',
          'Materia, forma y una «causa eficiente» humana: sirve para preguntar con las cuatro causas qué es la criatura y para qué fue hecha.', dp=True),
    ],
    # 16 · Aristóteles III: el ser y el alma (Metafísica, Acerca del alma)
    16: [
        o('Ovidio', 'Metamorfosis, libro X (Pigmalión)', 8, 'poema',
          'Un escultor se enamora de su estatua y la diosa le da vida: forma, materia y alma, la pregunta de Acerca del alma.', dp=True),
    ],
    # 17 · Lógica II: el silogismo y las falacias
    17: [
        o('Lewis Carroll', 'Alicia en el país de las maravillas', 1865, 'novela',
          'La merienda del Sombrerero y la discusión del gato de Cheshire están llenas de *non sequiturs* y de inversiones («decir lo que pienso» no es «pensar lo que digo»): un laboratorio de falacias.', dp=True),
        o('Jonathan Swift', 'Una modesta proposición', 1729, 'ensayo literario',
          'Propone, con frialdad lógica, comerse a los hijos de los pobres: la sátira como reducción al absurdo de un argumento económico.', dp=True),
    ],
    # 18 · Aristóteles IV: la ética (Ética a Nicómaco)
    18: [
        o('Homero', 'Ilíada', -750, 'poema',
          'La *areté* heroica de Aquiles (fuerza, honor, cólera) contra la virtud que Aristóteles pone en el término medio.', dp=True),
        o('Jane Austen', 'Orgullo y prejuicio', 1813, 'novela',
          'Para Alasdair MacIntyre (*Tras la virtud*, cap. 16), Austen es la última gran voz de la ética de las virtudes: el carácter se forma corrigiendo excesos, como el orgullo y el prejuicio.', dp=True),
    ],
    # 19 · Aristóteles V: política, retórica y poética
    19: [
        o('Sófocles', 'Edipo rey', -429, 'teatro',
          'La tragedia que Aristóteles pone de modelo en la *Poética*: la peripecia, el reconocimiento y la catarsis por compasión y temor.', dp=True),
        o('Umberto Eco', 'El nombre de la rosa', 1980, 'novela',
          'Una abadía mata por el segundo libro de la Poética, el perdido sobre la comedia: ¿es peligrosa la risa? Platón y Aristóteles sobre el arte, en un policial medieval.'),
    ],
    # 20 · Cínicos y cirenaicos
    20: [
        o('Diógenes Laercio', 'Vidas de los filósofos ilustres, libro VI', 230, 'testimonio',
          'Las anécdotas de Diógenes el cínico (el tonel, la linterna, «correte que me tapás el sol») son la forma en que nos llegó su filosofía.', dp=True),
        o('Luciano de Samósata', 'Diálogos de los muertos', 165, 'diálogo',
          'Menipo, el cínico, se ríe en el Hades de reyes, ricos y filósofos: la sátira cínica.', dp=True),
    ],
    # 21 · Epicuro y el epicureísmo
    21: [
        o('Horacio', 'Odas I 11 («carpe diem»)', -23, 'poema',
          '«Tomá el día, confiá lo menos posible en el mañana»: el epicureísmo hecho verso latino.', dp=True),
        o('Lucrecio', 'De la naturaleza de las cosas, libro III', -55, 'poema',
          'Los argumentos contra el miedo a la muerte («la muerte no es nada para nosotros»), en verso.', dp=True),
    ],
    # 22 · Los estoicos griegos: lógica, física y ética
    22: [
        o('Cicerón', 'El sueño de Escipión (República VI)', -51, 'diálogo',
          'Escipión ve la Tierra desde las estrellas, chiquita: el cosmos estoico, ordenado por el logos, y la pequeñez de la gloria.', dp=True),
    ],
    # 23 · El estoicismo en Roma
    23: [
        o('Marguerite Yourcenar', 'Memorias de Adriano', 1951, 'novela',
          'El emperador, cerca de la muerte, escribe con la serenidad de un estoico y el gusto de un epicúreo: las dos escuelas como formas de vida.'),
        o('Séneca', 'Fedra', 50, 'teatro',
          'Las tragedias del filósofo estoico muestran lo que pasa cuando la pasión le gana a la razón.', dp=True),
    ],
    # 24 · Los escépticos
    24: [
        o('Luciano de Samósata', 'Hermótimo', 165, 'diálogo',
          'Un hombre lleva veinte años estudiando estoicismo y Licino le pregunta cómo sabe que eligió la escuela correcta: la sátira escéptica.', dp=True),
    ],
    # 25 · Plotino y el neoplatonismo
    25: [
        o('Jorge Luis Borges', '«Historia de la eternidad» (Historia de la eternidad)', 1936, 'ensayo literario',
          'Borges parte de las Enéadas de Plotino para contar cómo se pensó la eternidad.', arg=True),
        o('Porfirio', 'Vida de Plotino', 301, 'testimonio',
          'El discípulo cuenta al maestro: un hombre «que parecía avergonzado de estar en un cuerpo».', dp=True),
    ],
    # 26 · Examen: Aristóteles, helenísticos y Roma
    26: [],
    # 27 · Fe y razón: los primeros cristianos
    27: [
        o('Evangelio de Juan', 'Prólogo (1, 1-14)', 100, 'poema',
          '«En el principio era el Logos»: la palabra de Heráclito y de los estoicos, en el centro del cristianismo.', dp=True),
        o('Fiódor Dostoievski', 'Los hermanos Karamázov, «El gran inquisidor» (libro V, cap. 5)', 1880, 'novela',
          'Cristo vuelve a Sevilla y el inquisidor lo encarcela: la libertad que da la fe es demasiado pesada. Fe, razón y poder.', dp=True),
    ],
    # 28 · Agustín I: el mal, la libertad y el tiempo
    28: [
        o('Agustín de Hipona', 'Confesiones', 400, 'testimonio',
          'La primera gran autobiografía interior: el robo de las peras, la conversión en el jardín y, en el libro XI, la pregunta por el tiempo.', dp=True),
    ],
    # 29 · Agustín II: la verdad y la historia
    29: [
        o('Jorge Luis Borges', '«Los teólogos» (El Aleph)', 1947, 'cuento',
          'Dos teólogos se combaten por una herejía sobre el tiempo circular que Agustín había refutado en La ciudad de Dios.', arg=True),
    ],
    # 30 · Boecio, el Pseudo-Dionisio y Eriúgena
    30: [
        o('Boecio', 'La consolación de la filosofía', 524, 'diálogo',
          'En la cárcel, esperando la ejecución, Boecio recibe a la Filosofía en forma de mujer: prosa y verso sobre la fortuna, el mal y la libertad.', dp=True),
        o('Dante Alighieri', 'Divina comedia, Paraíso', 1321, 'poema',
          'La subida hacia la luz y el Uno, con la imaginería neoplatónica que pasa por Agustín.', dp=True),
    ],
    # 31 · Anselmo y el argumento ontológico
    31: [
        o('Anselmo de Canterbury', 'Proslogion, cap. 1 (la oración inicial)', 1078, 'poema',
          'El argumento ontológico está escrito como una plegaria: «no busco entender para creer, sino que creo para entender».', dp=True),
    ],
    # 32 · La querella de los universales
    32: [
        o('Abelardo y Eloísa', 'Cartas', 1132, 'testimonio',
          'El mayor dialéctico del siglo XII y su alumna cuentan su historia de amor y castigo: el filósofo de los universales, en primera persona.', dp=True),
        o('Jorge Luis Borges', '«Funes el memorioso» (Ficciones)', 1942, 'cuento',
          'Funes recuerda cada hoja de cada árbol y no puede pensar «perro» en general: los universales y el nominalismo llevados al extremo.', arg=True),
    ],
    # 33 · La filosofía en el islam I: al-Kindi, al-Farabi y Avicena
    33: [
        o('Las mil y una noches', '(anónimo; versión de Galland)', 1704, 'cuento',
          'El mundo de Bagdad y Córdoba donde se traducía y comentaba a Aristóteles: el marco cultural de Avicena y Averroes.', dp=True),
        o('Avicena', 'Hayy ibn Yaqzan (El vivo, hijo del despierto)', 1030, 'novela',
          'Una alegoría en la que un sabio guía al alma hacia el conocimiento: el intelecto agente hecho personaje.', dp=True),
    ],
    # 34 · La filosofía en el islam II: al-Ghazali, Averroes e Ibn Jaldún
    34: [
        o('Jorge Luis Borges', '«La busca de Averroes» (El Aleph)', 1949, 'cuento',
          'Averroes no puede traducir «tragedia» y «comedia» de la *Poética* porque en su mundo no hay teatro: el comentador de Aristóteles y los límites de una cultura.', arg=True),
        o('Ibn Tufail', 'El filósofo autodidacta', 1180, 'novela',
          'Un chico criado por una gacela en una isla desierta llega solo, por la razón, a la verdad que la religión enseña: la tesis de que filosofía y revelación coinciden (Ibn Tufail era el protector de Averroes).', dp=True),
    ],
    # 35 · La filosofía judía medieval: Saadia, Halevi y Maimónides
    35: [
        o('Yehudá Halevi', 'El Cuzarí', 1140, 'diálogo',
          'Un rey jázaro escucha a un filósofo, a un cristiano, a un musulmán y a un rabino antes de elegir religión.', dp=True),
        o('Jorge Luis Borges', '«El Golem» (El otro, el mismo)', 1964, 'poema',
          'El rabino de Praga hace un hombre de barro con el nombre de Dios: la tradición judía, la palabra y la creación.', arg=True),
    ],
    # 36 · Tomás de Aquino I: fe, razón y las cinco vías
    36: [
        o('Dante Alighieri', 'Divina comedia, Paraíso, cantos X-XIII', 1321, 'poema',
          'Tomás de Aquino es personaje: presenta a los sabios del cielo del Sol. La teología tomista hecha poema.', dp=True),
    ],
    # 37 · Tomás de Aquino II: el alma, la ley y la acción
    37: [
        o('Dante Alighieri', 'Divina comedia, Purgatorio, cantos XVII-XVIII', 1321, 'poema',
          'Virgilio le explica a Dante cómo el amor ordena o desordena las acciones y en qué consiste el libre albedrío: la moral tomista en verso.', dp=True),
    ],
    # 38 · Duns Escoto, Ockham y el fin de la escolástica
    38: [
        o('Umberto Eco', 'El nombre de la rosa', 1980, 'novela',
          'Guillermo de Baskerville, el detective, está inspirado en Ockham y en Bacon; el final («de la rosa nos quedan solo los nombres») es una tesis nominalista.'),
    ],
    # 39 · Examen: el Medioevo
    39: [],
    # 40 · El humanismo renacentista
    40: [
        o('Tomás Moro', 'Utopía', 1516, 'novela',
          'La isla sin propiedad privada, contada por un viajero del Nuevo Mundo: el Renacimiento piensa la sociedad ideal.', dp=True),
        o('Erasmo de Rotterdam', 'Elogio de la locura', 1511, 'ensayo literario',
          'La Locura en persona se elogia a sí misma y se burla de teólogos, reyes y sabios: el humanismo contra la escolástica.', dp=True),
    ],
    # 41 · Maquiavelo
    41: [
        o('Nicolás Maquiavelo', 'La mandrágora', 1518, 'teatro',
          'La comedia del autor de *El príncipe*: un engaño bien calculado donde todos consiguen lo que quieren. El fin y los medios, con humor.', dp=True),
    ],
    # 42 · La conquista y la Escuela de Salamanca
    42: [
        o('William Shakespeare', 'La tempestad', 1611, 'teatro',
          'Calibán, el habitante original de la isla, y el discurso de Gonzalo, que sale casi textual de «De los caníbales» de Montaigne: la discusión de Las Casas y Sepúlveda en el teatro.', dp=True),
        o('Bartolomé de las Casas', 'Brevísima relación de la destrucción de las Indias', 1552, 'testimonio',
          'La denuncia de la conquista que alimenta la controversia de Valladolid.', dp=True, arg=True),
    ],
    # 43 · Montaigne y el escepticismo renacentista
    43: [
        o('Miguel de Cervantes', 'Don Quijote de la Mancha', 1605, 'novela',
          '¿Son molinos o gigantes? ¿Bacía o yelmo («baciyelmo»)? La novela de la apariencia y de las perspectivas, escrita cuando Montaigne ya había dudado de todo.', dp=True),
        o('William Shakespeare', 'Hamlet', 1603, 'teatro',
          '«Ser o no ser»: la duda, la muerte y la acción, con muchos ecos de los Ensayos de Montaigne.', dp=True),
    ],
    # 44 · La revolución científica
    44: [
        o('Bertolt Brecht', 'Vida de Galileo', 1943, 'teatro',
          'La ciencia nueva contra la autoridad, y la retractación: ¿qué le debe el científico a la verdad?'),
        o('Johannes Kepler', 'El sueño (Somnium)', 1634, 'novela',
          'Un viaje a la Luna para mostrar cómo se vería la Tierra desde allá: el copernicanismo en forma de ficción, considerada la primera novela de ciencia ficción.', dp=True),
        o('Francis Bacon', 'La nueva Atlántida', 1627, 'novela',
          'Una isla gobernada por una casa de sabios que experimentan: el programa científico de Bacon como utopía.', dp=True),
    ],
    # 45 · Hobbes
    45: [
        o('William Golding', 'El señor de las moscas', 1954, 'novela',
          'Unos chicos en una isla sin adultos: el estado de naturaleza de Hobbes, la guerra de todos contra todos y la necesidad de un poder común.'),
    ],
    # 46 · Descartes I: la duda y el cogito
    46: [
        o('Pedro Calderón de la Barca', 'La vida es sueño', 1635, 'teatro',
          'Segismundo no sabe si está despierto: el argumento del sueño, escrito casi al mismo tiempo que las *Meditaciones*.', dp=True),
        o('Jorge Luis Borges', '«Las ruinas circulares» (Ficciones)', 1940, 'cuento',
          'Un hombre sueña a otro hombre hasta hacerlo real, y descubre que él también es soñado: la duda de Descartes sin un Dios que la detenga.', arg=True),
    ],
    # 47 · Descartes II: Dios, el mundo y el dualismo
    47: [
        o("Auguste Villiers de l'Isle-Adam", 'La Eva futura', 1886, 'novela',
          'Edison fabrica una mujer artificial perfecta: ¿qué le falta a la máquina? Los animales-máquina de Descartes y el dualismo.', dp=True),
    ],
    # 48 · Pascal
    48: [
        o('Jorge Luis Borges', '«La esfera de Pascal» (Otras inquisiciones)', 1952, 'ensayo literario',
          'La metáfora del universo como una esfera infinita, de los presocráticos a Pascal, que la vivió con espanto.', arg=True),
        o('Blaise Pascal', 'Pensamientos', 1670, 'ensayo literario',
          'Fragmentos inconclusos que se leen como poesía: el junco pensante, el silencio eterno de los espacios infinitos.', dp=True),
    ],
    # 49 · Spinoza I: Dios o la naturaleza
    49: [
        o('Jorge Luis Borges', '«Spinoza» y «Baruch Spinoza» (poemas)', 1964, 'poema',
          'El pulidor de lentes que «labra a Dios» en la penumbra: un retrato del *Deus sive natura*.', arg=True),
    ],
    # 50 · Spinoza II: los afectos, la libertad y la política
    50: [
        o('Isaac Bashevis Singer', '«El Spinoza de la calle Market»', 1961, 'cuento',
          'Un viejo erudito de Varsovia vive según la Ética de Spinoza hasta que la vida le gana a la razón.'),
    ],
    # 51 · Leibniz
    51: [
        o('Voltaire', 'Cándido o el optimismo', 1759, 'novela',
          'El doctor Pangloss repite que vivimos en el mejor de los mundos posibles mientras todo sale mal: la sátira de Leibniz.', dp=True),
    ],
    # 52 · Examen: Renacimiento y siglo XVII
    52: [],
    # 53 · Locke I: la experiencia
    53: [
        o('Laurence Sterne', 'Tristram Shandy', 1759, 'novela',
          'Una novela que se desarma siguiendo la asociación de ideas del *Ensayo* de Locke, al que cita.', dp=True),
    ],
    # 54 · Locke II: el gobierno y la tolerancia
    54: [
        o('Daniel Defoe', 'Robinson Crusoe', 1719, 'novela',
          'Un hombre solo trabaja la tierra y la hace suya: la propiedad por el trabajo de Locke, y el estado de naturaleza optimista.', dp=True),
    ],
    # 55 · Berkeley
    55: [
        o('Jorge Luis Borges', '«Tlön, Uqbar, Orbis Tertius» (Ficciones)', 1940, 'cuento',
          'Un planeta inventado donde el idealismo de Berkeley es el sentido común: las cosas existen solo mientras se las percibe.', arg=True),
    ],
    # 56 · Hume I: la causalidad y la inducción
    56: [
        o('Jorge Luis Borges', '«Nueva refutación del tiempo» (Otras inquisiciones)', 1952, 'ensayo literario',
          'Parte de Berkeley y Hume para negar el tiempo y el yo, y termina: «El tiempo es la sustancia de que estoy hecho».', arg=True),
    ],
    # 57 · Hume II: el yo, la religión y la moral
    57: [
        o('Luigi Pirandello', 'Uno, ninguno y cien mil', 1926, 'novela',
          'Un hombre descubre que no tiene un yo, sino tantos como quienes lo miran: el yo como «haz de percepciones» de Hume.', dp=True),
    ],
    # 58 · La Ilustración francesa
    58: [
        o('Denis Diderot', 'Jacques el fatalista', 1796, 'novela',
          'Un criado convencido de que «todo estaba escrito allá arriba» discute con su amo: determinismo y libertad, con humor.', dp=True),
        o('Voltaire', 'Micromegas', 1752, 'cuento',
          'Un gigante de Sirio visita la Tierra y conversa con unos filósofos diminutos: la mirada ilustrada que relativiza todo.', dp=True),
    ],
    # 59 · Montesquieu y Rousseau I
    59: [
        o('Montesquieu', 'Cartas persas', 1721, 'novela',
          'Dos persas en París escriben a su casa: la mirada extranjera muestra que las leyes y las costumbres son convenciones.', dp=True),
        o('Voltaire', 'El ingenuo', 1767, 'cuento',
          'Un hurón llega a Francia y no entiende sus costumbres: el «buen salvaje» y la crítica de la sociedad.', dp=True),
    ],
    # 60 · Rousseau II y la Ilustración escocesa
    60: [
        o('Jean-Jacques Rousseau', 'Emilio', 1762, 'novela',
          'La educación de un chico según la naturaleza: el «hombre natural» de Rousseau, en forma de novela pedagógica.', dp=True),
    ],
    # 61 · Los derechos y la revolución: Wollstonecraft, Burke y Paine
    61: [
        o('Mary Wollstonecraft', 'María, o los agravios de la mujer', 1798, 'novela',
          'Una mujer encerrada por su marido en un manicomio: la novela de la Vindicación.', dp=True),
        o('Olaudah Equiano', 'La interesante narración de la vida de Olaudah Equiano', 1789, 'testimonio',
          'La autobiografía de un esclavo liberado, decisiva para la abolición: los derechos del hombre, ¿de qué hombres?', dp=True),
    ],
    # 62 · Kant I: el giro copernicano
    62: [
        o('Heinrich von Kleist', 'Carta a Wilhelmine von Zenge (22 de marzo de 1801) y «Sobre el teatro de marionetas»', 1801, 'ensayo literario',
          'Kleist lee a Kant y entra en crisis: si no podemos conocer la cosa en sí, toda verdad es la de unos anteojos verdes. Es la «crisis kantiana» más famosa de la literatura.', dp=True),
        o('Thomas De Quincey', 'Los últimos días de Immanuel Kant', 1827, 'ensayo literario',
          'El filósofo de las rutinas, contado en su vejez: una biografía que Borges admiraba.', dp=True),
    ],
    # 63 · Kant II: los límites de la razón
    63: [
        o('Jorge Luis Borges', '«El libro de arena» (El libro de arena)', 1975, 'cuento',
          'Un libro sin principio ni fin: lo que pasa cuando la razón quiere abarcar el infinito, como en las antinomias de Kant.', arg=True),
    ],
    # 64 · Kant III: la ética del deber
    64: [
        o('Heinrich von Kleist', 'Michael Kohlhaas', 1810, 'novela',
          'Un comerciante busca justicia con un rigor absoluto y termina en el crimen: ¿hasta dónde vale el deber sin mirar las consecuencias?', dp=True),
        o('Mark Twain', 'Las aventuras de Huckleberry Finn', 1884, 'novela',
          'Huck decide no denunciar a Jim, el esclavo que escapa, aunque «su conciencia» le dice que debe: Jonathan Bennett lo usa (1974) para discutir la moral del principio contra la simpatía.', dp=True),
    ],
    # 65 · Examen: la Ilustración
    65: [],
    # 66 · Kant IV: lo bello, lo sublime y la paz
    66: [
        o('Friedrich Schiller', 'Cartas sobre la educación estética del hombre', 1795, 'ensayo literario',
          'El poeta lee la Crítica del juicio: solo jugando el hombre es plenamente humano.', dp=True),
        o('Friedrich Hölderlin', 'Hiperión', 1797, 'novela',
          'Un griego moderno busca la belleza y la libertad: la estética kantiana y el sueño de la armonía perdida.', dp=True),
    ],
    # 67 · El idealismo alemán y el romanticismo
    67: [
        o('Johann Wolfgang von Goethe', 'Fausto', 1808, 'teatro',
          '«En el principio era la acción»: el espíritu que se hace a sí mismo a través de sus errores, la gran obra del idealismo alemán.', dp=True),
        o('Novalis', 'Enrique de Ofterdingen', 1802, 'novela',
          'La búsqueda de la flor azul: el romanticismo de Jena, donde el arte y el mundo se funden.', dp=True),
    ],
    # 68 · Hegel I: la Fenomenología del espíritu
    68: [
        o('Sófocles', 'Antígona', -441, 'teatro',
          'Antígona entierra a su hermano contra la ley de Creonte: Hegel la lee en la *Fenomenología* como el choque de dos derechos, la familia y el Estado.', dp=True),
    ],
    # 69 · Hegel II: el Estado y la historia
    69: [
        o('León Tolstói', 'Guerra y paz, epílogo, segunda parte', 1869, 'novela',
          '¿Napoleón hace la historia o la historia lo hace a él? Tolstói discute la filosofía de la historia en su propia novela.', dp=True),
    ],
    # 70 · Schopenhauer
    70: [
        o('Thomas Mann', 'Los Buddenbrook', 1901, 'novela',
          'Thomas Buddenbrook lee a Schopenhauer y por un momento la muerte deja de asustarlo (parte X, cap. 5): la voluntad y su negación.', dp=True),
    ],
    # 71 · Kierkegaard
    71: [
        o('Søren Kierkegaard', 'Diario de un seductor (en O lo uno o lo otro)', 1843, 'novela',
          'El estadio estético hecho novela: el seductor que vive de instantes y no elige nunca.', dp=True),
    ],
    # 72 · Feuerbach y Marx I: la alienación
    72: [
        o('Herman Melville', '«Bartleby, el escribiente»', 1853, 'cuento',
          'Un copista que contesta a todo «preferiría no hacerlo»: el trabajo alienado y la negativa.', dp=True),
    ],
    # 73 · Marx II: la historia y el capital
    73: [
        o('Émile Zola', 'Germinal', 1885, 'novela',
          'La huelga de los mineros del norte de Francia: explotación, conciencia de clase y lucha.', dp=True),
        o('Roberto Arlt', 'Los siete locos', 1929, 'novela',
          'Una sociedad secreta quiere financiar la revolución con prostíbulos: el Buenos Aires de la crisis, entre el anarquismo y el fascismo.', dp=True, arg=True),
    ],
    # 74 · El utilitarismo: Bentham y Mill
    74: [
        o('Charles Dickens', 'Tiempos difíciles', 1854, 'novela',
          'El señor Gradgrind educa con «hechos, nada más que hechos»: la caricatura del utilitarismo, y lo que deja afuera.', dp=True),
        o('Fiódor Dostoievski', 'Los hermanos Karamázov (la rebelión de Iván, libro V)', 1880, 'novela',
          '¿Aceptarías la felicidad de todos a cambio de la tortura de un solo chico? La objeción clásica al cálculo de la utilidad.', dp=True),
    ],
    # 75 · Positivismo, evolución y el siglo XIX latinoamericano
    75: [
        o('Domingo Faustino Sarmiento', 'Facundo', 1845, 'ensayo literario',
          '«Civilización y barbarie»: la tesis que discute casi todo el pensamiento argentino posterior.', dp=True, arg=True),
        o('H. G. Wells', 'La máquina del tiempo', 1895, 'novela',
          'Un viajero llega al año 802.701 y encuentra a la humanidad dividida en dos especies: la evolución darwiniana y la lucha de clases.', dp=True),
    ],
    # 76 · Nietzsche I: la tragedia y la verdad
    76: [
        o('Thomas Mann', 'La muerte en Venecia', 1912, 'novela',
          'Un escritor entre lo apolíneo y lo dionisíaco: la belleza como orden y como abismo.', dp=True),
    ],
    # 77 · Nietzsche II: la moral y la muerte de Dios
    77: [
        o('Fiódor Dostoievski', 'Crimen y castigo', 1866, 'novela',
          'Raskólnikov mata porque cree que los hombres extraordinarios están más allá del bien y del mal, veinte años antes del superhombre de Nietzsche.', dp=True),
        o('Hermann Hesse', 'Demian', 1919, 'novela',
          'Un muchacho rompe con la moral de su casa para hacerse a sí mismo: Nietzsche leído por una generación entera.'),
    ],
    # 78 · Examen: el siglo XIX
    78: [],
    # 79 · Frege y la lógica moderna
    79: [
        o('Lewis Carroll', 'A través del espejo, cap. VI (Humpty Dumpty)', 1871, 'novela',
          '«Cuando uso una palabra, significa lo que yo quiero que signifique»: sentido, referencia y quién manda en el lenguaje.', dp=True),
    ],
    # 80 · Russell y Moore
    80: [
        o('Lewis Carroll', 'A través del espejo, cap. VII', 1871, 'novela',
          '«No veo a nadie en el camino.» «¡Ojalá tuviera esos ojos, para ver a Nadie!» El chiste de tratar «nadie» como un nombre es el problema que Russell resuelve con su teoría de las descripciones.', dp=True),
    ],
    # 81 · Wittgenstein I y el Círculo de Viena
    81: [
        o('Hugo von Hofmannsthal', 'Carta de Lord Chandos', 1902, 'ensayo literario',
          'Un escritor ya no puede usar las palabras abstractas: «se me deshacían en la boca como hongos podridos». La crisis del lenguaje de la Viena de Wittgenstein.', dp=True),
        o('Robert Musil', 'Las tribulaciones del estudiante Törless', 1906, 'novela',
          'Un alumno se choca con lo que no se puede decir (los números imaginarios, la crueldad): Musil se doctoró con una tesis sobre Mach, el antecesor del Círculo de Viena.', dp=True),
    ],
    # 82 · El pragmatismo
    82: [
        o('Ursula K. Le Guin', '«Los que se alejan de Omelas»', 1973, 'cuento',
          'Le Guin cuenta que la sacó de un pasaje de William James (*El filósofo moral y la vida moral*): una ciudad feliz que depende del sufrimiento de un chico.'),
        o('Henry James', 'Otra vuelta de tuerca', 1898, 'novela',
          '¿Hay fantasmas o no? La novela del hermano de William James deja la verdad en manos de las consecuencias de cada lectura.', dp=True),
    ],
    # 83 · Husserl y la fenomenología
    83: [
        o('Marcel Proust', 'Por el camino de Swann', 1913, 'novela',
          'La magdalena: el tiempo vivido y el recuerdo como se dan a la conciencia, descriptos desde adentro, como pide la fenomenología.', dp=True),
    ],
    # 84 · Heidegger
    84: [
        o('León Tolstói', 'La muerte de Iván Ilich', 1886, 'novela',
          'Heidegger la cita en *Ser y tiempo* (§51, nota): un hombre que vivió como «se» vive descubre que va a morir, y que su muerte es suya.', dp=True),
        o('Rainer Maria Rilke', 'Elegías de Duino', 1923, 'poema',
          'El poeta que Heidegger más leyó: la finitud, la muerte y el «estar en el mundo».', dp=True),
    ],
    # 85 · Bergson y la antropología filosófica
    85: [
        o('Thomas Mann', 'La montaña mágica', 1924, 'novela',
          'Siete años en un sanatorio de los Alpes donde el tiempo pierde su medida: la duración de Bergson y la pregunta por qué es el hombre.', dp=True),
        o('Franz Kafka', '«Informe para una academia»', 1917, 'cuento',
          'Un mono cuenta ante académicos cómo se volvió humano: la antropología filosófica en una fábula.', dp=True),
    ],
    # 86 · El existencialismo: Sartre, Camus y Merleau-Ponty
    86: [
        o('Albert Camus', 'El extranjero', 1942, 'novela',
          'Meursault no finge lo que no siente y la sociedad lo condena por eso: el absurdo.'),
        o('Jean-Paul Sartre', 'La náusea', 1938, 'novela',
          'Roquentin descubre ante la raíz de un castaño que la existencia es pura contingencia: la existencia precede a la esencia, hecha novela.'),
        o('Ernesto Sabato', 'El túnel', 1948, 'novela',
          'La confesión de un pintor que mató a la única persona que lo entendía: el existencialismo argentino, que Camus elogió.', arg=True),
    ],
    # 87 · Simone de Beauvoir
    87: [
        o('Virginia Woolf', 'Orlando', 1928, 'novela',
          'Un joven noble que vive cuatro siglos y un día amanece mujer: el género como algo que se llega a ser.', dp=True),
    ],
    # 88 · Wittgenstein II y el lenguaje ordinario
    88: [
        o('Julio Cortázar', 'Historias de cronopios y de famas', 1962, 'cuento',
          '«Instrucciones para subir una escalera»: las reglas de un juego de lenguaje, escritas como si nadie las supiera.', arg=True),
    ],
    # 89 · La Escuela de Frankfurt y Habermas
    89: [
        o('Ray Bradbury', 'Fahrenheit 451', 1953, 'novela',
          'Bomberos que queman libros en una sociedad entretenida por pantallas: la industria cultural de Adorno y Horkheimer.'),
        o('Aldous Huxley', 'Un mundo feliz', 1932, 'novela',
          'La felicidad fabricada y el entretenimiento como control: el texto que la Escuela de Frankfurt discutió (Adorno escribió sobre él).'),
    ],
    # 90 · La hermenéutica: Gadamer y Ricoeur
    90: [
        o('Jorge Luis Borges', '«Pierre Menard, autor del Quijote» (Ficciones)', 1939, 'cuento',
          'Menard reescribe palabra por palabra el *Quijote* y el texto significa otra cosa: el sentido depende del horizonte del lector, la tesis de la hermenéutica.', arg=True),
    ],
    # 91 · Examen: el siglo XX
    91: [],
    # 92 · Popper
    92: [
        o('Jorge Luis Borges', '«Del rigor en la ciencia» (El hacedor)', 1960, 'cuento',
          'El mapa del tamaño del imperio: qué es un modelo y por qué no puede ser la realidad.', arg=True),
    ],
    # 93 · Kuhn, Lakatos y Feyerabend
    93: [
        o('Stanisław Lem', 'Solaris', 1961, 'novela',
          'Un siglo de científicos estudia un océano vivo y cada teoría cae: los límites de un paradigma ante lo que no encaja.'),
    ],
    # 94 · Quine y Kripke: el lenguaje y la necesidad
    94: [
        o('Italo Calvino', 'Las ciudades invisibles', 1972, 'novela',
          'Marco Polo le describe a Kublai Kan ciudades que quizás son una sola: nombres, referencia y mundos posibles.'),
    ],
    # 95 · Epistemología contemporánea I: el conocimiento
    95: [
        o('Ryūnosuke Akutagawa', '«En el bosque»', 1922, 'cuento',
          'Un crimen contado por siete testigos que no coinciden (es la base de *Rashomon*): ¿qué se puede saber por testimonio?', dp=True),
    ],
    # 96 · Epistemología contemporánea II: escepticismo, testimonio e injusticia
    96: [
        o('Adolfo Bioy Casares', 'La invención de Morel', 1940, 'novela',
          'Un prófugo se enamora de una mujer que resulta ser una imagen grabada: percepción, creencia justificada y realidad.', arg=True),
    ],
    # 97 · Filosofía de la mente I: ¿qué es la mente?
    97: [
        o('Franz Kafka', 'La metamorfosis', 1915, 'novela',
          'Gregor Samsa sigue siendo él en un cuerpo de insecto: ¿qué es la mente, si no es el cuerpo?', dp=True),
    ],
    # 98 · Filosofía de la mente II: la conciencia
    98: [
        o('Philip K. Dick', '¿Sueñan los androides con ovejas eléctricas?', 1968, 'novela',
          'Un test de empatía para distinguir humanos de androides: funcionalismo, conciencia y el problema de las otras mentes.'),
    ],
    # 99 · Metafísica contemporánea I: la identidad personal
    99: [
        o('Jorge Luis Borges', '«Borges y yo» (El hacedor) y «El otro» (El libro de arena)', 1960, 'cuento',
          'Borges conversa con su doble y con su yo joven: ¿qué hace que una persona sea la misma a lo largo del tiempo?', arg=True),
        o('Robert Louis Stevenson', 'El extraño caso del doctor Jekyll y míster Hyde', 1886, 'novela',
          'Dos personas en un cuerpo: identidad personal y responsabilidad.', dp=True),
    ],
    # 100 · Metafísica contemporánea II: libertad, posibilidad y tiempo
    100: [
        o('Jorge Luis Borges', '«El jardín de senderos que se bifurcan» (Ficciones)', 1941, 'cuento',
          'Una novela laberinto donde se cumplen todos los futuros posibles: los mundos posibles y la modalidad.', arg=True),
    ],
    # 101 · Filosofía de la religión contemporánea
    101: [
        o('Albert Camus', 'La peste', 1947, 'novela',
          'El sermón del padre Paneloux y la muerte de un chico: el problema del mal sin consuelo.'),
        o('Jorge Luis Borges', '«Tres versiones de Judas» (Ficciones)', 1944, 'cuento',
          'Un teólogo argumenta que Dios eligió ser Judas: un argumento riguroso que lleva a lo intolerable.', arg=True),
    ],
    # 102 · Filosofía de la matemática y lógicas no clásicas
    102: [
        o('Edwin A. Abbott', 'Planilandia', 1884, 'novela',
          'Un cuadrado que vive en dos dimensiones recibe la visita de una esfera: cómo pensar lo que no se puede percibir.', dp=True),
        o('Jorge Luis Borges', '«La biblioteca de Babel» (Ficciones)', 1941, 'cuento',
          'Una biblioteca con todos los libros posibles: el infinito, la combinatoria y el sentido.', arg=True),
    ],
    # 103 · Estética II: ¿qué es arte?
    103: [
        o('Oscar Wilde', 'El retrato de Dorian Gray', 1890, 'novela',
          'El prefacio («todo arte es completamente inútil») y el retrato que envejece en lugar del modelo: el arte por el arte y su precio.', dp=True),
    ],
    # 104 · Examen: hoy I
    104: [],
    # 105 · Metaética: ¿hay hechos morales?
    105: [
        o('Herman Melville', 'Billy Budd, marinero', 1924, 'novela',
          'Un capitán debe ahorcar a un marinero inocente porque la ley lo manda: ¿qué hace verdadero a un juicio moral?', dp=True),
    ],
    # 106 · Ética normativa hoy: el tranvía, las virtudes y el cuidado
    106: [
        o('William Styron', 'La decisión de Sophie', 1979, 'novela',
          'En Auschwitz, un oficial obliga a una madre a elegir cuál de sus hijos vive: un dilema que ninguna teoría resuelve.'),
    ],
    # 107 · Justicia: Rawls, Nozick y sus críticos
    107: [
        o('Ursula K. Le Guin', 'Los desposeídos', 1974, 'novela',
          'Dos mundos, uno anarquista y pobre, otro capitalista y rico: ¿qué distribución es justa?'),
    ],
    # 108 · Hannah Arendt
    108: [
        o('Primo Levi', 'Si esto es un hombre', 1947, 'testimonio',
          'La vida en Auschwitz, contada por un químico: el testimonio que acompaña la pregunta de Arendt por el mal.'),
    ],
    # 109 · Foucault, Derrida y Deleuze
    109: [
        o('Franz Kafka', 'El proceso', 1925, 'novela',
          'Josef K. es juzgado por un tribunal que nunca ve: el poder anónimo de la burocracia, leído junto a Foucault.', dp=True),
        o('George Orwell', '1984', 1949, 'novela',
          'La vigilancia total y el control del lenguaje (la neolengua): el panóptico y el poder sobre la verdad.', dp=True),
    ],
    # 110 · Feminismos y filosofía del género
    110: [
        o('Sor Juana Inés de la Cruz', 'Respuesta a sor Filotea de la Cruz', 1691, 'ensayo literario',
          'La monja novohispana defiende el derecho de las mujeres a estudiar: el primer texto feminista de América.', dp=True, arg=True),
        o('Virginia Woolf', 'Un cuarto propio', 1929, 'ensayo literario',
          'Si Shakespeare hubiera tenido una hermana igual de genial: las condiciones materiales de la creación y el género.', dp=True),
        o('Margaret Atwood', 'El cuento de la criada', 1985, 'novela',
          'Una teocracia que reduce a las mujeres a su función reproductiva: el cuerpo como asunto político.'),
    ],
    # 111 · Pensamiento latinoamericano I: identidad y liberación
    111: [
        o('José Martí', 'Nuestra América', 1891, 'ensayo literario',
          '«El vino, de plátano»: pensar América desde América.', dp=True, arg=True),
        o('José Enrique Rodó', 'Ariel', 1900, 'ensayo literario',
          'Un maestro despide a sus alumnos oponiendo Ariel (el espíritu) a Calibán (el utilitarismo): el ensayo que marcó a la juventud latinoamericana.', dp=True, arg=True),
    ],
    # 112 · Pensamiento argentino
    112: [
        o('José Hernández', 'Martín Fierro', 1872, 'poema',
          'El gaucho perseguido por el Estado: Carlos Astrada lo lee como mito fundador en *El mito gaucho* (1948).', dp=True, arg=True),
        o('Leopoldo Marechal', 'Adán Buenosayres', 1948, 'novela',
          'Un poeta recorre Buenos Aires como un descenso metafísico: la búsqueda de lo americano.', arg=True),
        o('Juan Rulfo', 'Pedro Páramo', 1955, 'novela',
          'Un pueblo de muertos que hablan: el mundo que Kusch llama «estar» frente al «ser» europeo.', arg=True),
    ],
    # 113 · Filosofía africana y de la diáspora
    113: [
        o('Chinua Achebe', 'Todo se desmorona', 1958, 'novela',
          'La vida de una comunidad igbo y su destrucción por la colonia: una cultura con su propia filosofía, contada desde adentro.'),
    ],
    # 114 · Asia: el budismo madhyamaka, el neoconfucianismo y la Escuela de Kioto
    114: [
        o('Natsume Sōseki', 'Kokoro', 1914, 'novela',
          'Un estudiante y su maestro en el Japón que se moderniza: soledad, culpa y el «entre» de las relaciones humanas.', dp=True),
        o('Rabindranath Tagore', 'Gitanjali', 1910, 'poema',
          'Las canciones del Nobel bengalí: lo divino en lo cotidiano, entre el vedanta y la modernidad.', dp=True),
    ],
    # 115 · Ética aplicada: la vida, los animales y la tierra
    115: [
        o('Kazuo Ishiguro', 'Nunca me abandones', 2005, 'novela',
          'Unos chicos criados para donar sus órganos: clonación, dignidad y sentido de una vida corta.'),
        o('Mary Shelley', 'Frankenstein', 1818, 'novela',
          '¿Qué le debe un creador a lo que crea? La primera novela de la bioética.', dp=True),
    ],
    # 116 · La técnica, la IA y el sentido de la vida
    116: [
        o('Kazuo Ishiguro', 'Klara y el sol', 2021, 'novela',
          'Una amiga artificial cuida a una chica enferma: ¿puede una IA querer?, ¿qué nos haría reemplazables?'),
        o('Douglas Adams', 'Guía del autoestopista galáctico', 1979, 'novela',
          'Una computadora tarda millones de años en calcular la respuesta al sentido de la vida, y da 42: el problema es la pregunta.'),
    ],
    # 117 · Examen final
    117: [],
}

EXAM_WEEKS = tuple(sorted([13, 26, 39, 52, 65, 78, 91, 104, 117]))
