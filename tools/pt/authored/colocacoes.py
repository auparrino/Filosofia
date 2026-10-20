# -*- coding: utf-8 -*-
"""Colocações: el banco de combinaciones usuales del portugués (auditoría v3, P3.3).

El equivalente portugués de tools/it/authored/lessico2.py.  Verbo soporte +
sustantivo (y alguna preposición fija) justo donde el portugués elige otra
palabra que el castellano: *fazer questão*, *torcer por*, *tirar férias*,
*dar certo*, *levar em conta*, *prestar contas*, *tomar providências*,
*arcar com*, *trazer à tona*.  Dos por semana desde la 14 (hoy la semana 50
concentra casi todo), con la gramática de su semana (sillabo.py).

Los distractores son palabras portuguesas (el calco del español o un verbo
vecino), nunca palabras españolas que se descartan por la forma, y nunca
otra combinación que también sea correcta (*fazer fila* y *pegar fila*,
*cair no sono* y *pegar no sono*: por eso no están juntas).

COLOCACOES (abajo) es la lista de las combinaciones con su equivalente, su
campo y la semana en que se enseñan: la usan los ítems y sirve de banco
para quien quiera sumar ejercicios.
"""

P = "Elegí la palabra que forma la combinación usual."

try:                         # cada ítem va a la última parte de la lección de su semana
    import importlib.util as _u, os as _os
    _p = _os.path.join(_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))), "lessons", "__init__.py")
    _spec = _u.spec_from_file_location("lessons", _p, submodule_search_locations=[_os.path.dirname(_p)])
    _m = _u.module_from_spec(_spec)
    _spec.loader.exec_module(_m)
    _LAST = {w: len(l.get("parts") or [1]) - 1 for w, l in _m.LESSONS.items()}
except Exception:
    _LAST = {}

