# -*- coding: utf-8 -*-
"""Más literatura para las semanas 1 a 39: Grecia, India y China antiguas,
helenísticos y Roma, el Medioevo cristiano, islámico y judío."""

from literatura import o

EXTRA = {
    # 1 · ¿Qué es la filosofía?
    1: [
        o('Clarice Lispector', 'La pasión según G. H.', 1964, 'novela',
          'Una mujer aplasta una cucaracha en el cuarto de servicio y, mirándola, se le vuelve extraño todo lo que daba por sabido: el asombro llevado al extremo, cuando lo cotidiano deja de ser obvio.', arg=True),
        o('Wisława Szymborska', '«El poeta y el mundo» (discurso del Nobel)', 1996, 'ensayo literario',
          'Szymborska elogia las dos palabras «no sé»: quien las dice en serio empieza a preguntar, y de ahí salen la ciencia y la poesía. Es la sabiduría humana de la Apología, en voz de una poeta.'),
        o('Popol Vuh (anónimo maya quiché)', 'Popol Vuh', 1554, 'poema',
          'Escrito hacia mediados del siglo XVI: los dioses hacen hombres de barro, de madera y por fin de maíz. Un relato de origen americano para ver qué es un mito y qué cambia cuando se pasa del mito al logos.', dp=True, arg=True),
    ],
    # 2 · Los milesios, Pitágoras y Jenófanes
    2: [
        o('Homero', 'Odisea, canto VIII', -725, 'poema',
          'El aedo Demódoco canta el adulterio de Ares y Afrodita, y los dioses se ríen del engaño: justo lo que Jenófanes le reprocha a Homero, haberles atribuido a los dioses robos, adulterios y mentiras.', dp=True),
        o('Leopoldo Lugones', '«Ensayo de una cosmogonía en diez lecciones» (Las fuerzas extrañas)', 1906, 'ensayo literario',
          'Cierra el libro de cuentos: un desconocido le explica al narrador, en diez lecciones, el origen del universo a partir de una sola sustancia y una fuerza. La búsqueda del arjé, en la prosa modernista argentina.', dp=True, arg=True),
        o('Italo Calvino', 'Las cosmicómicas', 1965, 'cuento',
          'Qfwfq, que estuvo ahí desde el principio, cuenta en «Todo en un punto» cómo era vivir antes del Big Bang: una cosmogonía con ciencia y humor, como la de los milesios frente a Hesíodo.'),
    ],
    # 3 · Heráclito, Parménides, Zenón y los atomistas
    3: [
        o('Parménides', 'Sobre la naturaleza (el proemio)', -475, 'poema',
          'La filosofía del ser está escrita en hexámetros: el joven viaja en un carro llevado por yeguas, pasa las puertas de la Noche y el Día, y una diosa le revela la vía de la verdad y la de la opinión.', dp=True),
        o('Jorge Manrique', 'Coplas por la muerte de su padre', 1476, 'poema',
          '«Nuestras vidas son los ríos / que van a dar en la mar, / que es el morir»: el río de Heráclito, que todo se lo lleva, en la gran elegía castellana.', dp=True),
        o('T. S. Eliot', 'Cuatro cuartetos', 1943, 'poema',
          'El primer cuarteto, «Burnt Norton», lleva dos epígrafes de Heráclito en griego («el camino hacia arriba y hacia abajo es uno y el mismo»): el poema piensa el tiempo y el punto quieto del mundo que gira.'),
    ],
    # 4 · Lógica I: validez, verdad y forma
    4: [
        o('Edgar Allan Poe', '«Los crímenes de la calle Morgue»', 1841, 'cuento',
          'El primer cuento policial empieza con una reflexión sobre el «análisis» (el ajedrez contra el whist) y Dupin resuelve el caso descartando hipótesis: un buen ejercicio para distinguir deducción, inducción y abducción.', dp=True),
        o('H. Bustos Domecq (Borges y Bioy Casares)', 'Seis problemas para don Isidro Parodi', 1942, 'cuento',
          'Parodi resuelve crímenes desde una celda de la Penitenciaría, sin ver nada, solo escuchando a los que lo visitan: la inferencia pura, que separa lo que se sigue de los relatos de lo que los testigos creen ver.', arg=True),
        o('Agatha Christie', 'El asesinato de Roger Ackroyd', 1926, 'novela',
          'La sorpresa final depende de una premisa que el lector nunca pone en duda (la confiabilidad del narrador): el razonamiento era válido, lo falso era una premisa escondida.'),
    ],
    # 5 · La India antigua: Upanishads, Buda y Mahavira
    5: [
        o('Bhagavad Gita (anónimo, en el Mahabharata)', 'Bhagavad Gita', -200, 'poema',
          'Antes de la batalla, Arjuna no quiere pelear y Krishna le enseña que el ātman no mata ni muere y que hay que actuar sin apego a los frutos de la acción: karma y liberación en forma de diálogo en verso.', dp=True),
        o('Aśvaghoṣa', 'Vida de Buda (Buddhacarita)', 100, 'poema',
          'El príncipe Siddhārtha sale del palacio y ve un viejo, un enfermo, un muerto y un asceta: el poema épico cuenta el descubrimiento del sufrimiento que lleva a las cuatro nobles verdades.', dp=True),
        o('Octavio Paz', 'Vislumbres de la India', 1995, 'ensayo literario',
          'El poeta mexicano, que fue embajador en Nueva Delhi, compara el ātman de las Upanishads con la vacuidad budista y el nirvana con la mística occidental.', arg=True),
        o('Rabindranath Tagore', 'Gitanjali (Ofrenda lírica)', 1910, 'poema',
          'Los poemas que le dieron el Nobel cantan la unidad entre el alma y lo divino que está en todas las cosas: la herencia de las Upanishads en la poesía bengalí moderna.', dp=True),
    ],
    # 6 · China antigua: Confucio, Laozi, Mozi y Zhuangzi
    6: [
        o('Clásico de la poesía (Shijing, anónimo)', 'Libro de las odas', -600, 'poema',
          'La antología que, según la tradición, ordenó Confucio: en las Analectas (2.2) la resume así, «no tener pensamientos torcidos». La poesía como escuela de los ritos (li) y del buen carácter.', dp=True),
        o('Li Bai', '«Bebiendo solo bajo la luna»', 750, 'poema',
          'El poeta brinda con la luna y con su sombra y se deja llevar: la espontaneidad taoísta, el vino y la naturaleza contra la rigidez de los ritos.', dp=True),
        o('Jorge Luis Borges', '«La muralla y los libros» (Otras inquisiciones)', 1952, 'ensayo literario',
          'El emperador que mandó construir la muralla china también mandó quemar los libros anteriores: Borges piensa ese gesto, que es la política legista contra los letrados confucianos.', arg=True),
        o('Maxine Hong Kingston', 'La mujer guerrera', 1976, 'testimonio',
          'Una hija de inmigrantes chinos en California crece entre las historias de su madre (la tía sin nombre, la guerrera Fa Mu Lan): la piedad filial confuciana vista desde las mujeres a las que exigía callar.'),
    ],
    # 7 · Los sofistas
    7: [
        o('Tucídides', 'Historia de la guerra del Peloponeso, el diálogo de los melios (V 84-116)', -400, 'diálogo',
          'Los atenienses les dicen a los habitantes de Melos que «los fuertes hacen lo que pueden y los débiles sufren lo que deben»: la tesis de Trasímaco y Calicles puesta en boca de una potencia real.', dp=True),
        o('Eurípides', 'Las troyanas', -415, 'teatro',
          'Helena se defiende ante Menelao con argumentos de sofista y Hécuba le responde punto por punto: el mismo caso del Encomio de Gorgias, estrenado casi en los mismos años.', dp=True),
        o('William Shakespeare', 'Julio César', 1623, 'teatro',
          'Bruto convence a la multitud de que el asesinato era justo y enseguida Marco Antonio, con «Bruto es un hombre honorable», la da vuelta: el poder de la retórica para hacer más fuerte el argumento más débil.', dp=True),
        o('Baltasar Gracián', 'Oráculo manual y arte de prudencia', 1647, 'ensayo literario',
          'Aforismos para triunfar en la corte: «las cosas no pasan por lo que son, sino por lo que parecen» (99). La apariencia y la convención (nómos) por encima de la verdad, como enseñaban los sofistas.', dp=True),
    ],
    # 8 · Sócrates
    8: [
        o('Jenofonte', 'Recuerdos de Sócrates', -371, 'testimonio',
          'La otra fuente directa: un Sócrates más práctico y menos irónico que el de Platón, que conversa con generales y artesanos. Sirve para ver el problema de las fuentes.', dp=True),
        o('Bertolt Brecht', '«Sócrates herido» (Historias de almanaque)', 1949, 'cuento',
          'En la batalla, Sócrates se clava una espina, no puede escapar y, por gritar sentado en el suelo, lo toman por un héroe que resiste: la ironía socrática, usada para desarmar la idea de heroísmo.'),
        o('Antonio Machado', 'Juan de Mairena', 1936, 'ensayo literario',
          'Un profesor apócrifo de retórica enseña preguntando, con ironía, y desconfía de lo que «todo el mundo sabe»: «la verdad es la verdad, dígala Agamenón o su porquero». Un Sócrates andaluz.', dp=True),
    ],
    # 9 · Platón I: el alma y el conocimiento
    9: [
        o('Platón', 'Fedro (el carro alado)', -370, 'diálogo',
          'El alma es un auriga con dos caballos que, antes de nacer, vio las Ideas desde el lomo del cielo; la belleza de este mundo le hace recordar lo que vio. El mito que sostiene la anámnesis.', dp=True),
        o('Fray Luis de León', '«Oda a Francisco Salinas»', 1631, 'poema',
          'Al oír la música del organista ciego, el alma «torna a cobrar el tino / y memoria perdida / de su origen primera esclarecida»: la reminiscencia platónica en el Siglo de Oro.', dp=True),
        o('Marcel Proust', 'Por el camino de Swann', 1913, 'novela',
          'La magdalena mojada en el té le devuelve al narrador, entero, el Combray de su infancia: un recuerdo que no se busca y aparece, para comparar con el aprender como recordar del Menón.', dp=True),
        o('Emily Brontë', '«No es cobarde mi alma»', 1850, 'poema',
          'El último poema de Brontë afirma un alma que no puede morir: «no hay lugar para la Muerte». La inmortalidad del alma del Fedón, como certeza íntima.', dp=True),
    ],
    # 10 · Platón II: la justicia (República I-IV)
    10: [
        o('Ursula K. Le Guin', '«Los que se alejan de Omelas»', 1973, 'cuento',
          'Una ciudad perfectamente feliz cuya dicha depende de un chico encerrado en un sótano: ¿es justa esa ciudad?, ¿se puede definir la justicia por la armonía del conjunto?'),
        o('Roberto Arlt', 'Los siete locos', 1929, 'novela',
          'El Astrólogo planea una sociedad secreta fundada en una mentira, porque los hombres necesitan creer: la «noble mentira» de la República, en la Buenos Aires de los años veinte.', dp=True, arg=True),
        o('J. R. R. Tolkien', 'El señor de los anillos', 1954, 'novela',
          'El anillo hace invisible a quien lo usa y lo corrompe de a poco: casi el anillo de Giges, con la pregunta de Glaucón (¿alguien seguiría siendo justo si nadie lo viera?).'),
    ],
    # 11 · Platón III: el filósofo y el Bien (República V-VII, Banquete)
    11: [
        o('Sor Juana Inés de la Cruz', 'Primero sueño', 1692, 'poema',
          'Mientras el cuerpo duerme, el alma sube a lo alto para conocerlo todo de una vez, se deslumbra como ante el sol y tiene que ir por grados: el ascenso de la caverna y la línea dividida, en la mayor poeta del barroco americano.', dp=True, arg=True),
        o('León Hebreo', 'Diálogos de amor', 1535, 'diálogo',
          'Filón y Sofía discuten qué es el amor y cómo sube de lo bello sensible a la belleza divina: la escalera de Diotima en el Renacimiento (el Inca Garcilaso los tradujo al castellano en 1590).', dp=True),
        o('E. M. Forster', '«La máquina se detiene»', 1909, 'cuento',
          'La humanidad vive bajo tierra y conoce el mundo por pantallas; un hombre sale a la superficie y vuelve para contarlo, y nadie le cree: la caverna de Platón como ciencia ficción.'),
    ],
    # 12 · Platón IV: el conocimiento y la crítica de las Ideas
    12: [
        o('Jorge Luis Borges', '«Tlön, Uqbar, Orbis Tertius» (Ficciones)', 1940, 'cuento',
          'En Tlön las cosas son lo que se percibe de ellas: el escándalo de las nueve monedas que se pierden y reaparecen muestra qué pasa si el conocimiento es percepción, como propone Teeteto.', arg=True),
        o('Adolfo Bioy Casares', 'La invención de Morel', 1940, 'novela',
          'Un fugitivo se enamora de una mujer que resulta ser una imagen proyectada por una máquina: copia, simulacro y lo que no es pero parece ser, el problema del Sofista.', arg=True),
        o('Lewis Carroll', 'A través del espejo', 1871, 'novela',
          'El Rey se asombra de que Alicia pueda ver a «Nadie» en el camino, y Humpty Dumpty decide qué significan las palabras: el no ser tratado como algo, el enredo que el Sofista intenta desatar.', dp=True),
        o('Julio Verne', 'Veinte mil leguas de viaje submarino', 1870, 'novela',
          'El capitán Nemo lleva a Aronnax a caminar por el fondo del mar hasta las ruinas de la Atlántida: el mito del Timeo y el Critias, convertido en paisaje.', dp=True),
    ],
    # 14 · Aristóteles I: categorías y sustancia
    14: [
        o('Julio Cortázar', 'Historias de cronopios y de famas', 1962, 'cuento',
          'La humanidad dividida en tres especies (cronopios, famas y esperanzas) con sus costumbres: una clasificación en género y especie hecha en broma, para preguntarse qué hace que algo sea lo que es.', arg=True),
        o('Gertrude Stein', '«Sacred Emily» (Geography and Plays)', 1922, 'poema',
          'El verso «una rosa es una rosa es una rosa»: la definición que solo repite, para pensar qué agrega decir el género y la especie de una cosa.', dp=True),
        o('Georges Perec', 'Pensar/Clasificar', 1985, 'ensayo literario',
          'Perec ensaya maneras de ordenar libros, palabras y cosas y muestra que toda clasificación deja restos: la pregunta por las categorías, con humor.'),
        o('Pablo Neruda', 'Odas elementales', 1954, 'poema',
          'Odas a la cebolla, al tomate, a los calcetines: la poesía que celebra esta cosa singular y no la especie, como la sustancia primera de las Categorías («este hombre, este caballo»).', arg=True),
    ],
    # 15 · Aristóteles II: la naturaleza (Física)
    15: [
        o('Thornton Wilder', 'El puente de San Luis Rey', 1927, 'novela',
          'En 1714 se corta un puente en el Perú y mueren cinco personas; fray Junípero investiga sus vidas para probar que no fue azar sino designio. Azar, fortuna y finalidad, como en Física II.'),
        o('Jorge Luis Borges', '«La lotería en Babilonia» (Ficciones)', 1941, 'cuento',
          'Una lotería que crece hasta decidir todo lo que pasa en la ciudad: ¿hay azar, o el azar es solo una causa que no conocemos?', arg=True),
        o('Johann Wolfgang von Goethe', '«La metamorfosis de las plantas»', 1798, 'poema',
          'La elegía muestra cómo una sola forma se despliega de la semilla a la flor y el fruto: la naturaleza como forma que se realiza, el paso de la potencia al acto.', dp=True),
        o('Voltaire', 'Cándido o el optimismo', 1759, 'novela',
          'En el primer capítulo Pangloss enseña que «las narices se hicieron para llevar anteojos»: la burla de una teleología mal usada, que sirve para ver qué dice de verdad la causa final.', dp=True),
    ],
    # 16 · Aristóteles III: el ser y el alma (Metafísica, Acerca del alma)
    16: [
        o('Walt Whitman', 'Canto de mí mismo (Hojas de hierba)', 1855, 'poema',
          '«¿Me contradigo? Muy bien, me contradigo (soy inmenso, contengo multitudes)»: el desafío al principio de no contradicción, para probar la defensa de Aristóteles.', dp=True),
        o('Miguel de Unamuno', 'Niebla', 1914, 'novela',
          'Augusto Pérez va a ver a su autor, Unamuno, y le discute si existe: el ser se dice de muchas maneras, y el de un personaje de ficción es una de ellas.', dp=True),
        o('Heinrich von Kleist', '«Sobre el teatro de marionetas»', 1810, 'ensayo literario',
          'Un bailarín sostiene que las marionetas tienen más gracia que los hombres porque su «alma» está en su centro de gravedad: la relación entre el alma y el cuerpo que mueve.', dp=True),
        o('Philip K. Dick', '¿Sueñan los androides con ovejas eléctricas?', 1968, 'novela',
          'Un test de empatía separa a los humanos de los androides: ¿qué alma tiene algo que vive, siente y razona? Las tres almas de Acerca del alma frente a una máquina.'),
    ],
    # 17 · Lógica II: el silogismo y las falacias
    17: [
        o('Eugène Ionesco', 'El rinoceronte', 1959, 'teatro',
          'En el primer acto el Lógico enseña: «todos los gatos son mortales; Sócrates es mortal; luego Sócrates es un gato». Un silogismo inválido de manual, en el teatro del absurdo.'),
        o('Molière', 'El enfermo imaginario', 1673, 'teatro',
          'En la ceremonia final, el aspirante a médico explica que el opio hace dormir porque tiene una «virtud dormitiva»: la petición de principio, convertida en diploma.', dp=True),
        o('Miguel de Cervantes', 'Don Quijote de la Mancha, segunda parte, cap. 51', 1615, 'novela',
          'Sancho, gobernador, debe juzgar al hombre que jura que va a morir en la horca: si lo ahorcan dijo verdad y debía pasar, si no, mintió. Una paradoja lógica resuelta por misericordia.', dp=True),
        o('Joseph Heller', 'Trampa 22', 1961, 'novela',
          'El que pide la baja por loco demuestra que está cuerdo y tiene que seguir volando: un razonamiento circular hecho reglamento militar.'),
    ],
    # 18 · Aristóteles IV: la ética (Ética a Nicómaco)
    18: [
        o('León Tolstói', 'La muerte de Iván Ilich', 1886, 'novela',
          'Un juez que hizo todo «como corresponde» descubre, muriéndose, que su vida no fue buena: la pregunta por la eudaimonía, que no es cumplir con las convenciones.', dp=True),
        o('Michel de Montaigne', '«De la amistad» (Ensayos I 28)', 1580, 'ensayo literario',
          'Sobre su amigo La Boétie: «porque era él, porque era yo». La amistad perfecta, la que se quiere por el otro, como en los libros VIII y IX de la Ética.', dp=True),
        o('Ovidio', 'Metamorfosis, libro VII (Medea)', 8, 'poema',
          '«Veo lo mejor y lo apruebo, sigo lo peor»: Medea sabe que no debe y lo hace igual. La akrasia que Aristóteles le discute a Sócrates.', dp=True),
        o('Jorge Luis Borges', '«Los justos» (La cifra)', 1981, 'poema',
          '«Un hombre que cultiva su jardín…», «el que agradece que en la tierra haya música»: el poema enumera gente que hace el bien sin saberlo. La virtud como carácter en los actos de todos los días.', arg=True),
    ],
    # 19 · Aristóteles V: política, retórica y poética
    19: [
        o('Esquilo', 'Euménides (Orestíada)', -458, 'teatro',
          'Atenea funda el tribunal del Areópago para juzgar a Orestes: la ciudad reemplaza la venganza por la ley. El animal político, en el teatro.', dp=True),
        o('Lope de Vega', 'Arte nuevo de hacer comedias en este tiempo', 1609, 'poema',
          'Lope conoce las reglas de la Poética y explica en verso por qué no las sigue: escribe para que el público goce. Un debate con Aristóteles hecho por un dramaturgo.', dp=True),
        o('Toni Morrison', 'Beloved', 1987, 'novela',
          'El «maestro» de la plantación les hace anotar a sus alumnos las características humanas y animales de Sethe: la teoría de la esclavitud natural, vista desde quien la sufre.'),
    ],
    # 20 · Cínicos y cirenaicos
    20: [
        o('William Shakespeare', 'Timón de Atenas', 1623, 'teatro',
          'Apemanto, el filósofo cínico, se burla de los aduladores de Timón y come raíces; cuando Timón se arruina y se va al bosque, los dos discuten quién desprecia mejor al mundo.', dp=True),
        o('Miguel de Cervantes', '«El licenciado Vidriera» (Novelas ejemplares)', 1613, 'cuento',
          'Un estudiante que cree ser de vidrio va por la calle diciéndole a cada uno verdades incómodas, sin vergüenza ni respeto por las jerarquías: un Diógenes del Siglo de Oro.', dp=True),
        o('Oscar Wilde', 'El retrato de Dorian Gray', 1890, 'novela',
          'Lord Henry predica un «nuevo hedonismo»: vivir cada sensación, porque solo existe el momento. El placer del instante de Aristipo, y lo que le cuesta a Dorian.', dp=True),
    ],
    # 21 · Epicuro y el epicureísmo
    21: [
        o('Omar Jayyam', 'Rubaiyat', 1120, 'poema',
          'Cuartetas persas sobre el vino, la brevedad de la vida y el no saber qué hay después: gozar del presente sin miedo a los dioses ni al mañana.', dp=True),
        o('Garcilaso de la Vega', 'Soneto XXIII («En tanto que de rosa y azucena»)', 1543, 'poema',
          '«Coged de vuestra alegre primavera / el dulce fruto»: el carpe diem de Horacio en el soneto castellano.', dp=True),
        o('Walter Pater', 'Mario el epicúreo', 1885, 'novela',
          'Un joven romano del tiempo de Marco Aurelio busca la vida buena en la filosofía de Epicuro, el refinamiento de los sentidos y el cristianismo naciente.', dp=True),
        o('Philip Larkin', '«Aubade»', 1977, 'poema',
          'El poeta se despierta de madrugada con miedo a morir y rechaza el argumento de Epicuro («nadie racional puede temer lo que no va a sentir»): justo eso es lo que asusta. Una objeción en verso.'),
    ],
    # 22 · Los estoicos griegos: lógica, física y ética
    22: [
        o('Cleantes', 'Himno a Zeus', -250, 'poema',
          'El sucesor de Zenón canta al logos que gobierna todo y pide seguir el destino de buena gana: «guíame, Zeus», la física y la ética estoicas en una plegaria.', dp=True),
        o('Denis Diderot', 'Jacques el fatalista y su amo', 1796, 'novela',
          'Jacques repite que «todo lo que nos pasa de bueno y de malo aquí abajo está escrito allá arriba», y sin embargo actúa, elige y discute: el destino estoico y el argumento perezoso, en comedia.', dp=True),
        o('Jorge Luis Borges', '«Poema conjetural»', 1943, 'poema',
          'Laprida, perseguido por los montoneros, acepta su muerte: «al fin he descubierto la recóndita clave de mis años… mi destino sudamericano». Aceptar el destino como propio, a la manera estoica.', arg=True),
        o('Rudyard Kipling', '«Si…»', 1910, 'poema',
          '«Si podés encontrarte con el Triunfo y el Desastre y tratar igual a esos dos impostores»: la serenidad ante los indiferentes, el ideal del sabio estoico.', dp=True),
    ],
    # 23 · El estoicismo en Roma
    23: [
        o('Francisco de Quevedo', '«Miré los muros de la patria mía»', 1648, 'poema',
          'Todo lo que mira le recuerda la muerte: el soneto del lector y traductor de Epicteto y de Séneca, la meditación estoica sobre el tiempo en el barroco español.', dp=True),
        o('Lucano', 'Farsalia', 65, 'poema',
          'En la guerra civil, Catón es el sabio estoico que sigue a la virtud aunque pierda: «la causa vencedora agradó a los dioses, la vencida a Catón». Lucano era sobrino de Séneca.', dp=True),
        o('Tom Wolfe', 'Todo un hombre', 1998, 'novela',
          'Un joven preso en California encuentra por casualidad un libro de Epicteto y aprende a distinguir lo que depende de él de lo que no: el Enquiridión, leído en una cárcel moderna.'),
    ],
    # 24 · Los escépticos
    24: [
        o('Luciano de Samósata', 'Subasta de vidas', 165, 'diálogo',
          'Zeus y Hermes rematan a los filósofos como esclavos; el escéptico, al final, no sabe si lo compraron ni si existe quien lo compró: la epoché llevada a la sátira.', dp=True),
        o('Molière', 'El casamiento forzoso', 1664, 'teatro',
          'Sganarelle consulta a Marphurius, filósofo pirrónico que solo dice «parece»; harto, le pega con un palo y le contesta que quizás solo le parece que le pegó. ¿Se puede vivir sin creencias?', dp=True),
        o('Ryūnosuke Akutagawa', '«En el bosque»', 1922, 'cuento',
          'Un crimen contado por siete testigos, incluido el muerto, que no coinciden: no hay forma de decidir cuál es verdad, como en los modos escépticos sobre el desacuerdo.', dp=True),
        o('Antonio Machado', '«Proverbios y cantares» (Nuevas canciones)', 1924, 'poema',
          '«¿Tu verdad? No, la Verdad, / y ven conmigo a buscarla. / La tuya, guárdatela»: la búsqueda de la verdad contra la pura opinión de cada uno, para discutir qué separa al escéptico del relativista.', dp=True),
    ],
    # 25 · Plotino y el neoplatonismo
    25: [
        o('Charles Kingsley', 'Hipatia', 1853, 'novela',
          'La filósofa neoplatónica de Alejandría, que enseñaba matemática y la filosofía de Plotino, y su asesinato en 415: el fin del mundo pagano en una novela victoriana.', dp=True),
        o('Percy Bysshe Shelley', 'Adonais', 1821, 'poema',
          '«Lo Uno permanece, lo múltiple cambia y pasa»: en la elegía por Keats, el poeta muerto vuelve a la fuente de la que todo emana.', dp=True),
        o('San Juan de la Cruz', 'Noche oscura', 1618, 'poema',
          'El alma sale de noche, a escondidas, y se une con el Amado: el retorno y la unión mística, la herencia de Plotino pasada por el cristianismo.', dp=True),
    ],
    # 27 · Fe y razón: los primeros cristianos
    27: [
        o('Henryk Sienkiewicz', 'Quo vadis?', 1896, 'novela',
          'Petronio, refinado y escéptico, frente a los cristianos de Roma en tiempos de Nerón: la filosofía pagana y la fe nueva, cara a cara.', dp=True),
        o('Jorge Luis Borges', '«Tres versiones de Judas» (Ficciones)', 1944, 'cuento',
          'Un teólogo sueco razona con rigor hasta concluir que Dios se encarnó en Judas: la razón aplicada a la fe hasta el escándalo, el problema de Tertuliano.', arg=True),
        o('Shūsaku Endō', 'Silencio', 1966, 'novela',
          'Un jesuita portugués en el Japón del siglo XVII ve torturar a los cristianos y Dios calla: la fe que no puede apoyarse en razones.'),
    ],
    # 28 · Agustín I: el mal, la libertad y el tiempo
    28: [
        o('Edgar Allan Poe', '«El demonio de la perversidad»', 1845, 'cuento',
          'El narrador sostiene que hacemos el mal porque sabemos que no debemos, y confiesa su crimen por eso mismo: el robo de las peras de Agustín, el mal hecho por el gusto de lo prohibido.', dp=True),
        o('Virginia Woolf', 'La señora Dalloway', 1925, 'novela',
          'Un día de junio en Londres: el Big Ben marca las horas, pero el tiempo de cada personaje es recuerdo y espera. El tiempo como «distensión del alma» del libro XI.', dp=True),
        o('Jorge Luis Borges', '«El milagro secreto» (Ficciones)', 1944, 'cuento',
          'Frente al pelotón, Dios le da a Hladík un año para terminar su drama: para los demás pasa un instante. El tiempo vivido en el alma, no en el reloj.', arg=True),
        o('Tirso de Molina', 'El condenado por desconfiado', 1635, 'teatro',
          'Un ermitaño que duda de su salvación se condena y un bandido que confía se salva: libre albedrío y gracia, la discusión de Agustín con Pelagio, en el teatro del Siglo de Oro.', dp=True),
    ],
    # 29 · Agustín II: la verdad y la historia
    29: [
        o('Agustín de Hipona', 'Soliloquios', 387, 'diálogo',
          'Agustín conversa con la Razón: «Deseo conocer a Dios y el alma. ¿Nada más? Nada más». La búsqueda de la verdad hacia adentro, antes del maestro interior.', dp=True),
        o('Alessandro Manzoni', 'Los novios', 1827, 'novela',
          'Dos novios separados por un señor poderoso, la peste y la guerra en la Lombardía del siglo XVII: la Providencia que da sentido a la historia.', dp=True),
        o('Alejo Carpentier', 'El reino de este mundo', 1949, 'novela',
          'Ti Noel ve sucederse tiranos en Haití y concluye que la grandeza del hombre está en mejorar lo que es, en este mundo: lo contrario de la ciudad de Dios.', arg=True),
        o('Italo Calvino', 'Las ciudades invisibles', 1972, 'novela',
          'Al final Marco Polo dice que el infierno de los vivos ya está acá y que hay que buscar «quién y qué, en medio del infierno, no es infierno»: dos ciudades mezcladas en una.'),
    ],
    # 30 · Boecio, el Pseudo-Dionisio y Eriúgena
    30: [
        o('Carmina Burana (anónimo)', '«O Fortuna»', 1230, 'poema',
          '«Oh Fortuna, como la luna, variable»: los goliardos cantan la rueda de la fortuna que la Consolación había vuelto imagen.', dp=True),
        o('Juan de Mena', 'Laberinto de Fortuna', 1444, 'poema',
          'El poeta es llevado a la casa de la Fortuna y ve sus ruedas, con los hombres que suben y caen: la Consolación de Boecio, en la poesía castellana del siglo XV.', dp=True),
        o('Geoffrey Chaucer', 'Cuentos de Canterbury, «El cuento del caballero»', 1400, 'poema',
          'Al final, Teseo explica la muerte de Arcites con el «Primer Motor» que ordena todo con amor, casi copiado de Boecio (Chaucer tradujo la Consolación al inglés).', dp=True),
        o('La nube del no saber (anónimo inglés)', 'La nube del no saber', 1375, 'ensayo literario',
          'A Dios no se llega pensándolo sino por el amor, a través de una «nube del no saber»: la teología negativa del Pseudo-Dionisio, en una guía mística escrita en inglés.', dp=True),
    ],
    # 31 · Anselmo y el argumento ontológico
    31: [
        o('Italo Calvino', 'El caballero inexistente', 1959, 'novela',
          'Agilulfo, una armadura vacía, es el caballero más perfecto de Carlomagno: le sobran todas las virtudes y le falta solo existir. ¿La existencia es una perfección más?'),
        o('Miguel de Unamuno', 'San Manuel Bueno, mártir', 1931, 'novela',
          'Un cura de pueblo que no cree en la resurrección vive para que los demás crean: lo contrario de la «fe que busca entender» de Anselmo.', dp=True),
        o('Stanisław Lem', 'Ciberíada', 1965, 'cuento',
          'Trurl construye una máquina que puede hacer todo lo que empiece con N; cuando le piden la Nada, empieza a borrar el mundo: humor sobre si «nada» y «existe» funcionan como nombres y predicados.'),
    ],
    # 32 · La querella de los universales
    32: [
        o('John Keats', '«Oda a un ruiseñor»', 1819, 'poema',
          '«No naciste para la muerte, pájaro inmortal»: el ruiseñor que oye Keats es el mismo que oyó Ruth en la Biblia. Borges vio ahí la especie platónica contra el individuo («El ruiseñor de Keats»).', dp=True),
        o('William Shakespeare', 'Romeo y Julieta', 1597, 'teatro',
          '«¿Qué hay en un nombre? Lo que llamamos rosa, con cualquier otro nombre, olería igual»: Julieta habla como una nominalista.', dp=True),
        o('Vicente Huidobro', '«Arte poética» (El espejo de agua)', 1916, 'poema',
          '«¿Por qué cantáis la rosa, oh poetas? Hacedla florecer en el poema»: la palabra que no nombra una cosa sino que la crea, para pensar la relación entre voces, conceptos y cosas.', dp=True, arg=True),
    ],
    # 33 · La filosofía en el islam I: al-Kindi, al-Farabi y Avicena
    33: [
        o('Avicena', 'Poema del alma (Qasida al-ʿayniyya)', 1030, 'poema',
          'El alma baja de lo alto «como una paloma» y queda presa en el cuerpo hasta que recuerda su origen: la psicología de Avicena en verso árabe.', dp=True),
        o('Farid al-Din Attar', 'El lenguaje de los pájaros', 1177, 'poema',
          'Los pájaros viajan para encontrar a su rey, el Simurgh, y los treinta que llegan descubren que el Simurgh son ellos (si murgh, «treinta pájaros»): el viaje del alma hacia el intelecto, en persa.', dp=True),
        o('Noah Gordon', 'El médico', 1986, 'novela',
          'Un joven inglés del siglo XI se disfraza de judío para estudiar medicina con Avicena en Isfahán: la ciencia y la filosofía del islam vistas desde un extranjero.'),
    ],
    # 34 · La filosofía en el islam II: al-Ghazali, Averroes e Ibn Jaldún
    34: [
        o('Al-Ghazali', 'El liberador del error', 1100, 'testimonio',
          'Al-Ghazali cuenta su crisis: dudó de los sentidos y de la razón, dejó su cátedra en Bagdad y buscó la certeza en el sufismo. Una autobiografía escéptica, siglos antes de Descartes.', dp=True),
        o('Yalal al-Din Rumi', 'Masnavi', 1273, 'poema',
          'En el relato del elefante en la oscuridad, cada uno lo toca y lo describe distinto: los límites de la razón frente a lo que solo se conoce por experiencia, la posición de al-Ghazali contra los filósofos.', dp=True),
    ],
    # 35 · La filosofía judía medieval: Saadia, Halevi y Maimónides
    35: [
        o('Salomón ibn Gabirol', 'La corona real (Keter Malkut)', 1050, 'poema',
          'Un largo poema que alaba a Dios recorriendo las esferas del cosmos, de la Tierra al trono divino: la filosofía de la Fuente de la vida hecha plegaria en hebreo.', dp=True),
        o('Yehudá Halevi', '«Mi corazón está en Oriente»', 1140, 'poema',
          '«Mi corazón está en Oriente y yo en el extremo de Occidente»: el autor del Cuzarí, en Al-Ándalus, quiere ir a Jerusalén. La fe que no se deduce, se vive.', dp=True),
        o('Franz Kafka', '«Ante la ley»', 1915, 'cuento',
          'Un hombre espera toda la vida ante la puerta de la Ley y nunca entra: la ley y su interpretación, la tradición judía en la que Maimónides quiso reconciliar ley y razón.', dp=True),
    ],
    # 36 · Tomás de Aquino I: fe, razón y las cinco vías
    36: [
        o('G. K. Chesterton', '«La cruz azul» (El candor del padre Brown)', 1911, 'cuento',
          'El padre Brown descubre que un falso cura es un ladrón porque «atacó a la razón», y eso es mala teología: fe y razón, a la manera de Tomás (Chesterton escribió una biografía de él).', dp=True),
        o('Pedro Calderón de la Barca', 'El gran teatro del mundo', 1655, 'teatro',
          'Dios, el Autor, reparte los papeles y el mundo representa la obra: un orden dirigido a un fin, la quinta vía del gobierno del mundo.', dp=True),
        o('Ernesto Cardenal', 'Cántico cósmico', 1989, 'poema',
          'Un poema enorme que va del Big Bang a las galaxias y a la historia de Nicaragua buscando a Dios en el cosmos: la causa primera y el orden del mundo, con la ciencia del siglo XX.', arg=True),
    ],
    # 37 · Tomás de Aquino II: el alma, la ley y la acción
    37: [
        o('Sófocles', 'Antígona', -441, 'teatro',
          'Antígona entierra a su hermano contra el decreto de Creonte, por leyes «no escritas e inquebrantables»: la ley humana que contradice la ley natural, ¿obliga?', dp=True),
        o('Martin Luther King', 'Carta desde la cárcel de Birmingham', 1963, 'ensayo literario',
          'Desde la cárcel, King cita a Tomás: una ley injusta es una ley humana que no tiene raíz en la ley eterna ni en la natural. Por eso se la puede desobedecer.'),
        o('Lope de Vega', 'Fuenteovejuna', 1619, 'teatro',
          'El pueblo mata al comendador que abusaba de su poder y, torturados, todos responden «Fuenteovejuna lo hizo»: la resistencia al tirano, que Tomás también discute.', dp=True),
        o('Robert Bolt', 'Un hombre para la eternidad', 1960, 'teatro',
          'Tomás Moro no jura lo que el rey le exige y va al cadalso: la conciencia y la ley natural frente a la ley humana del poder.'),
    ],
    # 38 · Duns Escoto, Ockham y el fin de la escolástica
    38: [
        o('Christine de Pizan', 'La ciudad de las damas', 1405, 'ensayo literario',
          'Razón, Rectitud y Justicia ayudan a Christine a construir una ciudad para las mujeres ilustres, contra los sabios que hablan mal de ellas: la primera escritora profesional discute con la tradición.', dp=True),
        o('Angelus Silesius', 'El peregrino querubínico', 1657, 'poema',
          '«La rosa es sin porqué; florece porque florece»: epigramas místicos que vienen de Eckhart, Dios y el alma sin razones ni causas.', dp=True),
        o('Gerard Manley Hopkins', '«Como los martines pescadores prenden fuego»', 1918, 'poema',
          'Cada cosa «se dice a sí misma» y hace lo que es: el jesuita lector de Duns Escoto pone en verso la haecceitas, lo que hace a esta cosa justo esta.', dp=True),
        o('Jorge Luis Borges', '«El otro tigre» (El hacedor)', 1960, 'poema',
          'El tigre del poema es «de símbolos y sombras», y el otro, el que camina en la selva, queda fuera del verso: el nombre general frente al individuo, el problema de Ockham.', arg=True),
    ],
}
