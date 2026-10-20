# -*- coding: utf-8 -*-
"""Exame final C1 (semana 52), parte escrita de estructuras y léxico.

Modelado sobre el Celpe-Bras (nivel Avançado Superior) y los exámenes C1:
el Celpe-Bras evalúa todo con tareas integradas, así que las pruebas
analíticas (huecos, transformaciones, léxico) siguen el formato de los C1
europeos, como en el examen de italiano.

Dos pruebas, distinguidas por el campo `prova` (los valores son los mismos
que en el módulo italiano porque app.js los usa como claves):
  - "strutture" (Estruturas): huecos sobre textos coherentes (Texto 1:
    ensayo sobre Gilberto Freyre y sus críticos; Texto 2: narración en
    Santa Teresa, con cartas del exilio; Texto 3: divulgación sobre el
    pau-brasil; Texto 4: crónica de un vecino y una roda de samba) y
    transformaciones de frase
    (concesivas, orações reduzidas, futuro do subjuntivo, infinitivo
    pessoal, pasiva, discurso indirecto, colocação pronominal, mesóclise,
    crase, regência).
  - "lessico" (Léxico): formación de palabras (sufijos, prefijos,
    diminutivos, aumentativos, gentilicios), registro (culto / coloquial),
    colocaciones y falsos amigos / heterogenéricos.

Todos los ítems tienen w=52, level="C1", topic="esame" e id con prefijo
"ex-".  Los huecos llevan un campo `text` con la etiqueta del texto, para
que la app pueda agruparlos.  Compreensão oral, leitura y produção escrita
están en docs/lang/pt/esame_data.js.

Tres versiones del examen, las mismas de esame_data.js (versoes: "v1",
"v2", "v3"): cada ítem lleva `ver` y la pantalla del examen toma solo los
de la versión en curso.  Los huecos van por texto: v1 el Texto 1 (ensayo),
v2 el Texto 2 (narración), v3 los Textos 3 (divulgación) y 4 (crónica),
más cortos.  Las transformaciones y el léxico se reparten de a uno por
versión en el orden de la lista (1 → v1, 2 → v2, 3 → v3, 4 → v1…), así
cada versión tiene un poco de cada tipo; OVERRIDE corrige los casos en que
dos ítems de una misma versión se delatarían entre sí.  Quedan unos 34
ítems de Estruturas y 30 de Léxico por versión, sin repetir ninguno entre
versiones.  Ninguno entra en el entrenamiento de la semana 52
(build_course.py deja afuera todo ítem con `prova`): se ven solo en el
examen.

Datos históricos verificados (fechas, obras, leyes); lo que la tradición
cuenta sin prueba firme se marca en la nota.
"""

W = 52
LV = "C1"
T = "esame"

T1 = "Texto 1: Casa-Grande & Senzala e seus críticos"
T2 = "Texto 2: Uma tarde em Santa Teresa"
T3 = "Texto 3: A árvore que deu nome ao país"
T4 = "Texto 4: O vizinho do 302"

TEXT_VER = {T1: "v1", T2: "v2", T3: "v3", T4: "v3"}
VERS = ("v1", "v2", "v3")
# (familia, número) → versión, cuando el reparto de a uno juntaría dos
# ítems que se contestan entre sí: rg-12 y co-12 son los dos «pisar na bola».
OVERRIDE = {("co", 11): "v3", ("co", 12): "v2"}

P_CLOZE = "Completá con una sola palabra o con la forma pedida del verbo entre paréntesis."
P_FORM = "Formá la palabra pedida a partir de la que está en la base."
P_TRAS = "Reescribí la frase manteniendo el sentido: escribí solo lo que falta en el hueco."
P_REG = "Elegí el equivalente en el registro pedido."
P_COL = "Elegí la palabra que forma la combinación usual en portugués."
P_FAL = "Elegí el significado correcto (ojo con el español)."


def _ver(fam, n):
    """Version of item n of a family: one each in turn (1 → v1, 2 → v2…)."""
    return OVERRIDE.get((fam, n)) or VERS[(n - 1) % 3]


def cz(n, text, stem, answer, note, alt=None):
    d = dict(id="ex-cl-%02d" % n, type="cloze", topic=T, level=LV, w=W, prova="strutture",
             ver=TEXT_VER[text], text=text, prompt=P_CLOZE, stem=stem, answer=answer, note=note)
    if alt:
        d["alt"] = alt
    return d


def fp(n, stem, answer, note, alt=None):
    d = dict(id="ex-fp-%02d" % n, type="cloze", topic=T, level=LV, w=W, prova="lessico", ver=_ver("fp", n),
             prompt=P_FORM, stem=stem, answer=answer, note=note)
    if alt:
        d["alt"] = alt
    return d


def tr(n, stem, answer, note, alt=None):
    d = dict(id="ex-tr-%02d" % n, type="typed", topic=T, level=LV, w=W, prova="strutture", ver=_ver("tr", n),
             prompt=P_TRAS, stem=stem, answer=answer, note=note)
    if alt:
        d["alt"] = alt
    return d


def rg(n, stem, options, answer, note):
    return dict(id="ex-rg-%02d" % n, type="choice", topic=T, level=LV, w=W, prova="lessico", ver=_ver("rg", n),
                prompt=P_REG, stem=stem, options=options, answer=answer, note=note)


def co(n, stem, options, answer, note):
    return dict(id="ex-co-%02d" % n, type="choice", topic=T, level=LV, w=W, prova="lessico", ver=_ver("co", n),
                prompt=P_COL, stem=stem, options=options, answer=answer, note=note)


def fa(n, stem, options, answer, note):
    return dict(id="ex-fa-%02d" % n, type="choice", topic=T, level=LV, w=W, prova="lessico", ver=_ver("fa", n),
                prompt=P_FAL, stem=stem, options=options, answer=answer, note=note)


