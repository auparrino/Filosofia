# -*- coding: utf-8 -*-
"""La literatura de cada semana: ficción que cae dentro de una corriente o la ejemplifica.

LITERATURA = {semana: [obra, …]}; cada obra es un dict:
  autor, obra, año (de la primera edición; negativo = a. C.),
  tipo     novela | cuento | poema | teatro | ensayo literario | testimonio | diálogo
  por_que  qué idea de la semana muestra y cómo (con la escena o el pasaje cuando importa)
  dp       True si está en dominio público (autor muerto hace más de 70 años: se puede
           leer entero dentro de la app, como la Biblioteca de La Via)
  arg      True si es de un autor argentino o latinoamericano

Las semanas de examen (13, 26, 39, 52) no traen obra nueva: repasan las de su estación.
Lo controla tools/curso/check_curso.py.
"""


def o(autor, obra, año, tipo, por_que, dp=False, arg=False):
    return {"autor": autor, "obra": obra, "año": año, "tipo": tipo, "por_que": por_que, "dp": dp, "arg": arg}


LITERATURA = {
    # ------------------------------------------------ La Antigüedad
    1: [
        o("Jostein Gaarder", "El mundo de Sofía", 1991, "novela",
          "Una chica recibe dos preguntas en el buzón («¿Quién sos?», «¿De dónde viene el mundo?»): el asombro como comienzo, y la novela recorre la historia de la filosofía que vas a estudiar."),
        o("Antoine de Saint-Exupéry", "El principito", 1943, "novela",
          "Los adultos que dan todo por obvio frente al chico que pregunta: la costumbre contra el asombro.", dp=False),
    ],
    2: [
        o("Hesíodo", "Teogonía", -700, "poema",
          "El origen del mundo contado como genealogía de dioses: el mito del que se separan los milesios.", dp=True),
        o("Ovidio", "Metamorfosis, libro XV", 8, "poema",
          "Pitágoras aparece como personaje y da un largo discurso sobre la transmigración de las almas y el cambio de todas las cosas.", dp=True),
    ],
    3: [
        o("Lucrecio", "De la naturaleza de las cosas", -55, "poema",
          "El atomismo de Demócrito y Epicuro en verso: átomos y vacío, nada nace de la nada.", dp=True),
        o("Hermann Hesse", "Siddhartha", 1922, "novela",
          "El río que siempre es el mismo y siempre otro le enseña al protagonista la unidad de los contrarios: Heráclito por otro camino."),
        o("Jorge Luis Borges", "«La perpetua carrera de Aquiles y la tortuga» y «Avatares de la tortuga» (Discusión)", 1932, "ensayo literario",
          "Borges cuenta la paradoja de Zenón y la persigue por la historia de la filosofía.", arg=True),
    ],
    4: [
        o("Lewis Carroll", "«Lo que la tortuga le dijo a Aquiles»", 1895, "diálogo",
          "Publicado en la revista *Mind*: la tortuga acepta las premisas de un *modus ponens* pero no la conclusión, y obliga a Aquiles a agregar premisas al infinito. La pregunta de qué es «seguirse».", dp=True),
        o("Arthur Conan Doyle", "Estudio en escarlata", 1887, "novela",
          "Lo que Holmes llama «deducción» suele ser inducción o abducción: un buen caso para separar los tipos de razonamiento.", dp=True),
    ],
    5: [
        o("Aristófanes", "Las nubes", -423, "teatro",
          "Sócrates caricaturizado como un sofista que enseña a ganar cualquier discusión: la imagen que Platón quiere desmentir en la *Apología*.", dp=True),
        o("Platón", "Apología de Sócrates", -390, "diálogo",
          "El juicio contado como drama: la defensa, la condena y el «una vida sin examen no merece ser vivida». La filosofía como literatura.", dp=True),
    ],
    6: [
        o("William Wordsworth", "Oda: Indicios de inmortalidad", 1807, "poema",
          "El alma viene de otra vida y el niño todavía la recuerda: la reminiscencia platónica en el Romanticismo inglés.", dp=True),
        o("Platón", "Fedón (la muerte de Sócrates)", -380, "diálogo",
          "La última conversación antes de la cicuta: los argumentos por la inmortalidad del alma, en una de las escenas más famosas de la literatura griega.", dp=True),
    ],
    7: [
        o("José Saramago", "La caverna", 2000, "novela",
          "Un alfarero y un shopping que esconde, en el subsuelo, la caverna de Platón (el epígrafe es de la *República*)."),
        o("Aldous Huxley", "Un mundo feliz", 1932, "novela",
          "Una sociedad ordenada por castas, con la verdad administrada desde arriba: para discutir la ciudad justa, el filósofo-rey y la «noble mentira».", dp=False),
    ],
    8: [
        o("Jorge Luis Borges", "«El idioma analítico de John Wilkins» (Otras inquisiciones)", 1952, "ensayo literario",
          "Una enciclopedia china imaginaria que divide a los animales en «pertenecientes al emperador», «embalsamados»…: ¿hay categorías naturales o todas son arbitrarias? Aristóteles contra la clasificación caprichosa.", arg=True),
        o("Mary Shelley", "Frankenstein", 1818, "novela",
          "Materia, forma y una «causa eficiente» humana: sirve para preguntar con las cuatro causas qué es la criatura y para qué fue hecha.", dp=True),
    ],
    9: [
        o("Lewis Carroll", "Alicia en el país de las maravillas", 1865, "novela",
          "La merienda del Sombrerero y la discusión del gato de Cheshire están llenas de *non sequiturs* y de inversiones («decir lo que pienso» no es «pensar lo que digo»): un laboratorio de falacias.", dp=True),
        o("Jonathan Swift", "Una modesta proposición", 1729, "ensayo literario",
          "Propone, con frialdad lógica, comerse a los hijos de los pobres: la sátira como reducción al absurdo de un argumento económico.", dp=True),
    ],
    10: [
        o("Homero", "Ilíada", -750, "poema",
          "La *areté* heroica de Aquiles (fuerza, honor, cólera) contra la virtud que Aristóteles pone en el término medio.", dp=True),
        o("Jane Austen", "Orgullo y prejuicio", 1813, "novela",
          "Para Alasdair MacIntyre (*Tras la virtud*, cap. 16), Austen es la última gran voz de la ética de las virtudes: el carácter se forma corrigiendo excesos, como el orgullo y el prejuicio.", dp=True),
    ],
    11: [
        o("Sófocles", "Edipo rey", -429, "teatro",
          "La tragedia que Aristóteles pone de modelo en la *Poética*: la peripecia, el reconocimiento y la catarsis por compasión y temor.", dp=True),
        o("Umberto Eco", "El nombre de la rosa", 1980, "novela",
          "Una abadía mata por el segundo libro de la *Poética*, el perdido sobre la comedia: ¿es peligrosa la risa? Platón y Aristóteles sobre el arte, en un policial medieval."),
    ],
    12: [
        o("Marguerite Yourcenar", "Memorias de Adriano", 1951, "novela",
          "El emperador, cerca de la muerte, escribe con la serenidad de un estoico y el gusto de un epicúreo: las dos escuelas como formas de vida."),
        o("Séneca", "Fedra", 50, "teatro",
          "Las tragedias del filósofo estoico muestran lo que pasa cuando la pasión le gana a la razón.", dp=True),
    ],
    13: [],
    # ------------------------------------------------ Del Medioevo a la Modernidad
    14: [
        o("Agustín de Hipona", "Confesiones", 400, "testimonio",
          "La primera gran autobiografía interior: el robo de las peras, la conversión en el jardín y, en el libro XI, la pregunta por el tiempo.", dp=True),
        o("Dante Alighieri", "Divina comedia, Paraíso", 1321, "poema",
          "La subida hacia la luz y el Uno, con la imaginería neoplatónica que pasa por Agustín.", dp=True),
    ],
    15: [
        o("Boecio", "La consolación de la filosofía", 524, "diálogo",
          "En la cárcel, esperando la ejecución, Boecio recibe a la Filosofía en forma de mujer: prosa y verso sobre la fortuna, el mal y la libertad.", dp=True),
        o("Abelardo y Eloísa", "Cartas", 1132, "testimonio",
          "El mayor dialéctico del siglo XII y su alumna cuentan su historia de amor y castigo: el filósofo de los universales, en primera persona.", dp=True),
    ],
    16: [
        o("Jorge Luis Borges", "«La busca de Averroes» (El Aleph)", 1949, "cuento",
          "Averroes no puede traducir «tragedia» y «comedia» de la *Poética* porque en su mundo no hay teatro: el comentador de Aristóteles y los límites de una cultura.", arg=True),
        o("Las mil y una noches", "(anónimo; versión de Galland)", 1704, "cuento",
          "El mundo de Bagdad y Córdoba donde se traducía y comentaba a Aristóteles: el marco cultural de Avicena y Averroes.", dp=True),
    ],
    17: [
        o("Dante Alighieri", "Divina comedia, Paraíso, cantos X-XIII", 1321, "poema",
          "Tomás de Aquino es personaje: presenta a los sabios del cielo del Sol. La teología tomista hecha poema.", dp=True),
    ],
    18: [
        o("Umberto Eco", "El nombre de la rosa", 1980, "novela",
          "Guillermo de Baskerville, el detective, está inspirado en Ockham y en Bacon; el final («de la rosa nos quedan solo los nombres») es una tesis nominalista."),
        o("Jorge Luis Borges", "«Funes el memorioso» (Ficciones)", 1942, "cuento",
          "Funes recuerda cada hoja de cada árbol y no puede pensar «perro» en general: los universales y el nominalismo llevados al extremo.", arg=True),
    ],
    19: [
        o("Tomás Moro", "Utopía", 1516, "novela",
          "La isla sin propiedad privada, contada por un viajero del Nuevo Mundo: el Renacimiento piensa la sociedad ideal.", dp=True),
        o("William Shakespeare", "La tempestad", 1611, "teatro",
          "Calibán, el habitante original de la isla, y el discurso de Gonzalo, que sale casi textual de «De los caníbales» de Montaigne: la discusión de Las Casas y Sepúlveda en el teatro.", dp=True),
        o("Bertolt Brecht", "Vida de Galileo", 1943, "teatro",
          "La ciencia nueva contra la autoridad, y la retractación: ¿qué le debe el científico a la verdad?"),
    ],
    20: [
        o("Nicolás Maquiavelo", "La mandrágora", 1518, "teatro",
          "La comedia del autor de *El príncipe*: un engaño bien calculado donde todos consiguen lo que quieren. El fin y los medios, con humor.", dp=True),
        o("William Golding", "El señor de las moscas", 1954, "novela",
          "Unos chicos en una isla sin adultos: el estado de naturaleza de Hobbes, la guerra de todos contra todos y la necesidad de un poder común."),
    ],
    21: [
        o("Pedro Calderón de la Barca", "La vida es sueño", 1635, "teatro",
          "Segismundo no sabe si está despierto: el argumento del sueño, escrito casi al mismo tiempo que las *Meditaciones*.", dp=True),
        o("Jorge Luis Borges", "«Las ruinas circulares» (Ficciones)", 1940, "cuento",
          "Un hombre sueña a otro hombre hasta hacerlo real, y descubre que él también es soñado: la duda de Descartes sin un Dios que la detenga.", arg=True),
    ],
    22: [
        o("Voltaire", "Cándido o el optimismo", 1759, "novela",
          "El doctor Pangloss repite que vivimos en el mejor de los mundos posibles mientras todo sale mal: la sátira de Leibniz.", dp=True),
        o("Jorge Luis Borges", "«Spinoza» y «Baruch Spinoza» (poemas)", 1964, "poema",
          "El pulidor de lentes que «labra a Dios» en la penumbra: un retrato del *Deus sive natura*.", arg=True),
    ],
    23: [
        o("Jorge Luis Borges", "«Tlön, Uqbar, Orbis Tertius» (Ficciones)", 1940, "cuento",
          "Un planeta inventado donde el idealismo de Berkeley es el sentido común: las cosas existen solo mientras se las percibe.", arg=True),
        o("Laurence Sterne", "Tristram Shandy", 1759, "novela",
          "Una novela que se desarma siguiendo la asociación de ideas del *Ensayo* de Locke, al que cita.", dp=True),
    ],
    24: [
        o("Luigi Pirandello", "Uno, ninguno y cien mil", 1926, "novela",
          "Un hombre descubre que no tiene un yo, sino tantos como quienes lo miran: el yo como «haz de percepciones» de Hume.", dp=True),
        o("Jorge Luis Borges", "«Nueva refutación del tiempo» (Otras inquisiciones)", 1952, "ensayo literario",
          "Parte de Berkeley y Hume para negar el tiempo y el yo, y termina: «El tiempo es la sustancia de que estoy hecho».", arg=True),
    ],
    25: [
        o("Montesquieu", "Cartas persas", 1721, "novela",
          "Dos persas en París escriben a su casa: la mirada extranjera muestra que las leyes y las costumbres son convenciones.", dp=True),
        o("Daniel Defoe", "Robinson Crusoe", 1719, "novela",
          "Un hombre solo trabaja la tierra y la hace suya: la propiedad por el trabajo de Locke, y el estado de naturaleza optimista.", dp=True),
        o("Jean-Jacques Rousseau", "Emilio", 1762, "novela",
          "La educación de un chico según la naturaleza: el «hombre natural» de Rousseau, en forma de novela pedagógica.", dp=True),
    ],
    26: [],
    # ------------------------------------------------ De Kant al siglo XX
    27: [
        o("Heinrich von Kleist", "Carta a Wilhelmine von Zenge (22 de marzo de 1801) y «Sobre el teatro de marionetas»", 1801, "ensayo literario",
          "Kleist lee a Kant y entra en crisis: si no podemos conocer la cosa en sí, toda verdad es la de unos anteojos verdes. Es la «crisis kantiana» más famosa de la literatura.", dp=True),
        o("Thomas De Quincey", "Los últimos días de Immanuel Kant", 1827, "ensayo literario",
          "El filósofo de las rutinas, contado en su vejez: una biografía que Borges admiraba.", dp=True),
    ],
    28: [
        o("Heinrich von Kleist", "Michael Kohlhaas", 1810, "novela",
          "Un comerciante busca justicia con un rigor absoluto y termina en el crimen: ¿hasta dónde vale el deber sin mirar las consecuencias?", dp=True),
        o("Mark Twain", "Las aventuras de Huckleberry Finn", 1884, "novela",
          "Huck decide no denunciar a Jim, el esclavo que escapa, aunque «su conciencia» le dice que debe: Jonathan Bennett lo usa (1974) para discutir la moral del principio contra la simpatía.", dp=True),
    ],
    29: [
        o("Sófocles", "Antígona", -441, "teatro",
          "Antígona entierra a su hermano contra la ley de Creonte: Hegel la lee en la *Fenomenología* como el choque de dos derechos, la familia y el Estado.", dp=True),
        o("Johann Wolfgang von Goethe", "Fausto", 1808, "teatro",
          "«En el principio era la acción»: el espíritu que se hace a sí mismo a través de sus errores, la gran obra del idealismo alemán.", dp=True),
    ],
    30: [
        o("Thomas Mann", "Los Buddenbrook", 1901, "novela",
          "Thomas Buddenbrook lee a Schopenhauer y por un momento la muerte deja de asustarlo (parte X, cap. 5): la voluntad y su negación.", dp=True),
        o("Søren Kierkegaard", "Diario de un seductor (en O lo uno o lo otro)", 1843, "novela",
          "El estadio estético hecho novela: el seductor que vive de instantes y no elige nunca.", dp=True),
    ],
    31: [
        o("Charles Dickens", "Tiempos difíciles", 1854, "novela",
          "El señor Gradgrind educa con «hechos, nada más que hechos»: la caricatura del utilitarismo, y lo que deja afuera.", dp=True),
        o("Fiódor Dostoievski", "Los hermanos Karamázov (la rebelión de Iván, libro V)", 1880, "novela",
          "¿Aceptarías la felicidad de todos a cambio de la tortura de un solo chico? La objeción clásica al cálculo de la utilidad.", dp=True),
    ],
    32: [
        o("Émile Zola", "Germinal", 1885, "novela",
          "La huelga de los mineros del norte de Francia: explotación, conciencia de clase y lucha.", dp=True),
        o("Roberto Arlt", "Los siete locos", 1929, "novela",
          "Una sociedad secreta quiere financiar la revolución con prostíbulos: el Buenos Aires de la crisis, entre el anarquismo y el fascismo.", dp=True, arg=True),
    ],
    33: [
        o("Fiódor Dostoievski", "Crimen y castigo", 1866, "novela",
          "Raskólnikov mata porque cree que los hombres extraordinarios están más allá del bien y del mal, veinte años antes del superhombre de Nietzsche.", dp=True),
        o("Hermann Hesse", "Demian", 1919, "novela",
          "Un muchacho rompe con la moral de su casa para hacerse a sí mismo: Nietzsche leído por una generación entera."),
    ],
    34: [
        o("Lewis Carroll", "A través del espejo, cap. VII", 1871, "novela",
          "«No veo a nadie en el camino.» «¡Ojalá tuviera esos ojos, para ver a Nadie!» El chiste de tratar «nadie» como un nombre es el problema que Russell resuelve con su teoría de las descripciones.", dp=True),
        o("Lewis Carroll", "A través del espejo, cap. VI (Humpty Dumpty)", 1871, "novela",
          "«Cuando uso una palabra, significa lo que yo quiero que signifique»: sentido, referencia y quién manda en el lenguaje.", dp=True),
    ],
    35: [
        o("Ursula K. Le Guin", "«Los que se alejan de Omelas»", 1973, "cuento",
          "Le Guin cuenta que la sacó de un pasaje de William James (*El filósofo moral y la vida moral*): una ciudad feliz que depende del sufrimiento de un chico."),
        o("Henry James", "Otra vuelta de tuerca", 1898, "novela",
          "¿Hay fantasmas o no? La novela del hermano de William James deja la verdad en manos de las consecuencias de cada lectura.", dp=True),
    ],
    36: [
        o("Hugo von Hofmannsthal", "Carta de Lord Chandos", 1902, "ensayo literario",
          "Un escritor ya no puede usar las palabras abstractas: «se me deshacían en la boca como hongos podridos». La crisis del lenguaje de la Viena de Wittgenstein.", dp=True),
        o("Robert Musil", "Las tribulaciones del estudiante Törless", 1906, "novela",
          "Un alumno se choca con lo que no se puede decir (los números imaginarios, la crueldad): Musil se doctoró con una tesis sobre Mach, el antecesor del Círculo de Viena.", dp=True),
    ],
    37: [
        o("Marcel Proust", "Por el camino de Swann", 1913, "novela",
          "La magdalena: el tiempo vivido y el recuerdo como se dan a la conciencia, descriptos desde adentro, como pide la fenomenología.", dp=True),
    ],
    38: [
        o("León Tolstói", "La muerte de Iván Ilich", 1886, "novela",
          "Heidegger la cita en *Ser y tiempo* (§51, nota): un hombre que vivió como «se» vive descubre que va a morir, y que su muerte es suya.", dp=True),
        o("Rainer Maria Rilke", "Elegías de Duino", 1923, "poema",
          "El poeta que Heidegger más leyó: la finitud, la muerte y el «estar en el mundo».", dp=True),
    ],
    39: [],
    # ------------------------------------------------ La filosofía de hoy
    40: [
        o("Albert Camus", "El extranjero", 1942, "novela",
          "Meursault no finge lo que no siente y la sociedad lo condena por eso: el absurdo."),
        o("Jean-Paul Sartre", "La náusea", 1938, "novela",
          "Roquentin descubre ante la raíz de un castaño que la existencia es pura contingencia: la existencia precede a la esencia, hecha novela."),
        o("Ernesto Sabato", "El túnel", 1948, "novela",
          "La confesión de un pintor que mató a la única persona que lo entendía: el existencialismo argentino, que Camus elogió.", arg=True),
    ],
    41: [
        o("Jorge Luis Borges", "«Pierre Menard, autor del Quijote» (Ficciones)", 1939, "cuento",
          "Menard reescribe palabra por palabra el *Quijote* y el texto significa otra cosa: el sentido depende del horizonte del lector, la tesis de la hermenéutica.", arg=True),
        o("Julio Cortázar", "Historias de cronopios y de famas", 1962, "cuento",
          "«Instrucciones para subir una escalera»: las reglas de un juego de lenguaje, escritas como si nadie las supiera.", arg=True),
    ],
    42: [
        o("Stanisław Lem", "Solaris", 1961, "novela",
          "Un siglo de científicos estudia un océano vivo y cada teoría cae: los límites de un paradigma ante lo que no encaja."),
        o("Jorge Luis Borges", "«Del rigor en la ciencia» (El hacedor)", 1960, "cuento",
          "El mapa del tamaño del imperio: qué es un modelo y por qué no puede ser la realidad.", arg=True),
    ],
    43: [
        o("Ryūnosuke Akutagawa", "«En el bosque»", 1922, "cuento",
          "Un crimen contado por siete testigos que no coinciden (es la base de *Rashomon*): ¿qué se puede saber por testimonio?", dp=True),
        o("Adolfo Bioy Casares", "La invención de Morel", 1940, "novela",
          "Un prófugo se enamora de una mujer que resulta ser una imagen grabada: percepción, creencia justificada y realidad.", arg=True),
    ],
    44: [
        o("Franz Kafka", "La metamorfosis", 1915, "novela",
          "Gregor Samsa sigue siendo él en un cuerpo de insecto: ¿qué es la mente, si no es el cuerpo?", dp=True),
        o("Philip K. Dick", "¿Sueñan los androides con ovejas eléctricas?", 1968, "novela",
          "Un test de empatía para distinguir humanos de androides: funcionalismo, conciencia y el problema de las otras mentes."),
    ],
    45: [
        o("Jorge Luis Borges", "«Borges y yo» (El hacedor) y «El otro» (El libro de arena)", 1960, "cuento",
          "Borges conversa con su doble y con su yo joven: ¿qué hace que una persona sea la misma a lo largo del tiempo?", arg=True),
        o("Robert Louis Stevenson", "El extraño caso del doctor Jekyll y míster Hyde", 1886, "novela",
          "Dos personas en un cuerpo: identidad personal y responsabilidad.", dp=True),
        o("Jorge Luis Borges", "«El jardín de senderos que se bifurcan» (Ficciones)", 1941, "cuento",
          "Una novela laberinto donde se cumplen todos los futuros posibles: los mundos posibles y la modalidad.", arg=True),
    ],
    46: [
        o("Franz Kafka", "El proceso", 1925, "novela",
          "Josef K. es juzgado por un tribunal que nunca ve: el poder anónimo de la burocracia, leído junto a Foucault.", dp=True),
        o("George Orwell", "1984", 1949, "novela",
          "La vigilancia total y el control del lenguaje (la neolengua): el panóptico y el poder sobre la verdad.", dp=True),
    ],
    47: [
        o("Ursula K. Le Guin", "Los desposeídos", 1974, "novela",
          "Dos mundos, uno anarquista y pobre, otro capitalista y rico: ¿qué distribución es justa?"),
        o("Primo Levi", "Si esto es un hombre", 1947, "testimonio",
          "La vida en Auschwitz, contada por un químico: el testimonio que acompaña la pregunta de Arendt por el mal."),
    ],
    48: [
        o("Sor Juana Inés de la Cruz", "Respuesta a sor Filotea de la Cruz", 1691, "ensayo literario",
          "La monja novohispana defiende el derecho de las mujeres a estudiar: el primer texto feminista de América.", dp=True, arg=True),
        o("Virginia Woolf", "Un cuarto propio", 1929, "ensayo literario",
          "Si Shakespeare hubiera tenido una hermana igual de genial: las condiciones materiales de la creación y el género.", dp=True),
        o("Margaret Atwood", "El cuento de la criada", 1985, "novela",
          "Una teocracia que reduce a las mujeres a su función reproductiva: el cuerpo como asunto político."),
    ],
    49: [
        o("Domingo Faustino Sarmiento", "Facundo", 1845, "ensayo literario",
          "«Civilización y barbarie»: la tesis que discute casi todo el pensamiento argentino posterior.", dp=True, arg=True),
        o("José Hernández", "Martín Fierro", 1872, "poema",
          "El gaucho perseguido por el Estado: Carlos Astrada lo lee como mito fundador en *El mito gaucho* (1948).", dp=True, arg=True),
        o("Leopoldo Marechal", "Adán Buenosayres", 1948, "novela",
          "Un poeta recorre Buenos Aires como un descenso metafísico: la búsqueda de lo americano.", arg=True),
        o("Juan Rulfo", "Pedro Páramo", 1955, "novela",
          "Un pueblo de muertos que hablan: el mundo que Kusch llama «estar» frente al «ser» europeo.", arg=True),
    ],
    50: [
        o("Oscar Wilde", "El retrato de Dorian Gray", 1890, "novela",
          "El prefacio («todo arte es completamente inútil») y el retrato que envejece en lugar del modelo: el arte por el arte y su precio.", dp=True),
        o("Thomas Mann", "La muerte en Venecia", 1912, "novela",
          "Un escritor entre lo apolíneo y lo dionisíaco: la belleza como orden y como abismo.", dp=True),
    ],
    51: [
        o("Mary Shelley", "Frankenstein", 1818, "novela",
          "¿Qué le debe un creador a lo que crea? La primera novela de la bioética.", dp=True),
        o("Kazuo Ishiguro", "Nunca me abandones", 2005, "novela",
          "Unos chicos criados para donar sus órganos: clonación, dignidad y sentido de una vida corta."),
        o("Kazuo Ishiguro", "Klara y el sol", 2021, "novela",
          "Una amiga artificial cuida a una chica enferma: ¿puede una IA querer?, ¿qué nos haría reemplazables?"),
    ],
    52: [],
}

EXAM_WEEKS = (13, 26, 39, 52)