# (semana, frase con ___, respuesta, [opciones], nota, colocación, equivalente, campo)
_C = [
 (14, "Eu ___ questão de pagar o almoço: você é minha convidada.", "faço", ["faço", "tenho", "dou"],
  "Insistir en (o tener el gusto de) → fazer questão de. No es «hacer cuestión».", "fazer questão de", "insistir en", "cotidiano"),
 (14, "Meu irmão ___ pelo Flamengo desde criança.", "torce", ["torce", "incha", "joga"],
  "Hinchar por un equipo → torcer por (o torcer para). Inchar es hincharse un pie; la hinchada es a torcida.", "torcer por", "hinchar por", "futebol"),
 (15, "Quando eu era criança, a gente ___ banho de mar todo domingo.", "tomava", ["tomava", "fazia", "dava"],
  "Bañarse (en el mar, en la ducha) → tomar banho (de mar, de chuveiro): el baño se «toma».", "tomar banho", "bañarse", "cotidiano"),
 (15, "Minha avó ___ aniversário no Carnaval, e a festa era enorme.", "fazia", ["fazia", "cumpria", "tinha"],
  "Cumplir años → fazer aniversário (o fazer anos). Cumprir es cumplir una promesa o una ley.", "fazer aniversário", "cumplir años", "cotidiano"),
 (16, "Você me ___ um favor? Segura a porta.", "faz", ["faz", "dá", "pede"],
  "El favor se pede (se pide) y se faz (se hace), nunca se dá: você me faz um favor?", "fazer um favor", "hacer un favor", "cotidiano"),
 (16, "Na loja, dá para pagar em três ___ sem juros.", "vezes", ["vezes", "cotas", "partes"],
  "Pagar en cuotas → pagar em x vezes (o parcelar). Sin interés → sem juros.", "pagar em x vezes", "pagar en cuotas", "economia"),
 (17, "No fim do ano, ela vai ___ vestibular para Medicina.", "prestar", ["prestar", "render", "dar"],
  "Rendir el examen de ingreso → prestar vestibular (o fazer o vestibular). Render es rendir de rendimiento: o dinheiro rende.", "prestar vestibular", "rendir el examen de ingreso", "educação"),
 (17, "Depois de um ano de trabalho, ___ férias em julho.", "tirarei", ["tirarei", "tomarei", "sacarei"],
  "Tomarse vacaciones → tirar férias. Tirar hace de «sacar»: tirar foto, tirar nota, tirar férias.", "tirar férias", "tomarse vacaciones", "trabalho"),
 (18, "Eu gostaria de ___ uma consulta com o dermatologista.", "marcar", ["marcar", "sacar", "tomar"],
  "Sacar turno → marcar uma consulta (o marcar horário). Sacar en portugués es sacar dinero, o entender algo.", "marcar uma consulta", "sacar turno", "saúde"),
 (18, "Você poderia me ___ uma carona até o centro?", "dar", ["dar", "fazer", "levar"],
  "Llevar a alguien en el auto → dar uma carona; el que va, pega carona.", "dar carona", "llevar a alguien (en auto)", "cidade"),
 (19, "Esse vestido ___ melhor em você do que o azul.", "cai", ["cai", "queda", "sente"],
  "Quedar bien (la ropa) → cair bem o ficar bem. Queda es una caída.", "cair bem", "quedar bien", "compras"),
 (19, "No Rio tudo é mais caro: é difícil ___ dinheiro.", "juntar", ["juntar", "somar", "reunir"],
  "Ahorrar plata → juntar (o guardar, poupar, economizar) dinheiro.", "juntar dinheiro", "ahorrar plata", "economia"),
 (20, "Não ___ bola para o que ele diz: ele está brincando.", "dá", ["dá", "presta", "faz"],
  "Hacerle caso a alguien → dar bola (para alguém), en el habla. Não dá bola = no le hagas caso.", "dar bola", "hacer caso", "cotidiano"),
 (20, "Ninguém consegue ___ papo com ele: ele não fala nada!", "bater", ["bater", "jogar", "dar"],
  "Charlar → bater papo (informal) o conversar.", "bater papo", "charlar", "cotidiano"),
 (21, "Nos últimos meses, o projeto tem dado ___: as vendas subiram.", "certo", ["certo", "bem", "acerto"],
  "Salir bien → dar certo; salir mal → dar errado.", "dar certo", "salir bien", "trabalho"),
 (21, "Tenho ___ muitas fotos do pôr do sol no Arpoador.", "tirado", ["tirado", "sacado", "tomado"],
  "Sacar una foto → tirar uma foto (o bater uma foto, informal). «Tomar una foto» es un calco.", "tirar foto", "sacar una foto", "cotidiano"),
 (22, "Você precisa ___ firma no cartório antes de assinar o contrato.", "reconhecer", ["reconhecer", "certificar", "firmar"],
  "Certificar la firma → reconhecer firma (en el cartório). Firmar es assinar.", "reconhecer firma", "certificar la firma", "economia"),
 (22, "Para pedir o CPF, é preciso ___ entrada no pedido pela internet.", "dar", ["dar", "fazer", "abrir"],
  "Iniciar un trámite → dar entrada (num pedido, num processo). También: dar entrada no hospital = ingresar.", "dar entrada", "iniciar un trámite", "economia"),
 (23, "O médico quer que você ___ a vacina da gripe.", "tome", ["tome", "ponha", "dê"],
  "Vacunarse → tomar a vacina (o se vacinar); quien la pone, aplica a vacina.", "tomar vacina", "vacunarse", "saúde"),
 (23, "Espero que você não ___ mal depois de tanto camarão.", "passe", ["passe", "sinta", "caia"],
  "Sentirse mal (del cuerpo) → passar mal. Sentir-se mal también existe, pero siempre con se.", "passar mal", "sentirse mal", "saúde"),
 (24, "Vamos sair cedo para que a gente não ___ trânsito.", "pegue", ["pegue", "agarre", "tome"],
  "Agarrar tráfico → pegar trânsito. Pegar hace de «agarrar» y de «tomar»: pegar o ônibus, pegar gripe.", "pegar trânsito", "agarrar tráfico", "cidade"),
 (24, "Antes que a gente ___ as malas, confira os documentos.", "faça", ["faça", "arme", "ponha"],
  "Hacer (o armar) las valijas → fazer as malas.", "fazer as malas", "armar las valijas", "viagem"),
 (25, "O preço é o fator que a gente mais ___ em conta.", "leva", ["leva", "tem", "toma"],
  "Tener en cuenta → levar em conta (o levar em consideração).", "levar em conta", "tener en cuenta", "cotidiano"),
 (25, "É um professor que todos os alunos ___ a sério.", "levam", ["levam", "tomam", "pegam"],
  "Tomar en serio → levar a sério.", "levar a sério", "tomar en serio", "educação"),
 (27, "Quando você ___ a decisão, me avisa.", "tomar", ["tomar", "fizer", "der"],
  "Tomar una decisión → tomar uma decisão, como en español; «fazer uma decisão» es un calco del inglés.", "tomar uma decisão", "tomar una decisión", "cotidiano"),
 (27, "Se a mudança não ___ certo, a gente volta para o Rio.", "der", ["der", "sair", "fizer"],
  "Salir bien → dar certo; en futuro do subjuntivo: se der certo, quando der certo.", "dar certo", "salir bien", "cotidiano"),
 (28, "Se eu ganhasse ___ loteria, abriria uma pousada.", "na", ["na", "a", "em"],
  "Ganar la lotería → ganhar na loteria (em + a). Sin preposición suena a español.", "ganhar na loteria", "ganar la lotería", "economia"),
 (28, "Se você ___ mão desse emprego, se arrependeria.", "abrisse", ["abrisse", "largasse", "deixasse"],
  "Renunciar a algo → abrir mão de algo: abrir mão do salário, de um direito.", "abrir mão de", "renunciar a", "trabalho"),
 (29, "É importante os gestores ___ contas à sociedade.", "prestarem", ["prestarem", "renderem", "darem"],
  "Rendir cuentas → prestar contas (a alguém).", "prestar contas", "rendir cuentas", "política"),
 (29, "Ele ___ demissão para os filhos poderem mudar de cidade.", "pediu", ["pediu", "renunciou", "deu"],
  "Renunciar a un trabajo → pedir demissão; al que echan, lo demitem (é demitido).", "pedir demissão", "renunciar (al trabajo)", "trabalho"),
 (30, "Eu teria ___ na bola se tivesse contado o segredo.", "pisado", ["pisado", "metido", "chutado"],
  "Meter la pata → pisar na bola (en el habla). Más formal: cometer uma gafe.", "pisar na bola", "meter la pata", "cotidiano"),
 (30, "Se a gente tivesse dado ___ do recado, o chefe não teria reclamado.", "conta", ["conta", "cabo", "fim"],
  "Poder con algo, cumplir → dar conta (de algo, do recado). Não dou conta = no llego, no puedo con todo.", "dar conta de", "poder con, cumplir", "trabalho"),
 (31, "O jornalista disse que ia ___ contato com o ministério.", "entrar em", ["entrar em", "meter-se em", "cair em"],
  "Ponerse en contacto → entrar em contato (com alguém).", "entrar em contato", "ponerse en contacto", "trabalho"),
 (31, "A ministra afirmou que a lei ___ em vigor em janeiro.", "entraria", ["entraria", "ficaria", "daria"],
  "Entrar en vigencia → entrar em vigor.", "entrar em vigor", "entrar en vigencia", "política"),
 (32, "Proíbe-se ___ fogo em lixo neste terreno.", "pôr", ["pôr", "prender", "fazer"],
  "Prender fuego → pôr (o atear) fogo; prender es arrestar o sujetar.", "pôr fogo", "prender fuego", "meio ambiente"),
 (32, "Aqui ___ cópias e fotos 3x4 na hora.", "tiram-se", ["tiram-se", "sacam-se", "tomam-se"],
  "Sacar fotocopias → tirar cópias (o xerox).", "tirar cópias", "sacar fotocopias", "cidade"),
 (33, "O narrador ___ de conta que não vê nada.", "faz", ["faz", "dá", "toma"],
  "Hacer de cuenta, hacer como que → fazer de conta que.", "fazer de conta", "hacer de cuenta", "literatura"),
 (33, "O escândalo veio à ___ depois da morte do escritor.", "tona", ["tona", "vista", "superfície"],
  "Salir a la luz (algo oculto) → vir à tona; sacarlo a la luz → trazer à tona.", "vir à tona", "salir a la luz", "imprensa"),
 (34, "A prefeitura precisa ___ providências contra as enchentes.", "tomar", ["tomar", "dar", "fazer"],
  "Tomar medidas → tomar providências (o tomar medidas).", "tomar providências", "tomar medidas", "meio ambiente"),
 (34, "Durante a seca, todos devem ___ água.", "poupar", ["poupar", "salvar", "render"],
  "Ahorrar (agua, energía, plata) → poupar o economizar.", "poupar água", "ahorrar agua", "meio ambiente"),
 (35, "Vou ___ um processo contra a empresa.", "abrir", ["abrir", "meter", "levantar"],
  "Hacerle un juicio a alguien → abrir (o mover) um processo contra alguém.", "abrir um processo", "hacer un juicio", "justiça"),
 (35, "Nas eleições, você vai votar ___ quem?", "em", ["em", "a", "por"],
  "Votar a alguien → votar em alguém. «Votar a» es un calco.", "votar em", "votar a", "política"),
 (36, "Ela deu ___ luz a gêmeos.", "à", ["à", "a", "na"],
  "Dar a luz → dar à luz, con crase (a + a luz).", "dar à luz", "dar a luz", "saúde"),
 (36, "O senhor deve ___ atenção à data de validade.", "prestar", ["prestar", "colocar", "pôr"],
  "Prestar atención → prestar atenção (a algo; con crase, à data).", "prestar atenção", "prestar atención", "cotidiano"),
 (37, "O cientista ___ dados sobre a qualidade do ar.", "levantou", ["levantou", "relevou", "alçou"],
  "Relevar datos → levantar (o coletar) dados. Relevar en portugués es disculpar, pasar por alto.", "levantar dados", "relevar datos", "ciência"),
 (37, "A empresa precisa ___ com os custos do conserto.", "arcar", ["arcar", "carregar", "sustentar"],
  "Hacerse cargo de (gastos, consecuencias) → arcar com.", "arcar com", "hacerse cargo de", "economia"),
 (38, "Nossa, paguei o maior ___ na festa: caí na frente de todo mundo.", "mico", ["mico", "ridículo", "papelão"],
  "Hacer el ridículo → pagar mico (informal). También: fazer papelão.", "pagar mico", "hacer el ridículo", "cotidiano"),
 (38, "Tô tão cansado que ___ no sono no sofá.", "peguei", ["peguei", "dormi", "fiquei"],
  "Quedarse dormido → pegar no sono (o cair no sono).", "pegar no sono", "quedarse dormido", "cotidiano"),
 (40, "O estudo ___ a questão da evasão no primeiro ano.", "levanta", ["levanta", "planta", "alça"],
  "Plantear una cuestión → levantar (o colocar) uma questão.", "levantar uma questão", "plantear una cuestión", "academia"),
 (40, "O projeto faz ___ ao prêmio que recebeu.", "jus", ["jus", "honor", "mérito"],
  "Merecer, estar a la altura → fazer jus a (formal).", "fazer jus a", "estar a la altura de", "academia"),
 (41, "A viagem chegara ___ fim, e ninguém dissera nada.", "ao", ["ao", "a", "no"],
  "Llegar a su fin → chegar ao fim (a + o).", "chegar ao fim", "llegar a su fin", "literatura"),
 (41, "O delegado fizera ___ ao que acontecia no porto.", "vista grossa", ["vista grossa", "vista gorda", "olhos grossos"],
  "Hacer la vista gorda → fazer vista grossa.", "fazer vista grossa", "hacer la vista gorda", "literatura"),
 (42, "Chegando à delegacia, a vítima ___ um boletim de ocorrência.", "registrou", ["registrou", "denunciou", "levantou"],
  "Hacer la denuncia policial → registrar (o fazer) um boletim de ocorrência (o BO).", "registrar um BO", "hacer la denuncia", "justiça"),
 (42, "Aos quarenta minutos, o camisa dez ___ o pênalti e errou.", "bateu", ["bateu", "tirou", "lançou"],
  "Patear un penal → bater (o cobrar) o pênalti; marcar un gol → marcar (o fazer) um gol.", "bater o pênalti", "patear el penal", "futebol"),
 (43, "Escrevo para ___ uma dúvida sobre o edital.", "esclarecer", ["esclarecer", "sacar", "aclarar"],
  "Sacarse una duda → tirar (informal) o esclarecer (formal) uma dúvida.", "esclarecer uma dúvida", "sacarse una duda", "trabalho"),
 (43, "Solicito que a empresa ___ o prazo de entrega.", "prorrogue", ["prorrogue", "demore", "atrase"],
  "Extender un plazo → prorrogar o prazo.", "prorrogar o prazo", "extender el plazo", "trabalho"),
 (44, "Ela deu um ___ de entrar sem ingresso.", "jeitinho", ["jeitinho", "jeitão", "trejeito"],
  "Arreglárselas → dar um jeito (o um jeitinho, con diminutivo).", "dar um jeito", "arreglárselas", "cotidiano"),
 (44, "Os moradores fizeram uma ___ para ajudar a vizinha.", "vaquinha", ["vaquinha", "vaca", "bezerra"],
  "Hacer una vaquita, una colecta → fazer uma vaquinha (con diminutivo, como en español).", "fazer uma vaquinha", "hacer una colecta", "economia"),
 (45, "Vou ___ o carro na oficina: o motor está fazendo barulho.", "levar", ["levar", "portar", "carregar"],
  "Oficina es el taller mecánico: levar o carro na oficina. La oficina de trabajo es o escritório.", "levar o carro na oficina", "llevar el auto al taller", "cidade"),
 (45, "Ela ficou ___ quando o chefe elogiou o trabalho dela na frente de todos.", "sem graça", ["sem graça", "exaltada", "constipada"],
  "Darle vergüenza a alguien → ficar sem graça (o constrangido). Constipado, en portugués, es estreñido o resfriado.", "ficar sem graça", "darle vergüenza", "cotidiano"),
 (46, "No Brasil a gente ___ o ônibus; em Portugal, apanha o autocarro.", "pega", ["pega", "agarra", "prende"],
  "Tomar el colectivo → pegar o ônibus (Brasil), apanhar o autocarro (Portugal).", "pegar o ônibus", "tomar el colectivo", "cidade"),
 (46, "Em Luanda, a Nádia está ___ ler um livro; no Rio, estaria lendo.", "a", ["a", "de", "em"],
  "Estar + gerundio (Brasil) → estar a + infinitivo (Portugal y África).", "estar a + infinitivo", "estar + gerundio", "variação"),
 (47, "A proposta ___ em xeque o modelo atual.", "põe", ["põe", "deixa", "faz"],
  "Poner en duda → pôr em xeque (o colocar em xeque).", "pôr em xeque", "poner en duda", "política"),
 (47, "O debate deu ___ a novas propostas.", "ensejo", ["ensejo", "desejo", "lugar de"],
  "Dar lugar a → dar ensejo a (formal) o dar lugar a.", "dar ensejo a", "dar lugar a", "política"),
 (48, "O autor ___ a atenção para a falta de verbas.", "chama", ["chama", "clama", "dá"],
  "Llamar la atención sobre → chamar a atenção para.", "chamar a atenção para", "llamar la atención sobre", "imprensa"),
 (48, "A reportagem ___ à tona o problema das enchentes.", "traz", ["traz", "leva", "saca"],
  "Sacar a la luz → trazer à tona.", "trazer à tona", "sacar a la luz", "imprensa"),
 (49, "O contribuinte deve ___ a dívida até o fim do mês.", "quitar", ["quitar", "cancelar", "sacar"],
  "Pagar del todo una deuda → quitar (o saldar) a dívida. Ojo: quitar, en portugués, es pagar.", "quitar a dívida", "saldar la deuda", "economia"),
 (49, "Ele vive ___ mole com o dinheiro e sempre perde.", "dando", ["dando", "fazendo", "tendo"],
  "Descuidarse, regalarse → dar mole (informal).", "dar mole", "descuidarse", "cotidiano"),
 (50, "No trabalho, às vezes a gente tem que ___ sapo.", "engolir", ["engolir", "comer", "tragar"],
  "Tragarse un sapo (aguantar algo) → engolir sapo.", "engolir sapo", "tragarse un sapo", "trabalho"),
 (50, "O plano foi por ___ abaixo quando começou a chover.", "água", ["água", "terra", "chão"],
  "Irse al tacho → ir por água abaixo.", "ir por água abaixo", "irse al tacho", "cotidiano"),
 (51, "Os eleitores vão ___ urnas no domingo.", "às", ["às", "as", "nas"],
  "Ir a votar → ir às urnas (con crase).", "ir às urnas", "ir a votar", "política"),
 (51, "O novo governo ___ posse no dia 1.º de janeiro.", "toma", ["toma", "faz", "dá"],
  "Asumir (el gobierno) → tomar posse. Assumir va con el cargo: assumir o cargo.", "tomar posse", "asumir (el cargo)", "política"),
]

COLOCACOES = [dict(w=c[0], colocacao=c[5], es=c[6], campo=c[7]) for c in _C]

ITEMS = []
_n = {}
for c in _C:
    w = c[0]
    _n[w] = _n.get(w, 0) + 1
    ITEMS.append(dict(id="col-%02d-%d" % (w, _n[w]), w=w, type="choice", topic="colocacoes",
                      level="B1" if w < 27 else "B2" if w < 40 else "C1",
                      prompt=P, stem=c[1], answer=c[2], options=c[3], note=c[4]))
    if w in _LAST:
        ITEMS[-1]["part"] = _LAST[w]