ITEMS = [
    # ------------------------------------------------------------------
    # Huecos, Texto 1: Casa-Grande & Senzala e seus críticos (ensayo)
    # ------------------------------------------------------------------
    cz(1, T1, "Publicado em 1933, Casa-Grande & Senzala, de Gilberto Freyre, é um ___ livros mais discutidos da história intelectual brasileira.",
       "dos", "Contracción obligatoria: de + os = dos. «Uno de los libros» → «um dos livros»; nunca ✗de os."),
    cz(2, T1, "Freyre se opunha ___ teorias racistas então em voga, que viam na mestiçagem a causa do atraso do país.",
       "às", "Crase: «opor-se a» + «as teorias» = às. Prueba: con un masculino sería «aos preconceitos»."),
    cz(3, T1, "Ao contrário ___ muitos intelectuais da época, ele valorizava a contribuição africana e indígena para a cultura nacional.",
       "de", "«Ao contrário de» + sustantivo. Sin artículo porque «muitos» no lo lleva (con artículo sería «dos intelectuais»)."),
    cz(4, T1, "O livro, ___ estilo mistura ensaio, memória e crônica, fez enorme sucesso também fora da universidade.",
       "cujo", "«Cujo» concuerda con lo poseído (o estilo → cujo) y nunca lleva artículo detrás: ✗cujo o estilo es error."),
    cz(5, T1, "Sua tese, porém, logo ___ (tornar-se) alvo de críticas.",
       "se tornou", "Colocação pronominal: adverbios como «logo, já, sempre, nunca, não» atraen el pronombre (próclise): logo se tornou, no ✗logo tornou-se."),
    cz(6, T1, "Muitos leitores concluíram que, no Brasil, as relações entre senhores e escravizados ___ (ser) mais brandas do que em outros países.",
       "eram", "Imperfeito en el discurso referido al pasado. «Teriam sido» agrega distancia: el autor no se hace cargo de la idea.",
       alt=["teriam sido", "tinham sido", "haviam sido"]),
    cz(7, T1, "Nas décadas de 1950 e 1960, o sociólogo Florestan Fernandes mostrou que a abolição, ___ (decretar) em 1888, não fora acompanhada de nenhuma política de integração.",
       "decretada", "Participio con valor adjetivo: concuerda con «a abolição» (decretada). «Fora acompanhada» es el mais-que-perfeito simples de ser."),
    cz(8, T1, "Os libertos foram deixados à própria sorte, sem terra e sem escola, sem que ___ (poder) competir em igualdade com os imigrantes.",
       "pudessem", "«Sem que» rige subjuntivo; con el verbo principal en pasado, subjuntivo imperfeito (pudessem)."),
    cz(9, T1, "Para Florestan, a chamada democracia racial era um mito que servia ___ ocultar desigualdades muito concretas.",
       "para", "«Servir para» + infinitivo = servir para. Con el sentido de «servir a alguien» se usa sin preposición o con «a»."),
    cz(10, T1, "Não basta proclamar a igualdade: é preciso que as instituições a ___ (garantir).",
       "garantam", "«É preciso que» + subjuntivo presente. El pronombre «a» va antes del verbo porque lo atrae «que»."),
    cz(11, T1, "A intelectual Lélia Gonzalez, ___ trabalhos dos anos 1980 uniram as questões de raça e de gênero, foi ainda mais longe.",
       "cujos", "«Cujo» concuerda en género y número con lo poseído (os trabalhos → cujos), no con el poseedor (Lélia)."),
    cz(12, T1, "Ela chamou a atenção ___ o racismo presente na própria língua, na maneira de falar das pessoas negras.",
       "para", "Regência: «chamar a atenção para» algo. En español «llamar la atención sobre»; en portugués «sobre» suena a calco."),
    cz(13, T1, "Criou o termo «pretuguês» para designar o português do Brasil, marcado pela influência das línguas africanas ___ chegaram com os escravizados.",
       "que", "Relativo sujeto: «que». «As quais» también es posible en registro formal.", alt=["as quais"]),
    cz(14, T1, "Hoje, quem ___ (querer) entender o Brasil precisa ler tanto Freyre quanto seus críticos.",
       "quiser", "Futuro do subjuntivo tras «quem» con valor de futuro o condición: quem quiser (= el que quiera). El español usa presente de subjuntivo."),
    cz(15, T1, "Quando os estudantes ___ (comparar) esses autores, vão perceber que o debate está longe de terminar.",
       "compararem", "«Quando» + futuro do subjuntivo para un hecho futuro: quando compararem (= cuando comparen)."),
    cz(16, T1, "É importante os leitores ___ (conhecer) o contexto em que cada livro foi escrito.",
       "conhecerem", "Infinitivo pessoal: el infinitivo tiene sujeto propio (os leitores) y se conjuga: conhecerem. Equivale a «que os leitores conheçam»."),
    cz(17, T1, "Freyre escreveu num momento ___ que o racismo científico ainda tinha prestígio.",
       "em", "«Num momento em que» = en un momento en que. En portugués la preposición del relativo no se omite: ✗num momento que es coloquial."),
    cz(18, T1, "Isso não significa absolvê-lo, ___ compreender os limites de sua época.",
       "mas", "«Não… mas (sim)» = no… sino. En portugués no existe «sino»: se usa «mas», «e sim» o «senão».",
       alt=["e sim", "senão", "mas sim"]),
    cz(19, T1, "Alguns críticos ___ acusam de ter idealizado a vida na casa-grande.",
       "o", "Objeto directo masculino: «o» (nunca ✗lo). En PB culto va antes del verbo en la oración con sujeto expreso: alguns críticos o acusam."),
    cz(20, T1, "Freyre dedicou boa parte da vida ___ pesquisa sobre o Nordeste açucareiro.",
       "à", "Crase: «dedicar a» + «a pesquisa» = à. Con un masculino sería «ao estudo»."),
    cz(21, T1, "O debate chegou ___ escolas: desde 2003, uma lei tornou obrigatório o ensino de história e cultura afro-brasileira.",
       "às", "«Chegar a» + «as escolas» = às. Es la Lei 10.639, de 2003. En el habla se oye «chegar nas escolas», que no es norma culta.",),
    cz(22, T1, "___ haja avanços, as estatísticas continuam mostrando desigualdades profundas.",
       "Embora", "Concesiva con subjuntivo: embora / ainda que / mesmo que / se bem que + haja. En español «aunque hay» es posible; en portugués «embora» exige subjuntivo.",
       alt=["Ainda que", "Mesmo que", "Se bem que", "Conquanto"]),
    cz(23, T1, "Segundo o censo de 2022, pretos e pardos, somados, ___ (formar) a maioria da população brasileira.",
       "formam", "Sujeto compuesto (pretos e pardos) → verbo en plural. Según el IBGE, en 2022 sumaban algo más del 55 %."),
    cz(24, T1, "Discutir esses livros é, ___ fim das contas, discutir que país queremos ser.",
       "no", "Expresión fija: «no fim das contas» = al fin y al cabo. Contracción em + o = no."),
    cz(25, T1, "Talvez ___ (caber) a cada geração reler esses clássicos com olhos novos.",
       "caiba", "«Talvez» antes del verbo → subjuntivo presente. Caber es irregular: caibo → caiba."),

    # ------------------------------------------------------------------
    # Huecos, Texto 2: Uma tarde em Santa Teresa (narración)
    # ------------------------------------------------------------------
    cz(26, T2, "Num sábado de calor, Bia ___ (pegar) o bondinho no Centro e subiu até Santa Teresa, como fazia na infância.",
       "pegou", "Pretérito perfeito para la acción puntual de la narración. En Brasil se «pega» (no se «toma») el ómnibus, el metrô o el bondinho."),
    cz(27, T2, "A casa do avô, ___ ninguém morava havia anos, ficava numa ladeira perto do Largo do Guimarães.",
       "onde", "Relativo de lugar: onde / em que / na qual. «Havia anos» = hacía años (haver impersonal, siempre en singular).",
       alt=["em que", "na qual"]),
    cz(28, T2, "Ela abriu o portão com a chave que a mãe lhe ___ (dar) na véspera.",
       "dera", "Mais-que-perfeito simples (literario): deram → dera. En el habla, «tinha dado».",
       alt=["tinha dado", "havia dado"]),
    cz(29, T2, "Lá dentro, tudo estava ___ o avô deixara: os livros, o toca-discos, o cheiro de café.",
       "como", "«Como» comparativo de modo: tal como lo había dejado. «Deixara» = tinha deixado.", alt=["tal como", "do jeito que"]),
    cz(30, T2, "Na estante, encontrou um exemplar antigo de Dom Casmurro, ___ primeira página havia uma dedicatória.",
       "em cuja", "La preposición va antes de «cujo»: em cuja página = en cuya página. Cuja concuerda con «página»."),
    cz(31, T2, "Não ___ lembrava de ter visto aquele livro.",
       "se", "«Lembrar-se de»: el pronombre va antes del verbo porque lo atrae el «não»: não se lembrava."),
    cz(32, T2, "Dentro dele havia cartas ___ (escrever) em Lisboa entre 1975 e 1979.",
       "escritas", "Participio irregular de escrever: escrito. Concuerda con «cartas»: escritas."),
    cz(33, T2, "Como tantos outros, o avô fora obrigado ___ deixar o país durante a ditadura.",
       "a", "Regência: «ser obrigado a» + infinitivo. «Fora» = tinha sido (mais-que-perfeito de ser)."),
    cz(34, T2, "Numa das cartas, escrevia a um amigo: «Quando ___ (poder) voltar, a primeira coisa que vou fazer é ver o mar de Ipanema».",
       "puder", "Futuro do subjuntivo irregular: se forma sobre la 3.ª plural del perfeito (puderam → puder). El español dice «cuando pueda»."),
    cz(35, T2, "Em outra, pedia ___ amigo que lhe mandasse discos de Chico Buarque e de Elis Regina.",
       "ao", "«Pedir a alguém que» + subjuntivo: a + o = ao. «Lhe mandasse» = que le mandara."),
    cz(36, T2, "«Se eu ___ (estar) aí, iria a pé até o Arpoador ver o pôr do sol.»",
       "estivesse", "Condicional irreal del presente: se + subjuntivo imperfeito (estivesse) + futuro do pretérito (iria)."),
    cz(37, T2, "Bia leu as cartas sentada no chão, ___ (esquecer) o calor e a hora.",
       "esquecendo", "Gerundio modal: cómo leyó. «Esquecer» transitivo (esquecer o calor) o pronominal con «de» (esquecendo-se do calor)."),
    cz(38, T2, "Soube depois que o avô só pôde voltar ___ Brasil com a Lei da Anistia, em 1979.",
       "ao", "«Voltar a» + «o Brasil» = ao Brasil. Brasil lleva artículo (o Brasil); Portugal, no (voltar a Portugal)."),
    cz(39, T2, "A mãe lhe contou que ele chorara ___ ver o Pão de Açúcar da janela do avião.",
       "ao", "*Ao* + infinitivo marca el momento en que pasa algo, como nuestro «al + infinitivo»: *ao ver* es «al ver, cuando vio». Es una oración reducida temporal: el infinitivo no cambia aunque el tiempo sea pasado."),
    cz(40, T2, "«Seu avô nunca deixou ___ acreditar que o país ia mudar», disse ela.",
       "de", "*Deixar de* + infinitivo es «dejar de» y la preposición *de* no se omite. Ojo: *seu avô* con *você* es «tu abuelo»; «su abuelo (de él)» se aclara con *o avô dele*."),
    cz(41, T2, "Antes de ___ (sair), ela e a mãe fecharam todas as janelas.",
       "saírem", "Infinitivo pessoal: con sujeto plural es habitual conjugar el infinitivo (antes de saírem). Con el mismo sujeto que la principal, «sair» también es correcto. Ojo a la tilde: saírem.",
       alt=["sair"]),
    cz(42, T2, "Desceram a ladeira a pé até os Arcos da Lapa, ___ o bondinho já tinha parado de circular.",
       "porque", "Causal: porque / pois / já que / uma vez que. «Porque» junto y sin tilde en la respuesta causal.",
       alt=["pois", "já que", "uma vez que", "visto que"]),
    cz(43, T2, "No caminho, a mãe perguntou se ela ___ (querer) ficar com a casa.",
       "queria", "Interrogativa indirecta en pasado: presente → imperfeito (queria). No se usa subjuntivo.",
       alt=["quereria"]),
    cz(44, T2, "Bia respondeu que ___ (pensar) no assunto com calma.",
       "pensaria", "Discurso indirecto: el futuro («vou pensar / pensarei») pasa a futuro do pretérito (pensaria). «Pensar em», no ✗pensar de."),
    cz(45, T2, "À noite, num boteco da Lapa, pediu um chope e releu a dedicatória: «Para a Bia, quando ela ___ (ter) idade para entender».",
       "tiver", "Futuro do subjuntivo de ter: tiveram → tiver. «Quando ela tiver» = cuando ella tenga."),
    cz(46, T2, "Era a primeira vez ___ alguém lhe escrevia de tão longe no tempo.",
       "que", "*A primeira vez que* y *a primeira vez em que* son correctas; *em que* es más cuidada. El verbo que sigue va en indicativo.",
       alt=["em que"]),
    cz(47, T2, "Decidiu que, se a família ___ (concordar), transformaria a casa num pequeno centro cultural.",
       "concordasse", "Condicional hipotético: se + subjuntivo imperfeito (concordasse) + futuro do pretérito (transformaria)."),
    cz(48, T2, "Afinal, o avô sempre dissera que livros fechados não servem ___ nada.",
       "para", "*Servir para* conserva la misma preposición que en español: *não servir para nada*. *Dissera* es el pluscuamperfecto simple, propio de la escritura; en el habla se usa *tinha dito*."),

    # ------------------------------------------------------------------
    # Huecos, Texto 3: A árvore que deu nome ao país (divulgación, v3)
    # ------------------------------------------------------------------
    cz(49, T3, "Poucos países devem o nome ___ uma árvore, e o Brasil é um deles.",
       "a", "Regência: «dever algo a alguém». Sin crase porque «uma» no lleva artículo: devem o nome a uma árvore, pero à árvore."),
    cz(50, T3, "Quando os portugueses chegaram, em 1500, o pau-brasil ___ (crescer) em boa parte da Mata Atlântica.",
       "crescia", "Imperfeito para describir el estado de cosas de fondo; el perfeito (chegaram) cuenta la acción puntual. Igual que en español: crecía."),
    cz(51, T3, "Da sua madeira se extraía uma tinta vermelha, ___ cor lembrava a de uma brasa: daí o nome.",
       "cuja", "«Cujo» concuerda con lo poseído (a cor → cuja), no con el poseedor (a tinta), y no lleva artículo detrás. «Brasil» viene de «brasa»: el color del tinte."),
    cz(52, T3, "O comércio era tão lucrativo ___ a Coroa logo o transformou em monopólio.",
       "que", "Consecutiva: «tão + adjetivo + que». La Corona portuguesa se reservó el comercio del pau-brasil desde los primeros años."),
    cz(53, T3, "Os troncos eram cortados e ___ (carregar) até a costa por indígenas, que recebiam em troca facas, espelhos e tecidos.",
       "carregados", "Pasiva coordinada: el «eram» sirve para los dos participios, y cada uno concuerda con el sujeto (os troncos → cortados, carregados). Ese trueque se llamaba «escambo»."),
    cz(54, T3, "No século XIX, a tinta ___ (deixar) de interessar à indústria, porque os corantes sintéticos eram mais baratos.",
       "deixou", "Perfeito para el cambio puntual: deixou de (= dejó de). «Interessar a» + «a indústria» = à indústria, con crase."),
    cz(55, T3, "Mesmo assim, a madeira continuou a ser procurada, ___ é a preferida dos fabricantes de arcos de violino.",
       "pois", "Causal que explica lo anterior: pois / porque / já que / uma vez que. «Pois» causal va entre las dos oraciones, nunca al principio de la frase.",
       alt=["porque", "já que", "uma vez que", "visto que"]),
    cz(56, T3, "Hoje a espécie está ameaçada de extinção, e o corte só é permitido ___ autorização dos órgãos ambientais.",
       "com", "Preposición del medio o la condición: «com autorização» (o «mediante autorização», más formal), sin artículo, como «con permiso». «Ameaçada de extinção»: en peligro de extinción.",
       alt=["mediante"]),
    cz(57, T3, "Em 1978, uma lei federal ___ declarou árvore nacional.",
       "a", "Objeto directo femenino (a espécie): «a», nunca ✗la. En PB culto va antes del verbo cuando hay sujeto expreso: uma lei a declarou. Es la Lei 6.607, de 1978."),
    cz(58, T3, "É curioso que um país tão grande ___ (lembrar) tão pouco da árvore que lhe deu o nome.",
       "se lembre", "«É curioso que» + subjuntivo presente. «Lembrar-se de» es la forma culta; en el habla brasileña «lembrar de», sin pronombre, es lo normal.",
       alt=["lembre"]),
    cz(59, T3, "Muitos brasileiros nunca viram um pau-brasil, ___ ele esteja plantado em praças e jardins botânicos de várias cidades.",
       "embora", "Concesiva con subjuntivo: embora / ainda que / mesmo que + esteja. En español «aunque está» es posible; en portugués «embora» exige subjuntivo.",
       alt=["ainda que", "mesmo que", "se bem que", "conquanto"]),
    cz(60, T3, "Se cada escola ___ (plantar) uma muda, a história do país estaria mais perto das crianças.",
       "plantasse", "Hipótesis del presente: se + subjuntivo imperfeito (plantasse) + futuro do pretérito (estaria). «Uma muda» = un plantín."),

    # ------------------------------------------------------------------
    # Huecos, Texto 4: O vizinho do 302 (crónica, v3)
    # ------------------------------------------------------------------
    cz(61, T4, "___ três anos, quando me mudei para este prédio em Botafogo, ninguém me cumprimentava no elevador.",
       "Há", "Tiempo transcurrido: «há» (de haver, impersonal, con h y tilde) = hace. En el habla también «faz». No confundir con «a» (daqui a três anos: dentro de tres años).",
       alt=["Faz"]),
    cz(62, T4, "O único que falava comigo era seu Álvaro, o vizinho do 302, ___ passava as tardes regando as plantas da varanda.",
       "que", "Relativo sujeto después de coma: «que» (o «o qual», más formal). «Seu Álvaro»: «seu» es el tratamiento popular de «senhor» delante del nombre.",
       alt=["o qual"]),
    cz(63, T4, "Um dia, ele me perguntou se eu ___ (gostar) de samba de roda.",
       "gostava", "Interrogativa indirecta en pasado: «Você gosta?» → perguntou se eu gostava. Imperfeito de indicativo, no subjuntivo. Y «gostar de», siempre con «de»."),
    cz(64, T4, "Respondi que sim, e ele me convidou ___ ir a uma roda na Pedra do Sal na sexta seguinte.",
       "para", "«Convidar alguém para» + infinitivo (o «a», más formal). En Brasil no se dice ✗convidar de.",
       alt=["a"]),
    cz(65, T4, "Nunca ___ (ouvir) falar daquele lugar, apesar de já morar no Rio havia algum tempo.",
       "tinha ouvido", "Anterioridad en el pasado: mais-que-perfeito composto (tinha ouvido) o simple (ouvira, literario). «Havia algum tempo» = hacía un tiempo, siempre en singular.",
       alt=["havia ouvido", "ouvira"]),
    cz(66, T4, "Na sexta, ___ (chegar) à Pedra do Sal, entendi por que ele gostava tanto de lá.",
       "chegando", "Oração reduzida de gerúndio con valor temporal: chegando (= cuando llegué). Con «ao» + infinitivo también: ao chegar. «Por que» va separado en la interrogativa indirecta.",
       alt=["ao chegar"]),
    cz(67, T4, "Seu Álvaro conhecia todo mundo: os músicos o ___ (receber) com abraços.",
       "receberam", "Perfeito para la acción puntual (o imperfeito si era la costumbre: recebiam). El pronombre «o» va antes del verbo porque hay sujeto expreso.",
       alt=["recebiam"]),
    cz(68, T4, "Contou-me que, na juventude, tocara pandeiro ___ uma escola de samba da Zona Norte.",
       "numa", "La preposición «em» se contrae con el artículo indefinido: em + uma → numa (en la escritura culta también «em uma»). «Tocara» es el mais-que-perfeito simples: tinha tocado.",
       alt=["em uma"]),
    cz(69, T4, "— Quando você ___ (vir) de novo, traga um amigo — disse um dos músicos.",
       "vier", "Futuro do subjuntivo de vir: vieram → vier (cuando vengas). Trampa: «vir» es el futuro do subjuntivo de ver (quando você o vir = cuando lo veas)."),
    cz(70, T4, "Desde então, eu e seu Álvaro ___ (ir) juntos à roda quase todas as semanas.",
       "temos ido", "Pretérito perfeito composto: algo que se repite desde un punto del pasado hasta hoy (temos ido = venimos yendo). No equivale al pretérito perfecto español «hemos ido». Con presente también vale: vamos.",
       alt=["vamos"]),
    cz(71, T4, "No mês passado, ele fez oitenta anos e pediu que ninguém lhe ___ (dar) presentes.",
       "desse", "«Pedir que» + subjuntivo; con el verbo principal en pasado, imperfeito: desse (dieran). «Fazer oitenta anos» = cumplir ochenta."),
    cz(72, T4, "Na festa, fui eu ___ tocou o pandeiro que ele me ensinou a tocar.",
       "quem", "Con «fui eu quem» el verbo va en 3.ª persona (tocou); con «fui eu que», concuerda con «eu» (fui eu que toquei). Como después del hueco viene «tocou», la respuesta es «quem»."),

    # ------------------------------------------------------------------
    # Transformações (estruturas)
    # ------------------------------------------------------------------
    tr(1, "Embora estivesse cansado, foi à roda de samba. → Apesar de ___ cansado, foi à roda de samba.", "estar",
       "Concesiva con conjunción (embora + subjuntivo) → «apesar de» + infinitivo."),
    tr(2, "Embora estivéssemos cansados, fomos à praia. → Apesar de ___ cansados, fomos à praia.", "estarmos",
       "Con sujeto plural el infinitivo se conjuga (infinitivo pessoal): apesar de estarmos. El español no tiene esta forma.",
       alt=["nós estarmos"]),
    tr(3, "Quando chegou em casa, ligou para a mãe. → Ao ___ em casa, ligou para a mãe.", "chegar",
       "Temporal → oração reduzida: «ao» + infinitivo = al llegar."),
    tr(4, "Depois que a reunião terminou, saímos. → ___ a reunião, saímos.", "Terminada",
       "Oração reduzida de particípio: el participio concuerda con su sujeto (a reunião → terminada) y marca anterioridad."),
    tr(5, "Como estava chovendo, ficamos no boteco. → ___ chovendo, ficamos no boteco.", "Estando",
       "Causal → reducida de gerúndio: estando chovendo (= como estaba lloviendo)."),
    tr(6, "Se você quiser, a gente vai ao Arpoador. → Caso você ___, a gente vai ao Arpoador.", "queira",
       "*Se* pide futuro do subjuntivo (*se você quiser*), un tiempo que el español perdió; *caso* pide presente do subjuntivo (*caso você queira*). Las dos son condicionales: cambia la conjunción, cambia el modo."),
    tr(7, "Caso eu tenha tempo, vou ler Grande Sertão: Veredas. → Se eu ___ tempo, vou ler Grande Sertão: Veredas.", "tiver",
       "«Caso» + subjuntivo presente → «se» + futuro do subjuntivo (tiver). Error típico: *se eu tenho / *se eu tenha."),
    tr(8, "É necessário que vocês cheguem cedo. → É necessário vocês ___ cedo.", "chegarem",
       "«É necessário que + subjuntivo» → infinitivo pessoal con sujeto propio: vocês chegarem."),
    tr(9, "O professor pediu que lêssemos Machado. → O professor pediu para ___ Machado.", "lermos",
       "«Pedir para» + infinitivo pessoal es la construcción habitual en PB (lermos = que leyéramos). En registro formal: pediu que lêssemos."),
    tr(10, "Clarice Lispector escreveu A hora da estrela em 1977. → A hora da estrela ___ por Clarice Lispector em 1977.", "foi escrita",
       "Activa → pasiva: ser en el mismo tiempo (foi) + participio concordado con el nuevo sujeto (a hora → escrita)."),
    tr(11, "Os moradores vendem casas antigas em Santa Teresa. → Casas antigas ___ em Santa Teresa.", "são vendidas",
       "Pasiva analítica en presente: são + participio concordado (casas → vendidas). También: vendem-se casas.",
       alt=["são vendidas pelos moradores"]),
    tr(12, "A Constituição foi promulgada em 1988. → ___ a Constituição em 1988.", "Promulgou-se",
       "Pasiva sintética (se apassivador). A comienzo de frase, el pronombre va después del verbo (ênclise): Promulgou-se."),
    tr(13, "Procura-se garçons. (error frecuente) → ___ garçons.", "Procuram-se",
       "Con «se» apassivador el verbo concuerda con el sujeto plural: procuram-se garçons (= garçons são procurados)."),
    tr(14, "Vi ele ontem no calçadão. (coloquial) → ___ ontem no calçadão. (culto)", "Vi-o",
       "«Ele» como objeto es coloquial; en la norma culta: o / a / os / as. A comienzo de frase, ênclise: vi-o."),
    tr(15, "Me disseram que o show foi cancelado. (coloquial) → ___ que o show foi cancelado. (culto escrito)", "Disseram-me",
       "La norma culta escrita no empieza la frase con pronombre átono: disseram-me. En el habla brasileña la próclise inicial es normal."),
    tr(16, "Direi a verdade a vocês. → ___ a verdade. (culto, con pronombre)", "Dir-lhes-ei",
       "Mesóclise: con futuro o futuro do pretérito, en registro muy formal, el pronombre va dentro del verbo: dir-lhes-ei. Se reconoce en textos jurídicos y literarios.",
       alt=["Eu lhes direi"]),
    tr(17, "Vou te contar uma coisa. (coloquial) → Vou ___ uma coisa. (culto, con «lhe»)", "contar-lhe",
       "Con «você», el pronombre de la norma culta es «lhe» (no «te»). Con perífrasis, en PB son correctas contar-lhe y lhe contar.",
       alt=["lhe contar"]),
    tr(18, "Drummond: «Tenho apenas duas mãos e o sentimento do mundo.» → O poeta escreveu que ___ apenas duas mãos e o sentimento do mundo.", "tinha",
       "Discurso indirecto con verbo introductor en pasado: presente → imperfeito (tinha). Versos de «Sentimento do Mundo» (1940)."),
    tr(19, "Ana: «Vou ao Rio amanhã.» → Ana disse que ___ ao Rio no dia seguinte.", "iria",
       "Discurso indirecto: «vou» (futuro próximo) → iria o ia; amanhã → no dia seguinte.", alt=["ia"]),
    tr(20, "O guia: «Não tirem fotos.» → O guia pediu que não ___ fotos.", "tirassem",
       "Imperativo en discurso indirecto → pedir que + subjuntivo imperfeito (tirassem). Si el guía nos hablaba a nosotros: tirássemos.",
       alt=["tirássemos"]),
    tr(21, "Quando a corte chegou, a cidade mudou. → Com a ___ da corte, a cidade mudou.", "chegada",
       "Nominalización: chegar → a chegada (participio sustantivado), típico del estilo de los informes."),
    tr(22, "Os escravizados foram libertados em 1888. → A ___ dos escravizados ocorreu em 1888.", "libertação",
       "Nominalización: libertar → libertação (-ção, como -ción)."),
    tr(23, "Não estudei, por isso não passei no Celpe-Bras. → Se eu ___, teria passado no Celpe-Bras.", "tivesse estudado",
       "Irreal del pasado: se + subjuntivo mais-que-perfeito (tivesse estudado) + futuro do pretérito composto (teria passado).",
       alt=["houvesse estudado"]),
    tr(24, "Eu tinha lido o livro antes do filme. → Eu ___ o livro antes do filme. (mais-que-perfeito simples)", "lera",
       "Mais-que-perfeito simples: 3.ª plural del perfeito menos -m (leram → lera). Literario: se lee más de lo que se dice."),
    tr(25, "Apesar de chover muito, fomos à praia. → Por mais que ___ muito, fomos à praia.", "chovesse",
       "«Por mais que» + subjuntivo (imperfeito, porque la principal está en pasado): por mais que chovesse."),
    tr(26, "Vou ao museu. → Vou ___ Biblioteca Nacional.", "à",
       "Crase: «ir a» + «a Biblioteca» = à. Truco: si con un masculino dirías «ao», con el femenino va «à»."),
    tr(27, "Assisti o jogo no bar. (coloquial) → Assisti ___ jogo no bar. (culto)", "ao",
       "Regência: «assistir a» (= presenciar, ver) en la norma culta; «assistir o» es muy frecuente en el habla."),
    tr(28, "Prefiro mais samba do que funk. (coloquial) → Prefiro samba ___ funk. (culto)", "a",
       "Regência: «preferir algo a algo», sin «mais» ni «do que». Con artículo femenino: prefiro a praia à montanha."),
    tr(29, "Faz dois anos que moro no Rio. → Moro no Rio ___ dois anos.", "há",
       "Tiempo transcurrido: «há» (verbo haver, con h y tilde). No confundir con «a» (distancia o futuro: daqui a dois anos).",
       alt=["faz"]),
    tr(30, "Dom Pedro: «Diga ao povo que fico.» → Dom Pedro mandou dizer ao povo que ___.", "ficava",
       "Discurso indirecto: presente → imperfeito (ficava) o futuro do pretérito (ficaria). La frase del Dia do Fico (9/1/1822) es la que registró la tradición; hay versiones.",
       alt=["ficaria"]),

    # ------------------------------------------------------------------
    # Formação de palavras (léxico)
    # ------------------------------------------------------------------
    fp(1, "decidir → ___ (substantivo)", "decisão", "Verbos en -dir → -são: decidir → decisão, dividir → divisão. En español -sión."),
    fp(2, "aumentar → ___ (substantivo)", "aumento", "Nombre de acción sin sufijo, con -o: aumentar → aumento, custar → custo."),
    fp(3, "analisar → ___ (substantivo)", "análise", "Analisar → a análise (femenino, con tilde, -se). En español «el análisis»: heterogenérico.",),
    fp(4, "escravo → ___ (substantivo: a instituição)", "escravidão", "Sufijo -idão: escravidão, solidão, gratidão. «Escravatura» también existe.",
       alt=["escravatura"]),
    fp(5, "abolir → ___ (substantivo)", "abolição", "Sufijo -ção (español -ción): abolição, com til en la a. Plural: abolições."),
    fp(6, "livre → ___ (substantivo)", "liberdade", "Sufijo -dade (español -dad): liberdade. Se recupera la raíz latina liber-."),
    fp(7, "rico → ___ (substantivo)", "riqueza", "Sufijo -eza para cualidades: riqueza, pobreza, beleza, tristeza."),
    fp(8, "velho → ___ (substantivo)", "velhice", "Sufijo -ice: velhice (vejez), meninice, chatice, burrice. No existe ✗velhez."),
    fp(9, "cordial → ___ (substantivo)", "cordialidade", "Adjetivos en -al → -alidade: cordialidade, formalidade, legalidade."),
    fp(10, "mestiço → ___ (substantivo: o processo)", "mestiçagem", "Sufijo -agem (femenino): a mestiçagem, a viagem, a coragem. En español -aje y masculino."),
    fp(11, "independente → ___ (substantivo)", "independência", "Adjetivo en -ente → sustantivo en -ência, con tilde circunfleja: independência, ciência."),
    fp(12, "colonizar → ___ (substantivo)", "colonização", "Verbos en -izar → -ização: colonização, urbanização, modernização."),
    fp(13, "desenvolver → ___ (substantivo)", "desenvolvimento", "Sufijo -mento (acción y resultado): desenvolvimento, esquecimento, conhecimento."),
    fp(14, "esquecer → ___ (substantivo)", "esquecimento", "Verbos en -ecer → -ecimento: esquecimento, aquecimento, crescimento."),
    fp(15, "sapato → ___ (profissão)", "sapateiro", "Sufijo -eiro para oficios: sapateiro, padeiro, jornaleiro. En español -ero."),
    fp(16, "laranja → ___ (a árvore)", "laranjeira", "Sufijo -eira para árboles: laranjeira, bananeira, mangueira (el árbol de mango)."),
    fp(17, "café → ___ (diminutivo)", "cafezinho", "Palabras terminadas en vocal tónica toman -zinho: cafezinho, pezinho. El cafezinho es también invitación."),
    fp(18, "casa → ___ (aumentativo)", "casarão", "Aumentativo -ão (masculino aunque la base sea femenina): o casarão, o mulherão."),
    fp(19, "gol → ___ (aumentativo expressivo)", "golaço", "Sufijo -aço, aumentativo con valor de elogio: golaço, jogaço, filmaço."),
    fp(20, "papel → ___ (diminutivo)", "papelzinho", "Terminadas en -l toman -zinho: papelzinho (plural: papeizinhos)."),
    fp(21, "feliz → ___ (contrário com prefixo)", "infeliz", "Prefijo negativo in-: infeliz, incapaz, inútil."),
    fp(22, "legal → ___ (contrário com prefixo)", "ilegal", "in- → i- delante de l: ilegal, ilógico. Igual que en español."),
    fp(23, "possível → ___ (contrário com prefixo)", "impossível", "in- → im- delante de p y b: impossível, imbatível. -ble español → -vel."),
    fp(24, "responsável → ___ (contrário com prefixo)", "irresponsável", "in- → ir- delante de r, con doble r: irresponsável, irregular."),
    fp(25, "fazer → ___ (contrário com prefixo)", "desfazer", "Prefijo des- para invertir la acción: desfazer, desligar, descobrir."),
    fp(26, "honesto → ___ (contrário com prefixo)", "desonesto", "Des- + h: la h cae (desonesto, desumano). En español «deshonesto» la conserva."),
    fp(27, "leal → ___ (contrário com prefixo)", "desleal", "Des- negativo ante adjetivo: desleal, desigual, desconhecido."),
    fp(28, "Rio de Janeiro (a cidade) → ___ (gentílico)", "carioca", "El gentilicio distingue ciudad y estado: *carioca* es de la ciudad de Río; del estado es *fluminense*. En español solemos decir «de Río» para las dos cosas."),
    fp(29, "estado do Rio de Janeiro → ___ (gentílico)", "fluminense", "*Fluminense* (del latín *flumen*, río) es el gentilicio del estado de Río; *carioca* queda para la ciudad. El club de fútbol tomó el nombre del estado."),
    fp(30, "São Paulo (a cidade) → ___ (gentílico)", "paulistano", "São Paulo tiene dos gentilicios: *paulistano* para la ciudad y *paulista* para el estado. Igual que Río (*carioca / fluminense*), el portugués separa lo que en español decimos «de San Pablo»."),
    fp(31, "Bahia → ___ (gentílico)", "baiano", "Bahia se escribe con h por tradición; el gentilicio, sin h: baiano."),
    fp(32, "sensível → ___ (substantivo)", "sensibilidade", "Adjetivos en -vel → -bilidade: sensibilidade, possibilidade, responsabilidade."),
    fp(33, "saudade → ___ (adjetivo)", "saudoso", "Sufijo -oso: saudoso (que siente o que deja saudade; también «o saudoso Tom Jobim», el recordado)."),
    fp(34, "Machado de Assis → ___ (adjetivo)", "machadiano", "Adjetivos de autor en -iano: machadiano, rosiano (Guimarães Rosa), pessoano (Pessoa)."),
    fp(35, "Camões → ___ (adjetivo)", "camoniano", "Camões → camoniano (la nasal -ões se vuelve -on-): a lírica camoniana."),
    fp(36, "rápido → ___ (diminutivo com valor de advérbio)", "rapidinho", "El diminutivo intensifica o suaviza: rapidinho (enseguida, un momentito), cedinho, pertinho."),

    # ------------------------------------------------------------------
    # Registro (léxico)
    # ------------------------------------------------------------------
    rg(1, "(coloquial) A gente vai no show. → (culto) ___ ao show.", ["Nós vamos", "A gente vamos", "Nós vai"], "Nós vamos",
       "«A gente» lleva verbo en singular; en registro culto se prefiere «nós» + 1.ª plural. «Ir a» (ao show), no «ir em»."),
    rg(2, "(coloquial) Tem muita gente na praia. → (culto escrito) ___ muitas pessoas na praia.", ["Há", "Têm", "Existe"], "Há",
       "«Ter» existencial es normal en el habla; en lo escrito formal, «haver», impersonal y en singular: há muitas pessoas."),
    rg(3, "(coloquial) Cadê o relatório? → (formal) ___ o relatório?", ["Onde está", "Aonde está", "Cadê que está"], "Onde está",
       "«Cadê» es coloquial. «Aonde» se usa con verbos de movimiento (aonde você vai?), no con estar."),
    rg(4, "(coloquial) Beleza, combinado! → (e-mail formal) ___", ["Perfeito, fica combinado.", "Valeu, fechou!", "Tranquilo, tá combinado."], "Perfeito, fica combinado.",
       "«Beleza», «valeu», «fechou», «tá» son marcas del habla informal."),
    rg(5, "Apertura de un e-mail a una directora que no conocés: ___ Senhora Diretora,", ["Prezada", "Querida", "Oi,"], "Prezada",
       "«Prezado/a» es la apertura formal estándar. «Querido/a» es afectivo; «Oi» es informal."),
    rg(6, "Cierre de una carta formal: ___", ["Atenciosamente", "Beijos", "Abração"], "Atenciosamente",
       "«Atenciosamente» (o «Cordialmente», un poco menos frío) cierra la correspondencia formal."),
    rg(7, "(coloquial) Te mando o arquivo junto. → (formal) O arquivo segue ___.", ["em anexo", "ajuntado", "pendurado"], "em anexo",
       "«Segue em anexo» / «segue anexo» = va adjunto. Verbo: anexar."),
    rg(8, "(coloquial) Escrevo pra pedir… → (formal) Venho, por meio ___, solicitar…", ["desta", "dessa", "daqui"], "desta",
       "«Por meio desta» (= de la presente carta): «desta» porque es el texto que se está escribiendo."),
    rg(9, "(coloquial) Fico esperando sua resposta. → (formal) Fico no ___ de sua resposta.", ["aguardo", "espero", "esperamento"], "aguardo",
       "«Fico no aguardo» / «aguardo seu retorno» son fórmulas de cierre formal."),
    rg(10, "Tratamiento para un juez en un escrito oficial: ___", ["Vossa Excelência", "Você", "Tu"], "Vossa Excelência",
       "«Vossa Excelência» (V. Exa.) para jueces y altas autoridades, con verbo en 3.ª persona. «Vossa Senhoria» (V. Sa.) para otros cargos."),
    rg(11, "(formal) Gostaria de solicitar… → (coloquial) ___", ["Queria te pedir…", "Solicito a V. Sa.…", "Venho requerer…"], "Queria te pedir…",
       "En el habla, «queria» (imperfeito de cortesía) + «te pedir»; «solicitar» y «requerer» son formales."),
    rg(12, "(coloquial) Ele pisou na bola. → (neutro) Ele ___.", ["cometeu um erro", "pisou a bola", "chutou a bola"], "cometeu um erro",
       "*Pisar na bola* es una expresión coloquial: «meter la pata, fallarle a alguien». En registro neutro se dice *cometer um erro* o *errar*; *pisar a bola* (sin *na*) no existe."),
    rg(13, "(coloquial) Isso enche o saco. → (neutro) Isso ___.", ["é muito chato", "enche a bolsa", "é muito legal"], "é muito chato",
       "*Encher o saco* (vulgar suave) es «hinchar, romper las pelotas». En registro neutro: *ser muito chato* o *incomodar*. *Chato* es «pesado, molesto», no «de nariz chata»."),
    rg(14, "(coloquial) Tô nem aí. → (neutro) ___", ["Não me importo.", "Não estou aqui.", "Não me importa aí."], "Não me importo.",
       "*Estar nem aí* (*tô nem aí*) es «me importa un pepino»: el *nem* niega solo, sin *não*. En neutro se dice *não me importo*; *tô* es la forma hablada de *estou*."),
    rg(15, "(coloquial) Rolou uma festa ontem. → (neutro) ___ uma festa ontem.", ["Houve", "Rodou", "Tiveram"], "Houve",
       "«Rolar» (coloquial) = pasar, haber, darse. En registro neutro: houve, aconteceu."),
    rg(16, "(coloquial) O show foi irado! → (neutro) O show foi ___.", ["excelente", "irritante", "raivoso"], "excelente",
       "En la jerga juvenil *irado* es un elogio: «re bueno, genial», nada que ver con la ira. En registro neutro: *excelente*, *ótimo*."),
    rg(17, "(coloquial carioca) Fiquei bolado com o que ele disse. → (neutro) Fiquei ___ com o que ele disse.", ["chateado", "enrolado", "abolado"], "chateado",
       "*Ficar bolado* (carioca) es quedar molesto o preocupado; en neutro se dice *ficar chateado*. No confundas con *enrolado*, que es «complicado, liado»."),
    rg(18, "(formal) Diante do exposto, … → (coloquial) ___", ["Então, resumindo, …", "Face ao exposto, …", "Destarte, …"], "Então, resumindo, …",
       "«Diante do exposto», «face ao exposto» y «destarte» cierran textos formales; en el habla: então, resumindo."),
    rg(19, "(formal) Solicitamos a gentileza de responder. → (informal) ___", ["Me responde, por favor?", "Solicita-se resposta.", "Rogamos resposta."], "Me responde, por favor?",
       "En el habla informal: próclise al inicio (me responde) e indicativo con valor de pedido."),
    rg(20, "(coloquial) Ele é muito gente boa. → (formal) Ele é muito ___.", ["simpático", "boa gente", "gentil gente"], "simpático",
       "*Gente boa* funciona como adjetivo invariable (*ele é muito gente boa*), como nuestro «buena onda». En registro neutro o formal: *simpático*, *amável*."),
    rg(21, "(coloquial) Qualquer coisa, me chama. → (e-mail formal) ___", ["Fico à disposição para esclarecimentos.", "Qualquer coisa, é só me dar um toque.", "Se precisar de algo, me chama no zap, beleza?"], "Fico à disposição para esclarecimentos.",
       "«Qualquer coisa, me chama» cierra un mensaje informal (próclise al inicio, «chamar» = contactar). En un e-mail formal: «Fico à disposição» o «Coloco-me à disposição». «Dar um toque» y «zap» (WhatsApp) son del habla."),

    # ------------------------------------------------------------------
    # Colocações (léxico)
    # ------------------------------------------------------------------
    co(1, "Ela ___ questão de pagar a conta. (= insistir en)", ["faz", "tem", "dá"], "faz",
       "*Fazer questão de* + infinitivo es «insistir en, empeñarse en»: el verbo es *fazer*, no *ter*. No lo confundas con «hacer una pregunta», que es *fazer uma pergunta*."),
    co(2, "No fim, deu tudo ___. (= salió bien)", ["certo", "bem feito", "correto"], "certo",
       "Con *dar* + adjetivo se dice cómo sale algo: *dar certo* «salir bien, funcionar», *dar errado* «salir mal». El adjetivo no concuerda: *deu tudo certo*."),
    co(3, "Não se preocupe, eu ___ um jeito. (= me las arreglo)", ["dou", "faço", "tomo"], "dou",
       "*Dar um jeito* es «arreglárselas, encontrar la vuelta»: el verbo es *dar*, no *fazer*. De ahí el famoso *jeitinho brasileiro*."),
    co(4, "Ela sempre ___ tudo a sério. (= tomarse en serio)", ["leva", "toma", "faz"], "leva",
       "«Levar a sério» = tomar(se) en serio. Calco a evitar: ✗tomar a sério."),
    co(5, "Amanhã eu ___ a prova de história. (= rendir el examen)", ["faço", "dou", "tomo"], "faço",
       "El alumno «faz a prova» (rinde); el profesor «aplica» o «dá» la prova. Trampa rioplatense: ✗dar a prova."),
    co(6, "Os alunos ___ atenção à explicação.", ["prestam", "fazem", "põem"], "prestam",
       "*Prestar atenção* usa el mismo verbo que el español; el complemento va con *a* (formal) o *em* (habla): *prestar atenção à explicação*. No se dice *fazer atenção*."),
    co(7, "A exposição sobre Portinari ___ a pena.", ["vale", "dá", "faz"], "vale",
       "*Valer a pena* lleva artículo *a*, como «valer la pena»: el verbo es *valer* y concuerda con el sujeto (*a exposição vale a pena*)."),
    co(8, "Machado de Assis ___ um papel central na fundação da Academia Brasileira de Letras.", ["desempenhou", "jogou", "brincou"], "desempenhou",
       "«Desempenhar (um) papel» = desempeñar/jugar un papel. «Jogar um papel» es calco. Machado fue su primer presidente (1897)."),
    co(9, "No verão carioca, às vezes chove ___ no fim da tarde. (= llover a cántaros)", ["canivetes", "cântaros", "baldes"], "canivetes",
       "Expresión idiomática: «chover canivetes» (llueven navajas) = llover a cántaros."),
    co(10, "Ela se ___ muito bem com a sogra. (= llevarse bien)", ["dá", "leva", "faz"], "dá",
       "«Llevarse bien con alguien» se dice *dar-se bem com alguém* (en Brasil, *se dar bem*): el verbo es *dar*, y ✗*se levar bem* es calco del español."),
    co(11, "As crianças ___ de conta que eram piratas. (= hacer de cuenta)", ["faziam", "davam", "tinham"], "faziam",
       "*Fazer de conta (que)* es «hacer de cuenta, fingir», con el mismo verbo que en el Río de la Plata: *faziam de conta que eram piratas*. *Dar de conta* no existe."),
    co(12, "Ele ___ na bola e esqueceu o aniversário da mulher. (= equivocarse feo)", ["pisou", "chutou", "bateu"], "pisou",
       "*Pisar na bola* es «meter la pata, fallarle a alguien»: se pisa *na* (en la) pelota, no se patea. Registro coloquial; en neutro, *errar*."),
    co(13, "Vamos ___ uma decisão até sexta.", ["tomar", "fazer", "dar"], "tomar",
       "«Tomar uma decisão», como en español. Trampa: ✗fazer uma decisão (calco del inglés)."),
    co(14, "Depois da praia, a primeira coisa que faço é ___ banho.", ["tomar", "dar", "fazer"], "tomar",
       "*Tomar banho* es bañarse o ducharse uno mismo, sin pronombre reflexivo. *Dar banho* es bañar a otro: *dar banho no cachorro*."),
    co(15, "Antes da reunião, vou ___ uma olhada no relatório. (= echar un vistazo)", ["dar", "jogar", "botar"], "dar",
       "*Dar uma olhada* es «echar un vistazo»: el verbo es *dar*. *Jogar uma olhada* es calco de «echar»; en Brasil no se dice."),

    # ------------------------------------------------------------------
    # Falsos amigos y heterogenéricos (léxico)
    # ------------------------------------------------------------------
    fa(1, "O filme é meio esquisito. «esquisito» =", ["raro", "exquisito", "aburrido"], "raro",
       "Falso amigo: *esquisito* es «raro, extraño». Para «exquisito» se dice *delicioso*, *requintado* o *gostoso*."),
    fa(2, "Comemos polvo num restaurante da Urca. «polvo» =", ["pulpo", "polvo", "pollo"], "pulpo",
       "Falso amigo: *polvo* es «pulpo». «Polvo» (la tierra fina) se dice *pó* o *poeira*."),
    fa(3, "Me empresta a borracha? «borracha» =", ["goma de borrar", "mujer borracha", "botella"], "goma de borrar",
       "Falso amigo: *borracha* es «goma» (de borrar, y el caucho de los neumáticos). «Borracho» se dice *bêbado*."),
    fa(4, "Qual é o seu apelido? «apelido» =", ["apodo", "apellido", "dirección"], "apodo",
       "«Apelido» = apodo; el apellido es «sobrenome»."),
    fa(5, "Levei o carro à oficina. «oficina» =", ["taller mecánico", "oficina", "farmacia"], "taller mecánico",
       "Falso amigo: *oficina* es el «taller» (mecánico o de trabajo). La oficina donde se trabaja con papeles es el *escritório*."),
    fa(6, "Ela trabalha num escritório no Centro. «escritório» =", ["oficina", "escritorio (el mueble)", "librería"], "oficina",
       "Falso amigo: *escritório* es la «oficina». El mueble «escritorio» se dice *escrivaninha* (o *mesa de trabalho*)."),
    fa(7, "Fiquei embaraçada com a pergunta. «embaraçada» =", ["incómoda, avergonzada", "embarazada", "enojada"], "incómoda, avergonzada",
       "Falso amigo: *embaraçada* es «incómoda, avergonzada». «Embarazada» se dice *grávida*."),
    fa(8, "A Avenida Presidente Vargas é muito larga. «larga» =", ["ancha", "larga", "corta"], "ancha",
       "Falso amigo: *largo* es «ancho». Para «largo» (longitud) se dice *comprido*: *uma rua comprida e larga*."),
    fa(9, "Qual é a sobremesa de hoje? «sobremesa» =", ["postre", "charla después de comer", "mantel"], "postre",
       "Falso amigo: *sobremesa* es el «postre». La charla de sobremesa no tiene palabra fija: *a conversa depois do almoço*."),
    fa(10, "Tem um rato na cozinha! «rato» =", ["ratón, rata", "rato, momento", "lagartija"], "ratón, rata",
       "Falso amigo: *rato* es «ratón, rata». «Un rato» se dice *um tempinho*, *um momento*."),
    fa(11, "Ele ficou pelado na praia do Abricó, que é de naturismo. «pelado» =", ["desnudo", "calvo", "sin plata"], "desnudo",
       "Falso amigo: *pelado* es «desnudo». «Pelado» (calvo) se dice *careca*, y «sin plata», *duro* o *liso*."),
    fa(12, "Ela ficou roxa de vergonha. «roxa» =", ["violeta", "roja", "rosa"], "violeta",
       "Falso amigo: *roxo* es «violeta, morado» (*roxa de vergonha*). «Rojo» se dice *vermelho*."),
    fa(13, "A polícia prendeu o ladrão. «prendeu» =", ["detuvo, arrestó", "encendió", "prendió fuego"], "detuvo, arrestó",
       "Falso amigo: *prender* es «detener, arrestar» (y sujetar). «Prender» la luz se dice *acender*: *acender a luz*."),
    fa(14, "Comprei ___ mel na feira de Laranjeiras.", ["o", "a", "la"], "o",
       "Heterogenérico: o mel (masculino), como o leite, o sangue, o sal. En español, la miel."),
    fa(15, "___ viagem a Salvador foi inesquecível.", ["A", "O", "La"], "A",
       "Heterogenérico: a viagem (femenino), como a coragem, a garagem, a origem. En español, el viaje."),
    fa(16, "Estou com ___ dor nas costas desde ontem.", ["uma", "um", "una"], "uma",
       "Heterogenérico: a dor (femenino). En español, el dolor."),
    fa(17, "Ela estava na cozinha picando salsa para o feijão. «salsa» =", ["perejil", "salsa de tomate", "cebolla"], "perejil",
       "Falso amigo: *salsa* es «perejil». La salsa para la comida es *molho* (*molho de tomate*); la música, esa sí, es *salsa*."),
    fa(18, "Hoje acordei às seis da manhã. «acordei» =", ["me desperté", "me acordé", "acordé, decidí"], "me desperté",
       "Falso amigo: *acordar* es «despertar(se)», sin pronombre en Brasil. «Acordarse» es *lembrar-se*; «acordar algo» (decidir juntos), *combinar* o *decidir*."),
]
