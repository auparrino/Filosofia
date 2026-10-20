/*
 * Las frases — el banco de conversación de Rumo C1.  La gramática del
 * recorrido te da el sistema; estas frases te dan el habla: bloques listos,
 * de alta frecuencia, para decir sin pensar.  Portugués de Brasil, con Río
 * de Janeiro como escenario (boteco, feira, praia, metrô, calçadão) y, desde
 * el B1, historia, literatura y sociedad de Brasil y de Portugal.
 *
 * Cada frase: [portugués, castellano, nota?].  Cada escena trae `week`: la
 * semana del temario (tools/pt/curriculo.py) en la que se abre; usa solo la
 * gramática enseñada hasta esa semana, salvo fórmulas fijas marcadas en la
 * nota.  Lo coloquial va marcado como tal en la nota.
 *
 * Solo los datos: la lógica de los ejercicios (fichas, escucha, escritura,
 * lampo, «Adiviná») está en el núcleo, docs/js/frasi.js, que lee
 * window.FRASI_DATA.  Los distractores del «Adiviná» son la misma frase con
 * el error típico del hispanohablante: las tablas de traps, abajo.
 */
(function (root) {
  "use strict";

  var SCENES = [
    { id: "oi", week: 1, emoji: "👋", name: "Primeiros passos",
      blurb: "Saludar, presentarte y despedirte como un carioca.",
      phrases: [
        ["Oi, tudo bem?", "Hola, ¿todo bien?", "*Tudo bem?* es literalmente «¿todo bien?», sin verbo: el *está* se cae. Se contesta con el mismo bloque: *tudo bem, e você?* Mismo molde con otro adjetivo: *tudo certo?*, *tudo tranquilo?* Ojo: *tudo* (todo, solo), no «todo»."],
        ["Tudo bem, e você?", "Todo bien, ¿y vos?", "Repetís el saludo como respuesta y lo devolvés con *e você?* (¿y vos?), sin verbo. El *você* brasileño es tu «vos», pero conjuga como «usted»: *você está*, *você é*. Molde: *bem, e você?*, *tudo ótimo, e você?*"],
        ["Tudo ótimo!", "¡Todo genial!", "*Tudo* + adjetivo, sin verbo: la versión entusiasta de *tudo bem*. *Ótimo* viene del latín *optimus*: buenísimo, más fuerte que *bom*. Molde: *tudo certo*, *tudo tranquilo*, *tudo joia* (coloquial). *Tudo*, nunca «todo», cuando va solo."],
        ["Bom dia!", "¡Buen día!", "*Bom* (bueno) + *dia* (masculino), en singular: «buen día», igual que en el Río de la Plata. Con sustantivo femenino cambia: *boa tarde*, *boa noite*, y nunca van en plural. La *m* final no suena como m: nasaliza la *o*."],
        ["Boa tarde, como vai?", "Buenas tardes, ¿cómo le va?", "*Boa* porque *tarde* es femenino, y en singular: donde decís «buenas tardes», acá es «buena tarde». *Como vai?* = «¿cómo va?», de *ir*, con el *você* o *o senhor* implícito: algo más formal que *tudo bem?* Respuesta: *vou bem, obrigado*."],
        ["Boa noite!", "¡Buenas noches!", "*Boa* + *noite* (femenino), en singular: donde decís «buenas noches», el brasileño dice «buena noche». Sirve para saludar al llegar y para despedirte. Las tres del día, siempre en singular: *bom dia*, *boa tarde*, *boa noite*."],
        ["Meu nome é Martín.", "Mi nombre es Martín.", "Literal «mi nombre es Martín»: *meu* (mi) + *nome* + *é* (es, de *ser*). Molde para cualquier dato: *meu telefone é…*, *meu e-mail é…*. En Brasil el posesivo puede llevar artículo, *o meu nome*, algo imposible en español."],
        ["Eu me chamo Sofía.", "Me llamo Sofía.", "Como «me llamo», pero en Brasil el *me* va antes del verbo aunque el *eu* esté dicho; *chamo-me* suena a Portugal o a escrito formal. *Chamar* = llamar: ll- española → *ch-* (*llamar → chamar*, *llover → chover*). Alternativa: *meu nome é Sofía*."],
        ["Muito prazer!", "¡Mucho gusto!", "Literal «mucho placer»: *prazer* = placer, gusto. *Muito* es a la vez «mucho» y «muy» (*muito prazer*, *muito bom*): «muy» no existe. Se contesta *o prazer é meu* (el gusto es mío) o *igualmente*."],
        ["Prazer, eu sou a Bia.", "Un gusto, soy Bia.", "*Prazer* solo = «un gusto». *Eu sou a Bia*: en el habla, el nombre propio lleva artículo (*a Bia*, *o João*), algo que en castellano suena de barrio y en Brasil es lo normal. Molde para presentarte: *prazer, eu sou o Martín*."],
        ["De onde você é?", "¿De dónde sos?", "*De onde* adelante, como «¿de dónde?», pero el sujeto va antes del verbo: *você é*, donde invertimos («¿de dónde sos?»). *Você* conjuga en 3.ª persona, como «usted». Respuesta: *sou de Rosario*. Molde: *onde você mora?*"],
        ["Sou argentino, de Buenos Aires.", "Soy argentino, de Buenos Aires.", "*Sou* ya dice «yo soy»: el *eu* sobra. Nacionalidad con *ser*, sin artículo, y concuerda: *sou argentina*. Detrás, *de* + ciudad para el origen. Molde completo: *sou uruguaio, de Montevidéu*."],
        ["Sou de Rosario, mas moro no Rio.", "Soy de Rosario, pero vivo en Río.", "*Ser de* = origen; *morar em* = vivir, tener casa en (no *viver*, que es «vivir la vida»). *Rio* lleva artículo (*o Rio*), por eso *no Rio*; *Rosario* no. *Mas* = pero; *mais* = más. Molde: *sou de X, mas moro em Y*."],
        ["Você fala espanhol?", "¿Hablás español?", "Es la afirmación *você fala espanhol* con entonación de pregunta: no se invierte ni se agrega nada. *Fala* en 3.ª persona porque *você* conjuga como «usted», aunque sea tu «vos». Molde: *você mora aqui?*, *você gosta de samba?*"],
        ["Falo um pouco de português.", "Hablo un poco de portugués.", "*Falo*: la *-o* ya dice «yo», así que *eu* sobra. *Um pouco de* + sustantivo, igual que en español: *um pouco de água*. *Falar* es el «hablar» de todos los días; *hablar* no existe. En Río la *s* final de *português* suena «sh»."],
        ["Até logo!", "¡Hasta luego!", "*Até* = hasta; *logo* = enseguida, pronto (no el «luego» de «después»). Molde *até* + momento: *até amanhã*, *até sexta*, *até já* (hasta dentro de un rato), *até mais*. Vale para cualquiera, formal o no."],
        ["Até amanhã!", "¡Hasta mañana!", "Mismo molde que *até logo*: *até* + momento. *Amanhã* lleva pegada la *a*: *amanhã* es el día siguiente; *a manhã* es la mañana, parte del día (*de manhã* = a la mañana). La ñ española se escribe *nh* y la *ã* es nasal."],
        ["Tchau, um beijo!", "¡Chau, un beso!", "*Tchau* es nuestro «chau» escrito a la portuguesa (*tch* = nuestra «ch»). *Um beijo* se dice como despedida, sin darlo necesariamente. Entre amigos, *beijo* o *beijos*; entre hombres, *um abraço*. Afectuoso, informal."],
        ["Valeu, falou!", "¡Gracias, nos vemos!", "Coloquial, entre amigos. *Valeu* es literalmente «valió» —pretérito de *valer*, como «valió la pena»—: se agradece diciendo que valió. *Falou* es «habló»: «dicho está», o sea «listo, chau». Cada uno sirve solo: *valeu!* = gracias; *falou!* = chau."]
      ] },

    { id: "socorro", week: 2, emoji: "🛟", name: "Salva-vidas",
      blurb: "Las frases que te rescatan cuando no entendés nada.",
      phrases: [
        ["Desculpa, não entendi.", "Perdón, no entendí.", "Fórmula fija en perfeito (el tiempo llega en la semana 11): *não entendi* = no entendí lo que acabás de decir; *não entendo* es «no entiendo» en general. *Desculpa*, de *desculpar* (disculpar), = perdón; más formal, *desculpe*. *Não* va siempre antes del verbo."],
        ["Pode repetir, por favor?", "¿Podés repetir, por favor?", "Literal «¿puede repetir?»: *pode* es la forma de *você* y el sujeto se omite. Donde decís «¿podés…?», va *pode*, nunca «podes» (eso suena a Portugal). Molde para pedir: *pode* + infinitivo: *pode me ajudar?*, *pode falar mais alto?*"],
        ["Pode falar mais devagar?", "¿Podés hablar más despacio?", "Mismo molde: *pode* + infinitivo. *Mais devagar* = más despacio; *devagar* viene de *de vagar* (con calma). *Mais*, con i, = más; *mas* = pero. Otros pedidos: *mais alto* (más fuerte), *mais uma vez* (otra vez)."],
        ["Como se diz «ventana» em português?", "¿Cómo se dice «ventana» en portugués?", "*Como se diz* + palabra + *em* + idioma: *se* impersonal, como «¿cómo se dice?». El idioma va con *em* y sin artículo: *em português*, *em espanhol*. Respuesta: *janela*. Al revés: *o que quer dizer «janela»?*"],
        ["O que significa essa palavra?", "¿Qué significa esta palabra?", "*O que* = qué, como pronombre: siempre con *o* adelante (*o que é isso?*). *Essa* por «esta»: en el habla *esse/essa* reemplazó a *este/esta*. Molde: *o que significa* + cosa: *o que significa «saudade»?*"],
        ["Como se escreve?", "¿Cómo se escribe?", "*Se* impersonal + verbo en 3.ª persona, igual que «¿cómo se escribe?». Sirve con cualquier verbo: *como se diz?*, *como se pronuncia?* Para una palabra puntual: *como se escreve «saudade»?* *Escrever* = escribir, con *e* y *v*."],
        ["Não sei.", "No sé.", "*Sei* es la 1.ª persona irregular de *saber* («sé»); la negación va pegada antes. Molde: *não sei* + qué o dónde: *não sei onde fica*, *não sei o que dizer*. Coloquial, con encogida de hombros: *sei lá* (qué sé yo)."],
        ["Não lembro a palavra.", "No me acuerdo de la palabra.", "*Lembrar* = acordarse. En el habla de Brasil va sin *me* y sin *de*: *não lembro a palavra*; la versión cuidada lleva los dos: *não me lembro da palavra*. Donde decís «no me acuerdo de…», alcanza *não lembro* + cosa."],
        ["Estou aprendendo português.", "Estoy aprendiendo portugués.", "Como «estoy aprendiendo»: *estar* + gerundio en *-ndo* (*aprendendo*, *falando*, *partindo*). En Brasil es la forma normal para lo que está en curso; en Portugal dirían *estou a aprender*. Molde: *estou estudando*, *estou procurando*."],
        ["Pode me corrigir, por favor?", "¿Me podés corregir, por favor?", "El pronombre va entre *pode* y el infinitivo: literal «¿puede me corregir?», donde decís «¿me podés corregir?» o «¿podés corregirme?». Así se habla en Brasil. Molde *pode me* + verbo: *pode me ajudar?*, *pode me explicar?*"],
        ["Um momento, deixa eu pensar.", "Un momento, dejame pensar.", "*Deixa* es el imperativo de *deixar* (dejar) y detrás va *eu*, no «me»: literal «dejá yo pensar». Así se habla en Brasil; la norma escrita pide *deixe-me pensar*. Molde: *deixa eu ver*, *deixa eu te contar*."],
        ["Você quer dizer que…?", "¿Querés decir que…?", "*Querer dizer* = querer decir, significar, igual que en español. Sirve para chequear lo que entendiste: *você quer dizer que não vem?* Sobre una palabra: *o que quer dizer «janela»?* = ¿qué significa? *Quer*, 3.ª persona, va con *você*."],
        ["Ah, entendi!", "¡Ah, entendí!", "Fórmula fija en perfeito (el tiempo llega en la semana 11): *entendi* = entendí, ya caché. El portugués marca que la comprensión ya llegó, donde a veces decimos «¡ah, entiendo!». Coloquial: *ah, saquei!* (¡ah, caché!)."],
        ["Preciso de ajuda.", "Necesito ayuda.", "*Precisar* = necesitar (no «preciso» de exacto). Con sustantivo lleva *de*: *preciso de ajuda*, *preciso de um médico*; con verbo, sin *de*: *preciso ir*. En una urgencia: *socorro!* (¡auxilio!)."],
        ["Onde fica o banheiro?", "¿Dónde queda el baño?", "*Ficar* = quedar: para lugares fijos se pregunta *onde fica…?* («¿dónde queda?»), más que *onde está*. Molde: *onde fica a estação?*, *onde fica a praia?* *Banheiro* = baño (de *banho*); en Portugal, *casa de banho*."],
        ["Tudo bem, não tem problema.", "Está bien, no hay problema.", "Donde el español dice «no hay», el Brasil hablado usa *ter*: *não tem problema*; *há* queda para lo escrito. *Tudo bem* acá es «está bien». Molde *não tem* + sustantivo: *não tem jeito* (no hay caso), *não tem pressa* (no hay apuro)."],
        ["Você pode escrever aqui?", "¿Me lo podés escribir acá?", "*Você pode* + infinitivo = ¿podés…?, con el *você* dicho. Donde decís «¿me lo escribís?», el portugués omite *me* y el objeto: el contexto alcanza. *Aqui* = acá; *aí* = ahí, donde estás vos; *lá* = allá."]
      ] },

    { id: "boteco", week: 3, emoji: "🍺", name: "No boteco",
      blurb: "Pedir una cerveza bien gelada y algo para picar, a la carioca.",
      phrases: [
        ["Uma cerveja bem gelada, por favor.", "Una cerveza bien fría, por favor.", "Pedido sin verbo: cosa + *por favor*. *Bem* + adjetivo = bien, muy: *bem gelada*. Para bebidas se dice *gelada* (de *gelo*, hielo), no *fria*. En Río se exagera: *estupidamente gelada*. Molde: *um suco bem gelado*."],
        ["Me vê um chope?", "¿Me traés un chopp?", "Literal «¿me ves un chopp?»: *vê*, de *ver*, en el sentido de «fijate, conseguime». Coloquial y muy común para pedir en bar o comercio: *me vê uma água*, *me vê a conta*. El *chope* es la cerveza tirada, en vaso chico."],
        ["Mais uma rodada!", "¡Otra vuelta!", "*Mais um* / *mais uma* = «uno más», donde decís «otro»: el portugués suma, más que decir *outro*. Concuerda con lo pedido: *mais uma rodada*, *mais um chope*. *Rodada* (de *rodar*) = vuelta de tragos."],
        ["Tem mesa para quatro?", "¿Hay mesa para cuatro?", "*Tem*, de *ter*, sin sujeto = ¿hay?: en el Brasil hablado *ter* reemplaza a *haver*. *Mesa* sin artículo, como «¿hay mesa?». *Para* + número = para cuántos: *para dois*, *para duas pessoas*. Molde: *tem* + cosa?"],
        ["Uma porção de batata frita.", "Una porción de papas fritas.", "*Porção de* + comida, sin artículo: la unidad de picada del boteco (*porção de calabresa*, *de mandioca*). *Batata frita* va en singular, donde decís «papas fritas». *Batata* = papa; la batata es *batata-doce*."],
        ["Uma caipirinha sem açúcar, por favor.", "Una caipiriña sin azúcar, por favor.", "Cosa + *sem* + lo que no querés: *sem açúcar*, *sem gelo*, *sem cebola*. *Sem* es nasal, algo como «sein». *Caipirinha* es el diminutivo de *caipira* (campesino): el trago de cachaça, lima y azúcar."],
        ["A conta, por favor.", "La cuenta, por favor.", "Alcanza el sustantivo con artículo + *por favor*, como en español. Más completo: *me traz a conta?* o *pode trazer a conta?* (¿me traés la cuenta?). *Conta* es la del bar y también la cuenta bancaria."],
        ["Vamos dividir a conta?", "¿Dividimos la cuenta?", "*Vamos* + infinitivo = propuesta, «¿dividimos?». Sin *a*: donde decís «vamos a dividir», va *vamos dividir*. Molde: *vamos pedir?*, *vamos embora?* (¿nos vamos?). Coloquial: *vamos rachar?* (¿hacemos vaquita?)."],
        ["Os dez por cento estão incluídos?", "¿Está incluido el diez por ciento?", "*Os dez por cento* es la propina de servicio: va en plural por *dez*, y el verbo concuerda: *estão incluídos*; en español lo decimos en singular. Es opcional: podés pedir que lo saquen. Molde: *o serviço está incluído?*"],
        ["Hoje eu pago!", "¡Hoy pago yo!", "Presente para un futuro inmediato, como en español. El *eu* explícito es el énfasis: en portugués se suele omitir, así que decirlo ya significa «yo». Ojo al orden: sujeto antes del verbo, *eu pago*, donde decís «pago yo»."],
        ["Saúde!", "¡Salud!", "Para brindar, como «¡salud!»: *saúde* es la salud. La tilde separa la *ú*: *sa-ú-de*, tres sílabas. El mismo sustantivo está en *plano de saúde* (prepaga) y en el *saúde!* que se le dice a quien estornuda."],
        ["Essa cadeira está livre?", "¿Esta silla está libre?", "*Essa* = esta, en el habla. *Estar livre* = estar desocupada ahora (con *estar*, porque es pasajero). Falso amigo: *cadeira* = silla; la cadera es *quadril*. Molde: *esse lugar está livre?*, *essa mesa está livre?*"],
        ["Tem cardápio?", "¿Tienen carta?", "*Tem* impersonal = ¿hay?, ¿tienen?, con el sustantivo solo, sin sujeto ni artículo: *tem cardápio?*, *tem wi-fi?* *Cardápio* = la carta, el menú; *carta* es sobre todo la carta de correo. Molde: *tem* + cosa?"],
        ["O que tem pra petiscar?", "¿Qué hay para picar?", "*O que* (qué) + *tem* (hay) + *para* + infinitivo = ¿qué hay para…?: *o que tem para beber?* *Petiscar* = picar algo; *o petisco*, cada cosa de la picada. Ojo: *picar* en portugués es pinchar o cortar en trocitos. Así suena en la calle: *para a* se dice *pra* y *para o*, *pro*; por escrito, la forma plena."],
        ["Um guaraná, por favor.", "Un guaraná, por favor.", "El pedido mínimo: *um* / *uma* + cosa + *por favor*. *Guaraná* es masculino: *um guaraná*, *o guaraná*. Molde: *uma água sem gás*, *um suco de laranja*. Es la gaseosa brasileña hecha con el fruto del guaraná."],
        ["Pode trazer mais gelo?", "¿Podés traer más hielo?", "*Pode* + infinitivo = ¿podés…?, pedido cortés sin sujeto. *Mais* + sustantivo, sin artículo = más: *mais gelo*, *mais pão*. *O gelo* = el hielo; de ahí *gelado* (muy frío) y *geladeira* (heladera)."],
        ["Esse bolinho de bacalhau está uma delícia!", "¡Este buñuelo de bacalao está riquísimo!", "*Estar* + *uma* + sustantivo: el molde brasileño del elogio, literal «está una delicia». También *está um sonho*, *está uma maravilha*. *Bolinho* = bolita, diminutivo de *bolo*: el buñuelo frito. *Esse*, del habla, por *este*."],
        ["Garçom, mais um, por favor!", "¡Mozo, otro, por favor!", "*Garçom* (del francés *garçon*) = mozo, y se usa para llamarlo. *Mais um*, sin sustantivo = otro igual; masculino porque se sobreentiende *chope*. Si es cerveza: *mais uma*. Donde decís «otro», el portugués dice «uno más»."]
      ] },

    { id: "padaria", week: 4, emoji: "🥐", name: "Na padaria",
      blurb: "El café da manhã: pão de queijo, pingado y pão na chapa.",
      phrases: [
        ["Um pão na chapa e um pingado, por favor.", "Un pan a la plancha y un cortado, por favor.", "*Na chapa* = en la plancha: donde decís «a la plancha», el portugués dice «en la». *Pingado* es participio de *pingar* (gotear): café con un chorrito de leche, nuestro cortado. Pedido con *e*: *um pão de queijo e um suco*."],
        ["Quanto custa o pão de queijo?", "¿Cuánto sale el pan de queso?", "*Quanto custa* + cosa = ¿cuánto sale?, sin «me». *Custar* concuerda con lo que se compra: *quanto custam os pães?* El *pão de queijo* es una bolita de fécula de mandioca y queso, típica de Minas Gerais."],
        ["Quanto é?", "¿Cuánto es?", "Literal «¿cuánto es?», sin sujeto: pregunta por el total. Variante muy usada: *quanto fica?* (¿cuánto queda?). Para una sola cosa: *quanto custa?* La respuesta va en plural: *são dez reais*."],
        ["Me dá dois pães franceses?", "¿Me das dos pancitos?", "*Me dá* + cosa = pedir en un comercio, literal «¿me das…?», sin «podés»: *me dá um café*. Coloquial pero normalísimo. *Pão → pães*: plural en *-ães*. El *pão francês* es el pancito de todos los días, nada francés."],
        ["Posso pagar com cartão?", "¿Puedo pagar con tarjeta?", "*Posso* (puedo, 1.ª persona irregular de *poder*) + infinitivo, sin preposición. *Com cartão* o *no cartão* («en la tarjeta»); en efectivo, *em dinheiro*. Molde: *posso pagar no Pix?*, *posso deixar aqui?*"],
        ["Aceita Pix?", "¿Acepta Pix?", "*Aceita*, 3.ª persona: le hablás al local o al vendedor sin nombrarlo (*você*, *o senhor*). Sin sujeto ni artículo: *aceita cartão?*, *aceita dinheiro?* El Pix es la transferencia instantánea del Banco Central que usa todo Brasil."],
        ["Um café com leite bem quente.", "Un café con leche bien caliente.", "Pedido sin verbo: cosa + detalle. *Bem* + adjetivo = bien, muy: *bem quente*, *bem gelado*. Cuidado: *o leite* es masculino (en español «la leche»), así que *leite quente*, *leite gelado*."],
        ["Um suco de laranja natural, sem açúcar.", "Un jugo de naranja natural, sin azúcar.", "*Suco de* + fruta, sin artículo: *suco de laranja*, *de maracujá*. *Natural* = exprimido en el momento, no de caja. *Sem açúcar* conviene aclararlo: muchos lugares lo endulzan. *Laranja* = naranja, sin la *n* inicial."],
        ["É para viagem.", "Es para llevar.", "Literal «es para viaje»: *para viagem* = para llevar; lo opuesto, *para comer aqui*. Es la respuesta a *é para viagem?* (¿para llevar?). Molde *é para* + destino: *é para presente* (es para regalo)."],
        ["Tem alguma coisa sem glúten?", "¿Hay algo sin gluten?", "*Alguma coisa* = alguna cosa, algo. *Tem* impersonal = hay. *Sem* + sustantivo = sin. Molde para restricciones: *tem alguma coisa sem lactose?*, *sem açúcar?* *Glúten* lleva tilde: tónica en *glú-*."],
        ["O pão está quentinho!", "¡El pan está calentito!", "*Quente* + *-inho*: el diminutivo brasileño no achica, intensifica y da cariño: *quentinho* = calentito, recién hecho. *Estar* porque es el estado de ahora. Molde: *geladinho*, *pertinho* (bien cerca), *cedinho* (tempranito)."],
        ["Um cafezinho?", "¿Un cafecito?", "*Café* + *-zinho*: tras vocal tónica, el diminutivo se arma con *-zinho* (*cafezinho*, *pezinho*). El *cafezinho* es el café chico que se ofrece por cortesía en casas y oficinas. Así, sin verbo, es una invitación: «¿un cafecito?»."],
        ["Pode ficar com o troco.", "Quedate con el vuelto.", "*Ficar com* + cosa = quedarse con. *Pode* + infinitivo suaviza, «podés quedarte», donde el español usa el imperativo «quedate». *Ficar* no lleva *se*. *O troco* = el vuelto; de *trocar*, cambiar."],
        ["Tem leite sem lactose?", "¿Hay leche sin lactosa?", "*Tem* + producto, sin artículo = ¿hay…?: en el habla *ter* reemplaza a *haver*. *Sem* + lo que no querés. Molde: *tem pão integral?*, *tem café sem açúcar?* Cuidado: *leite* es masculino: *leite desnatado*."],
        ["Um misto quente, por favor.", "Un tostado de jamón y queso, por favor.", "*Misto* (mixto: jamón y queso) + *quente* (caliente) = el tostado; frío, es *misto frio*. Masculino: *um misto*. Molde de pedido: *um* / *uma* + cosa + *por favor*."],
        ["Muito obrigada!", "¡Muchas gracias!", "*Obrigado* es un participio, «obligado», en deuda: por eso concuerda con quien habla. Una mujer dice *obrigada*; un hombre, *obrigado*. *Muito* = mucho y muy; nunca «muy». Respuesta: *de nada* o *imagina*."]
      ] },

    { id: "trabalho", week: 5, emoji: "💼", name: "No trabalho",
      blurb: "Reuniones, correos y charla de oficina, con você y a gente.",
      phrases: [
        ["O que você faz?", "¿De qué trabajás?", "Literal «¿qué hacés?», pero se entiende «¿a qué te dedicás?». *O que* = qué, con *o* adelante; *faz*, de *fazer*, va con *você*. Variante: *você trabalha com o quê?* Para lo de este momento: *o que você está fazendo?*"],
        ["Trabalho com marketing.", "Trabajo en marketing.", "*Trabalhar com* + área = trabajar en un rubro: donde decís «en», va *com*: *trabalho com tecnologia*, *com vendas*. *Em* queda para el lugar: *trabalho num banco*. *Trabalho*: j española → *lh*."],
        ["Trabalho numa empresa de tecnologia.", "Trabajo en una empresa de tecnología.", "*Em* + lugar para dónde trabajás (*numa empresa*, *num hospital*); *com* + rubro para de qué (*trabalho com tecnologia*). *Numa* = em + uma: en el habla casi siempre contraído. *Empresa de* + sector: *empresa de turismo*."],
        ["Sou professora de espanhol.", "Soy profesora de español.", "*Ser* + profesión, sin artículo, como en español: *sou médico*, *sou engenheira*. *Professora de* + materia. Para lo pasajero, *estar*: *estou de férias*. *Espanhol*: la ñ española se escribe *nh*."],
        ["A reunião começa às dez.", "La reunión empieza a las diez.", "La hora lleva *às* = a + *as*, porque se sobreentiende *horas* (femenino): *às dez*, *às três*; a la una, *à uma*. *Começar* = empezar. *Reunião*: -ión española → *-ião* (*opinião*, *televisão*)."],
        ["Estou numa reunião agora.", "Estoy en una reunión ahora.", "*Estar em* + actividad o lugar del momento: *estou numa reunião*, *estou no metrô*. *Numa* = em + uma. Sirve para disculparte y cortar: *estou numa ligação* (en una llamada), *estou dirigindo* (manejando)."],
        ["Mando o e-mail hoje.", "Mando el mail hoy.", "Presente con valor de futuro próximo, como en español. *Mandar* = enviar, el verbo de todos los días. Molde para comprometerte: presente + momento: *ligo amanhã*, *resolvo isso hoje*, *respondo depois*."],
        ["A gente almoça ao meio-dia.", "Almorzamos al mediodía.", "*A gente* (literal «la gente») es «nosotros» en el habla, con verbo en 3.ª singular: *a gente almoça*, no «almoçamos». Más usado que *nós* en la charla. *Ao meio-dia* = a + o: *meio-dia* es masculino."],
        ["Trabalho de casa às sextas.", "Los viernes trabajo desde casa.", "*De casa* = desde casa: donde decís «desde», el portugués usa *de*. *Às sextas* = los viernes, por costumbre: *às* + día en plural. Los días hábiles se cuentan: *segunda*, *terça*… *sexta* (de *sexta-feira*)."],
        ["Meu chefe é muito exigente.", "Mi jefe es muy exigente.", "*Muito* + adjetivo = muy; «muy» no existe. *Ser* porque es su manera de ser. Posesivo sin artículo, frecuente en Brasil: *meu chefe* o *o meu chefe*. *Exigente* sirve para los dos géneros: *minha chefe é exigente*."],
        ["Tenho muito trabalho hoje.", "Tengo mucho trabajo hoy.", "*Tenho* = tengo (1.ª persona irregular de *ter*). *Muito* ante sustantivo concuerda: *muito trabalho*, *muita coisa*, *muitos e-mails*. *Trabalho*: j española → *lh* (*trabajo → trabalho*, *mejor → melhor*)."],
        ["Qual é o prazo?", "¿Cuál es el plazo?", "*Qual é* + sustantivo = ¿cuál es…?, aun donde a veces decimos «qué»: *qual é o seu nome?* *Prazo* = plazo (pl- → *pr-*: *plazo → prazo*, *playa → praia*). Molde: *qual é o horário?*"],
        ["Você tem um minuto?", "¿Tenés un minuto?", "Para interrumpir con cortesía. Se contesta repitiendo el verbo, no con «sí»: *tenho* o *tenho, sim*; si no: *agora não*. Así responde el portugués a las preguntas de sí o no. Versión más suave: *tem um minutinho?*"],
        ["Tô sem tempo agora.", "Ahora no tengo tiempo.", "*Estar sem* + sustantivo = no tener algo en este momento, literal «estoy sin tiempo». Donde decís «no tengo», el portugués prefiere el estado. Molde: *estou sem dinheiro*, *estou sem bateria*. *Tô* y *tá* son *estou* y *está* en la boca: así habla todo Brasil; en un texto formal, la forma plena."],
        ["Os colegas são muito legais.", "Los compañeros son muy buena onda.", "*Legal* = buena onda, copado (además de «legal» de ley). Plural *-al → -ais*: *legais*, como *reais*, *jornais*. *Ser legal* para la persona; *que legal!* = ¡qué bueno! *Colegas* = compañeros de trabajo."],
        ["Saio do escritório às seis.", "Salgo de la oficina a las seis.", "*Saio*: 1.ª persona irregular de *sair* (salir). *Sair de* + lugar: *saio do escritório*, *saio de casa*. Falso amigo: *escritório* = oficina; la *oficina* brasileña es el taller mecánico. *Às seis* = a las seis."],
        ["Bom fim de semana!", "¡Buen fin de semana!", "*Bom* concuerda con *fim* (masculino): «buen fin de semana». Molde de despedida *bom* / *boa* + sustantivo: *boa semana*, *bom trabalho*, *boa viagem*. En mensajes, *fim de semana* se abrevia *fds*."]
      ] },

    { id: "planos", week: 6, emoji: "🎉", name: "Planos e convites",
      blurb: "Invitar, aceptar y zafar: bora?, partiu?, fechou!",
      phrases: [
        ["Bora pra praia?", "¿Vamos a la playa?", "Coloquial. *Bora* es *vamos embora* («vámonos») gastado hasta dos sílabas: ¡vamos! Molde: *bora* + *para* + lugar, o + infinitivo: *bora comer?* En la boca, *para a* suena *pra*: *bora pra praia?* Así suena en la calle: *para a* se dice *pra* y *para o*, *pro*; por escrito, la forma plena."],
        ["Partiu Arpoador!", "¡Vamos al Arpoador!", "Coloquial y juvenil. *Partiu* es «partió», perfeito de *partir* (salir, irse): anunciás la salida como si ya hubiera pasado. Molde: *partiu* + lugar sin preposición (*partiu praia!*) o + infinitivo (*partiu almoçar?*)."],
        ["Vamos tomar um chope depois do trabalho?", "¿Vamos a tomar un chopp después del trabajo?", "*Vamos* + infinitivo = propuesta, sin la *a* de «vamos a tomar». *Tomar* va con bebidas. *Depois de* = después de; con artículo se funde: *depois do trabalho*, *depois da aula*. Molde: *vamos jantar depois do cinema?*"],
        ["Você quer ir ao cinema?", "¿Querés ir al cine?", "*Querer* + infinitivo, sin preposición: *quer ir*. *Ir a* + lugar: *ao cinema* (a + o), *à praia* (a + a). En el habla se oye *ir no cinema*, coloquial. Molde de invitación: *você quer* + verbo?"],
        ["Fechou!", "¡Trato hecho! / ¡Dale!", "Coloquial. Perfeito de *fechar* (cerrar) congelado: «¡cerró!», o sea trato cerrado, ¡dale! Sirve para aceptar un plan o un precio, sin sujeto. Como pregunta: *fechou?* (¿cerramos?). Primos: *combinado!*, *beleza!*"],
        ["Combinado!", "¡Quedamos así!", "Participio de *combinar* (acordar un plan) usado solo: «combinado», quedamos así. Ojo: *combinar* es arreglar un encuentro (*combinar um jantar*); *combinar com* es hacer juego con. Molde: *tá combinado*, *combinado, então*."],
        ["Que horas a gente se encontra?", "¿A qué hora nos encontramos?", "*Que horas…?* = ¿a qué hora?: en el habla se cae la *a* (*a que horas* es lo cuidado). *A gente* = nosotros, con pronombre y verbo de 3.ª singular: *a gente se encontra*. Cuidado: *que horas são?* = ¿qué hora es?"],
        ["Pode ser às oito?", "¿Puede ser a las ocho?", "*Pode ser* = puede ser: proponer sin imponer. *Às oito*: *às* = a + as, porque las horas son femeninas (*as horas*). Molde: *pode ser amanhã?*, *pode ser no sábado?* Para aceptar: *pode!*"],
        ["Hoje não posso, tenho um compromisso.", "Hoy no puedo, tengo un compromiso.", "Molde para zafar: *não posso* + excusa. *Posso* (de *poder*) y *tenho* (de *ter*) son irregulares en 1.ª persona. *Compromisso* = cualquier cita u obligación, no algo solemne. Coloquial: *hoje não dá* (hoy no puedo)."],
        ["Fica pra próxima!", "¡Queda para la próxima!", "*Ficar para* = quedar para más adelante, sin sujeto. *A próxima* sobreentiende *vez*. En la boca: *fica pra próxima*. Molde: *fica para amanhã*, *fica para depois*. Suaviza un «no» sin cerrar la puerta. Así suena en la calle: *para a* se dice *pra* y *para o*, *pro*; por escrito, la forma plena."],
        ["Topa um samba na Lapa na sexta?", "¿Te prendés a un samba en Lapa el viernes?", "Coloquial. *Topar* = aceptar una propuesta: *topa?* (¿te prendés?), *topo!* (¡me prendo!). Va con objeto directo, sin preposición: *topa um cinema?*, o con infinitivo: *topa ir?* *Na sexta* = el viernes."],
        ["A gente se vê lá.", "Nos vemos allá.", "*A gente* (nosotros) + *se* + verbo en 3.ª singular = nos vemos: donde decís «nos», va *se*. Molde de despedida: *a gente se vê amanhã*, *a gente se fala* (hablamos). *Lá* = allá."],
        ["Quer vir comigo?", "¿Querés venir conmigo?", "*Querer* + infinitivo, sin preposición; el *você* se sobreentiende. *Vir* = venir, hacia donde está quien habla; *ir*, hacia otro lado. *Com* + *mim* se funde en *comigo*, como «conmigo»; con vos: *com você*."],
        ["Tô dentro!", "¡Me prendo!", "Literal «estoy adentro»: me sumo al plan. Lo contrario: *estou fora* (estoy afuera) = paso, no voy. Coloquial, tan natural como nuestro «me prendo». Para preguntar: *tá dentro?* (¿te sumás?). *Tô* y *tá* son *estou* y *está* en la boca: así habla todo Brasil; en un texto formal, la forma plena."],
        ["Vamos ver, depois eu te falo.", "Veremos, después te aviso.", "*Vamos ver* = veremos. *Falar* sirve en el habla como «decir, avisar»: *depois te falo*. *Te* (de *tu*) convive con *você* en Río, aunque la gramática escolar lo condene. Molde: *depois te conto* (después te cuento)."],
        ["Que tal um passeio no Jardim Botânico?", "¿Qué tal un paseo por el Jardín Botánico?", "*Que tal* + sustantivo = ¿qué tal si…?: *que tal um cinema?*; con verbo: *que tal a gente ir?* *No Jardim Botânico*: el portugués usa *em* donde decís «por». *Passeio* = paseo; *passear* = pasear."],
        ["Onde a gente se encontra?", "¿Dónde nos encontramos?", "*Onde* + sujeto + verbo: en la pregunta hablada el sujeto suele ir antes del verbo. *Encontrar-se* = encontrarse con alguien; con *a gente*, *se* y 3.ª singular. Molde: *onde a gente se vê?*, *onde a gente come?*"]
      ] },

    { id: "feira", week: 7, emoji: "🍍", name: "Na feira",
      blurb: "Precios, kilos y regateo en la feria de la calle.",
      phrases: [
        ["Quanto custa o quilo do tomate?", "¿Cuánto sale el kilo de tomate?", "Unidad + *de* + producto con artículo: *o quilo do tomate*, *o quilo da banana*, donde decís «de tomate». Coloquial para el precio del día: *quanto tá o tomate?* (¿a cuánto está?)."],
        ["Está caro!", "¡Está caro!", "*Estar caro* = el precio está alto ahora, esta vez; *ser caro* = es caro siempre. Mismo contraste que en español. Para regatear: *está caro, faz por menos?* Coloquial: *tá caro*."],
        ["Faz por dez reais?", "¿Me lo dejás en diez reales?", "*Fazer por* + precio = dejarlo en: literal «¿lo hacés por diez reales?». Regateo típico de feria. Molde: *faz por vinte?*, *faz um desconto?* *Reais*, plural de *real* (-al → -ais)."],
        ["Me vê meio quilo de uva.", "Dame medio kilo de uva.", "Coloquial: *me vê* + cantidad = dame, en un comercio. *Meio* concuerda: *meio quilo*, *meia dúzia*; con la hora, *meio-dia* y *seis e meia*. *Uva* va en singular después de una cantidad."],
        ["Uma dúzia de bananas, por favor.", "Una docena de bananas, por favor.", "Cantidad + *de* + producto en plural, como en español: *uma dúzia de ovos*. *Dúzia* = docena; el número doce es *doze*. Molde: *meia dúzia de limões*, *um quilo de batata*."],
        ["Tem troco pra cinquenta?", "¿Tenés cambio de cincuenta?", "*Ter troco para* + billete = tener cambio de: donde decís «de cincuenta», va *para*. *Troco* es el vuelto y lo suelto. *Tem*, sin sujeto: le hablás al vendedor. *Cinquenta*, sin diéresis desde el Acuerdo de 1990. Así suena en la calle: *para a* se dice *pra* y *para o*, *pro*; por escrito, la forma plena."],
        ["Posso provar?", "¿Puedo probar?", "*Posso* + infinitivo = ¿puedo…?: pedir permiso. *Provar* = probar comida y también ropa. Molde: *posso ver?*, *posso escolher?* (¿puedo elegir?). Probar algo nuevo por primera vez: *experimentar*."],
        ["Essa manga está madura?", "¿Este mango está maduro?", "*A manga* = el mango (la fruta), femenino; también la manga de la camisa. *Estar maduro* = estar a punto, y concuerda: *madura*. *Essa* por *esta*, del habla. Molde: *esse abacate está maduro?*"],
        ["Um pastel de queijo e um caldo de cana.", "Una empanada de queso y un jugo de caña.", "El *pastel* de feria es una empanada frita, rectangular; la torta es *bolo*. *Caldo de cana* = jugo de caña recién molida: *caldo* acá no es sopa. Molde: *um pastel de carne*, *um pastel de palmito*."],
        ["São dois reais cada.", "Son dos reales cada uno.", "El precio va en plural con *são*: *são dois reais*; en singular solo con uno: *é um real*. *Real → reais*. *Cada* va solo, sin «uno»: *dois reais cada* = dos reales cada uno."],
        ["Só isso, obrigado.", "Nada más, gracias.", "*Só* = solo; *isso* = eso: «solo eso», donde decís «nada más». Para seguir pidiendo: *e mais…* *Obrigado* si lo dice un hombre; *obrigada*, una mujer. Molde: *só um*, *só um pouquinho*."],
        ["O abacaxi está docinho hoje!", "¡El ananá está dulcecito hoy!", "*Doce* + *-inho* = *docinho*: el diminutivo intensifica, «bien dulce». *Estar* porque es cómo está hoy. *Abacaxi* = ananá; en la charla, *um abacaxi* es también un problema difícil de resolver."],
        ["Quanto é tudo?", "¿Cuánto es todo?", "*Tudo* = todo, pronombre solo (la totalidad); ante sustantivo va *todo*: *todo o dinheiro*. Donde decís «todo», fijate si va solo (*tudo*) o acompañado (*todo*). Variante: *quanto dá tudo?* (¿cuánto da todo?)."],
        ["Hoje é dia de feira.", "Hoy hay feria.", "*Dia de* + sustantivo sin artículo: *dia de feira*, *dia de praia*, *dia de jogo*. Donde decís «hoy hay feria», el portugués dice que el día es de feria: *hoje é*. En Río cada barrio tiene su feria un día fijo."],
        ["A feira fecha ao meio-dia.", "La feria cierra al mediodía.", "*Ao meio-dia* = a + o, porque *meio-dia* es masculino; con horas va *às*: *às duas*. *Fechar* = cerrar. Molde de horario: *abre às sete e fecha ao meio-dia*."],
        ["Me dá uma sacola?", "¿Me das una bolsa?", "*Me dá* + cosa = pedir en un comercio. *Sacola* = bolsa de las compras. Falso amigo: *bolsa* es la cartera de mujer (y la Bolsa de valores). La de plástico: *sacola plástica*."]
      ] },

    { id: "praia", week: 8, emoji: "🏖️", name: "Na praia",
      blurb: "Copacabana, Ipanema y el calçadão: sombrilla, mate y biscoito Globo.",
      phrases: [
        ["Vamos à praia?", "¿Vamos a la playa?", "*À* = *a* + *a* (*a praia*): la preposición se funde con el artículo femenino y lleva acento grave. En el habla se oye *vamos na praia* o *vamos pra praia*. Molde: *vou à feira*, *vou ao mercado* (a + o)."],
        ["Tô passando protetor solar.", "Me estoy poniendo protector solar.", "*Passar* + crema = ponérsela, literal «pasar»: *passar protetor*, *passar batom*. Sin *me*: el portugués no necesita el pronombre. *Estar* + gerundio para lo que hacés ahora. *Tô* y *tá* son *estou* y *está* en la boca: así habla todo Brasil; en un texto formal, la forma plena."],
        ["O mar tá uma delícia hoje.", "El mar está buenísimo hoy.", "*Estar* + *um* / *uma* + sustantivo: molde brasileño para valorar, literal «está una delicia». También *está um gelo* (heladísimo) y *está um forno* (un horno). *O mar* es masculino. *Tô* y *tá* son *estou* y *está* en la boca: así habla todo Brasil; en un texto formal, la forma plena."],
        ["Cuidado, a água está gelada!", "¡Cuidado, el agua está helada!", "*A água*: femenina con artículo *a*, donde el español dice «el agua». Por eso *gelada*. *Cuidado* sirve solo como aviso; con objeto: *cuidado com* + cosa: *cuidado com a onda*."],
        ["Vou alugar uma cadeira e um guarda-sol.", "Voy a alquilar una silla y una sombrilla.", "*Ir* + infinitivo sin *a*: *vou alugar* = voy a alquilar. *Guarda-sol* = «guarda del sol», la sombrilla; mismo molde en *guarda-chuva* (paraguas). *Cadeira* = silla; en la playa, la reposera."],
        ["Me vê um mate e um biscoito Globo.", "Dame un mate y unas rosquitas Globo.", "*Me vê* + cosa: pedido coloquial. En la playa carioca el *mate* es té helado de yerba tostada, y el *biscoito Globo*, unas rosquitas de fécula en paquete. Para dos: *me vê dois mates*."],
        ["Onde fica o posto nove?", "¿Dónde queda el puesto nueve?", "*Onde fica…?* para lugares fijos. Las playas de Río se ubican por *postos*, los puestos de guardavidas numerados: *o posto nove* está en Ipanema. Molde de cita: *a gente se encontra no posto nove*."],
        ["O pôr do sol no Arpoador é lindo.", "La puesta de sol en el Arpoador es hermosa.", "*Pôr do sol* = literal «el poner del sol»: el infinitivo *pôr* funciona como sustantivo. *Lindo* = hermoso, más usado que *bonito*. *No Arpoador*: el lugar lleva artículo. Allí la gente aplaude cuando se esconde el sol."],
        ["Vou dar um mergulho.", "Me voy a dar un chapuzón.", "*Dar um* + sustantivo = hacer algo una vez, rápido: *dar um mergulho* (zambullirse), *dar uma volta*, *dar uma olhada*. Donde decís «darse», no va *se*: *vou dar*. *Mergulho* viene de *mergulhar* (sumergirse, bucear)."],
        ["A gente tá esperando vocês no quiosque.", "Los estamos esperando en el quiosco.", "*Esperar* + persona, sin preposición: *esperando vocês*, donde decís «esperándolos a ustedes». *Vocês* = ustedes. *A gente está* = estamos, verbo en singular. *Quiosque* = el parador de la playa. *Tô* y *tá* son *estou* y *está* en la boca: así habla todo Brasil; en un texto formal, la forma plena."],
        ["Vou dar uma volta no calçadão.", "Voy a dar una vuelta por la rambla.", "*Dar uma volta* = dar una vuelta, el molde *dar um* / *uma* + sustantivo. *No calçadão*: *em* donde decís «por». *Calçadão* es el aumentativo de *calçada* (vereda): la rambla de Copacabana, con ondas de piedra portuguesa."],
        ["Tem bandeira vermelha hoje.", "Hoy hay bandera roja.", "*Tem* impersonal = hay, sin artículo. *Vermelho* / *vermelha* = rojo; ojo, *roxo* es violeta. Bandera roja: mar peligroso; amarilla, precaución; verde, tranquilo. Molde: *tem onda grande hoje*."],
        ["Cê tá vendo aquela onda?", "¿Estás viendo esa ola?", "*Aquela* = aquella, lo lejano; *essa*, lo cercano. *Estar* + gerundio para lo que pasa ahora mismo, más natural que el presente en esta pregunta. *Onda* = ola. Molde: *você está ouvindo?* *Tô* y *tá* son *estou* y *está* en la boca: así habla todo Brasil; en un texto formal, la forma plena. *Cê* es *você* achicado, muy común en el habla rápida; por escrito, siempre *você*."],
        ["Esqueci a toalha!", "¡Me olvidé la toalla!", "Fórmula fija en perfeito (el tiempo llega en la semana 11). *Esquecer* va sin *me* y sin *de*: *esqueci a toalha*, donde decís «me olvidé la toalla». Molde: *esqueci o protetor*. *Toalha*: ll española → *lh*."],
        ["Que calor, hein!", "¡Qué calor, eh!", "*Que* + sustantivo = ¡qué…!: *que calor*, *que frio*, *que sede*. *Hein* al final refuerza y pide acuerdo, como nuestro «eh». Molde: *que dia lindo, hein!*"],
        ["Vai chover mais tarde.", "Va a llover más tarde.", "*Ir* + infinitivo = el futuro del habla: *vai chover*, sin *a*. *Chover* va sin sujeto, como «llover». Ll- española → *ch-*: *llover → chover*, *lleno → cheio*, *llave → chave*."]
      ] },

    { id: "metro", week: 9, emoji: "🚇", name: "Metrô, ônibus e Uber",
      blurb: "Moverse por Río: direcciones, metrô, ônibus y aplicaciones.",
      phrases: [
        ["Com licença, onde fica a estação de metrô?", "Disculpe, ¿dónde queda la estación de metro?", "*Com licença* = literal «con permiso»: para abordar a un desconocido o pedir paso, antes de la pregunta. *Onde fica…?* para lugares fijos. *Estação de* + transporte, sin artículo: *estação de trem*."],
        ["É longe daqui?", "¿Es lejos de acá?", "La distancia va con *ser*: *é longe* (es lejos), *é perto* (es cerca). *Daqui* = de + aqui: el portugués funde la preposición con el adverbio. Molde: *é longe do centro?*, *é perto da praia?*"],
        ["É só seguir em frente e virar à direita.", "Es seguir derecho y doblar a la derecha.", "*É só* + infinitivo = alcanza con…: *é só perguntar*. *Seguir em frente* = seguir derecho (literal «en frente»). *Virar* = doblar, y la dirección va con *à*: *virar à direita*, *à esquerda*."],
        ["Esse ônibus passa por Botafogo?", "¿Este colectivo pasa por Botafogo?", "*Passar por* + lugar, como en español. *Ônibus* = colectivo, igual en singular y en plural: *os ônibus*. *Esse* por *este*, del habla. Molde: *esse ônibus vai para Copacabana?*"],
        ["Qual é a próxima estação?", "¿Cuál es la próxima estación?", "*Qual é…?* = ¿cuál es…?, también donde a veces decimos «¿qué…?»: *qual é o seu nome?* *Próxima* = siguiente. Molde: *qual é a linha?*, *qual é o ponto?* (la parada del colectivo)."],
        ["Preciso descer na General Osório.", "Me tengo que bajar en General Osório.", "*Precisar* + infinitivo, sin *de* = tengo que. *Descer* = bajar(se), sin *me*: *preciso descer*. *Na General Osório*: se sobreentiende *a estação*, femenino. La estación General Osório está en Ipanema."],
        ["Quanto tempo leva a pé?", "¿Cuánto se tarda a pie?", "*Levar* + tiempo = tardar, con el trayecto como sujeto: literal «¿cuánto tiempo lleva?». *A pé* = a pie; con vehículo, *de*: *de carro*, *de ônibus*. Molde: *quanto tempo leva daqui até lá?*"],
        ["Leva uns dez minutos.", "Son unos diez minutos.", "*Levar* + tiempo = tardar, sin sujeto dicho: «lleva unos diez minutos». *Uns* / *umas* = unos, más o menos: *umas duas horas*. Variante coloquial: *dá uns dez minutos*."],
        ["Vou pedir um Uber.", "Voy a pedir un Uber.", "*Ir* + infinitivo, sin *a*: *vou pedir*. *Pedir um carro* = pedir un auto por aplicación. Uber funciona como sustantivo común: *pegar um Uber*, *chamar um táxi*."],
        ["Pode me deixar aqui, por favor.", "Me puede dejar acá, por favor.", "*Deixar* = dejar a alguien en un lugar. El pronombre va antes del infinitivo: *pode me deixar*, donde decís «me puede dejar» o «puede dejarme». Molde: *pode me deixar na esquina?*"],
        ["Moço, esse ônibus vai pro Centro?", "Disculpe, ¿este colectivo va al Centro?", "*Moço* / *moça* («muchacho») sirve para llamar a un desconocido, sobre todo a quien trabaja (chofer, mozo, vendedor), sin ofensa. *Ir para* + lugar: *o Centro* lleva artículo. Molde: *moça, onde fica o ponto?* Así suena en la calle: *para a* se dice *pra* y *para o*, *pro*; por escrito, la forma plena."],
        ["Tô perdido.", "Estoy perdido.", "*Estar* + participio para un estado, y concuerda con quien habla: *perdido*, *perdida*. Molde: *estou cansado*, *estou atrasado*. Para pedir ayuda: *estou perdido, pode me ajudar?* *Tô* y *tá* son *estou* y *está* en la boca: así habla todo Brasil; en un texto formal, la forma plena."],
        ["Vou pegar o metrô até Copacabana.", "Voy a tomar el metro hasta Copacabana.", "*Pegar* = tomar un transporte: *pegar o metrô*, *pegar um táxi*. *Tomar* queda para bebidas, remedios y baños. *Até* = hasta. Donde decís «tomo el metro», el portugués dice «agarro»."],
        ["O trânsito está péssimo hoje.", "El tránsito está pésimo hoy.", "*Péssimo* es el superlativo de *mau* (malo); su opuesto, *ótimo*. *Estar* porque es cómo está hoy. Molde: *está péssimo*, *está ótimo*. El embotellamiento es *engarrafamento*."],
        ["Onde eu compro o cartão do metrô?", "¿Dónde compro la tarjeta del metro?", "Presente con *eu* para preguntar cómo se hace algo: «¿dónde compro?». El *eu* explícito es normal en la pregunta hablada. *Cartão* = tarjeta. Molde: *onde eu pago?*, *onde eu pego o ônibus?*"],
        ["Pode ligar o ar-condicionado?", "¿Puede prender el aire acondicionado?", "*Ligar* = prender un aparato y también llamar por teléfono; apagar es *desligar*. *Pode* + infinitivo = pedido cortés. Molde: *pode ligar a luz?*, *pode desligar a música?*"],
        ["É a segunda rua à esquerda.", "Es la segunda calle a la izquierda.", "Ordinal + sustantivo, como en español. *À esquerda* = a + a (*a esquerda*), con crase. *Rua* = calle. Molde: *é a primeira à direita*, *é a terceira porta*."]
      ] },

    { id: "familia", week: 10, emoji: "🏠", name: "Família e casa",
      blurb: "Tu gente, tu casa y de quién es cada cosa.",
      phrases: [
        ["Essa é a minha mãe.", "Esta es mi mamá.", "Con posesivo se suele poner artículo: *a minha mãe*, *o meu pai*, algo imposible en español. *Essa* por «esta», del habla. Molde para presentar: *esse é o meu irmão*. *Mãe* es nasal: la *ã* suena por la nariz."],
        ["Tenho dois irmãos e uma irmã.", "Tengo dos hermanos y una hermana.", "*Irmão → irmãos*: plural en *-ãos*. Igual que «hermanos», *irmãos* sirve para varones o grupo mixto. *Dois* / *duas* concuerda: *duas irmãs*. Molde: *tenho* + número + sustantivo."],
        ["Meus pais moram em Córdoba.", "Mis padres viven en Córdoba.", "*Os pais* = padre y madre, como «los padres». *Morar em* + ciudad, sin artículo: *em Córdoba*; algunas ciudades lo llevan: *no Rio*. *Morar* = vivir en un lugar; *viver* es vivir la vida."],
        ["Você tem filhos?", "¿Tenés hijos?", "*Ter filhos* = tener hijos, sin artículo. *Filho*: h- española → *f-* y j → *lh* (*hijo → filho*). Se contesta repitiendo el verbo: *tenho, dois* o *não tenho*."],
        ["O carro é dele, não é meu.", "El auto es de él, no mío.", "*Dele* / *dela* (de + ele / ela) aclaran de quién es: *seu* puede ser «tuyo» (de *você*) o «suyo». Van después del sustantivo o de *é*: *o carro dele*, *é dela*. «Mío» = *meu*, sin artículo tras *é*."],
        ["A casa dela fica em Santa Teresa.", "La casa de ella queda en Santa Teresa.", "*Dela* va después del sustantivo: *a casa dela*, donde decís «su casa» o «la casa de ella». *Ficar* = quedar, estar ubicado. Molde: *o escritório dele fica no Centro*."],
        ["Minha avó faz o melhor feijão do mundo.", "Mi abuela hace el mejor feijão del mundo.", "*Avó*, con ó abierta, es la abuela; *avô*, con ô cerrada, el abuelo; *avós*, los abuelos. Superlativo: *o melhor* + sustantivo + *do mundo*. El *feijão* es el guiso diario de porotos."],
        ["Meu avô é muito engraçado.", "Mi abuelo es muy divertido.", "*Engraçado* (de *graça*) = gracioso, que hace reír: no tiene nada que ver con «grasa». *Avô*, con ô cerrada, es el abuelo. *Ser* porque es su manera de ser. Molde: *que engraçado!* = ¡qué gracioso!"],
        ["Moro num apartamento pequeno.", "Vivo en un departamento chico.", "*Morar em* + lugar: *num apartamento* (em + um). *Apartamento* = departamento; *pequeno* = chico. Molde: *moro numa casa*, *moro num bairro tranquilo*."],
        ["Meu quarto é o da esquerda.", "Mi cuarto es el de la izquierda.", "*O da esquerda* = el de la izquierda: el artículo reemplaza al sustantivo, como en español, y *da* = de + a. *Quarto* = dormitorio (y también «cuarto» de hora). Molde: *o meu é o azul*."],
        ["Este é o meu namorado, o Rafa.", "Este es mi novio, Rafa.", "*Namorado* = novio, pareja; *noivo* = prometido, con fecha de casamiento. Artículo ante posesivo y ante el nombre: *o meu namorado, o Rafa*. *Este*, cerca de quien habla, al presentar."],
        ["Somos uma família grande.", "Somos una familia grande.", "*Somos* sin *nós*: la terminación ya lo dice. *Família*, con tilde: tónica en *-mí-*. Molde: *somos* + descripción: *somos quatro irmãos*, *somos de Buenos Aires*."],
        ["Nossa casa é sua casa.", "Nuestra casa es tu casa.", "*Sua* = de *você*: «tuya». *Nossa* = nuestra. Fórmula de bienvenida, como «mi casa es tu casa». Ojo: *nossa!* sola es otra cosa, una exclamación de sorpresa."],
        ["Meu primo mora em Niterói.", "Mi primo vive en Niterói.", "*Primo* / *prima*, como en español. *Morar em* + ciudad, sin artículo. Niterói está enfrente de Río, cruzando la bahía de Guanabara. Molde: *minha prima mora em São Paulo*."],
        ["Esses são os nossos cachorros.", "Estos son nuestros perros.", "*Cachorro* = perro, de cualquier edad; la cría es *filhote*. Artículo ante posesivo: *os nossos*. *Esses*, del habla, por «estos». Falso amigo: el «cachorro» rioplatense es *filhote*."],
        ["Aquela é a escola do meu filho.", "Aquella es la escuela de mi hijo.", "*Aquela* = aquella, lo lejano. *Do meu filho* = de + o + posesivo: el posesivo suele llevar artículo. Molde: *aquele é o carro da minha irmã*."]
      ] },

    { id: "passado", week: 11, emoji: "⏳", name: "O fim de semana",
      blurb: "Contar lo que hiciste: fui, fiz, comi, vi.",
      phrases: [
        ["O que cê fez no fim de semana?", "¿Qué hiciste el fin de semana?", "*Fez*: perfeito irregular de *fazer* (*fiz, fez, fizemos*). *No fim de semana* = em + o: el portugués usa *em* donde decís «el fin de semana», sin preposición. Molde: *o que você fez ontem?* *Cê* es *você* achicado, muy común en el habla rápida; por escrito, siempre *você*."],
        ["Fui à praia com uns amigos.", "Fui a la playa con unos amigos.", "*Fui* sirve para *ir* y para *ser*, como en español. *À praia* = a + a; en el habla, *fui na praia*. *Uns* = unos. Molde: *fui ao cinema*, *fui à feira*."],
        ["Comi uma feijoada incrível.", "Comí una feijoada increíble.", "Perfeito regular en *-er*: *comi, comeu, comemos*. *Incrível* = increíble: -ble español → *-vel* (*possível*, *terrível*). En Río la feijoada es tradición de los sábados. Molde: *comi um peixe ótimo*."],
        ["Fiquei em casa e descansei.", "Me quedé en casa y descansé.", "*Ficar* = quedarse, sin *se*: *fiquei em casa*. Perfeito en *-ar*: la 1.ª persona termina en *-ei*: *fiquei*, *descansei*, *trabalhei*. Ojo: *ficar* cambia *c* → *qu* ante *e*."],
        ["Já comi, obrigado.", "Ya comí, gracias.", "«Ya comí» y «ya he comido» se dicen igual: *já* + perfeito. El compuesto *tenho comido* existe pero significa otra cosa: «vengo comiendo», algo repetido. Molde para rechazar con cortesía: *já tomei café, obrigado*."],
        ["Ainda não fui ao Cristo.", "Todavía no fui al Cristo.", "*Ainda não* + perfeito = todavía no, donde el español peninsular diría «aún no he ido». Falso amigo: *todavia* es «sin embargo». *Ao Cristo* = a + o: se sobreentiende *o Cristo Redentor*. Molde: *ainda não comi*."],
        ["Você já foi ao Pão de Açúcar?", "¿Ya fuiste al Pan de Azúcar?", "*Já* + perfeito = ¿alguna vez…?: donde el español dice «¿has ido?» o «¿ya fuiste?», el portugués usa *foi*. *Ao* = a + o. Molde: *você já comeu feijoada?*"],
        ["Vi um show de samba na Lapa.", "Vi un show de samba en Lapa.", "*Vi*: perfeito irregular de *ver* (*vi, viu, vimos*). *Na Lapa*: muchos barrios de Río llevan artículo (*a Lapa*, *o Leblon*), otros no (*Ipanema*, *Copacabana*). Lapa es el barrio de los arcos y el samba de noche."],
        ["Dormi até tarde.", "Dormí hasta tarde.", "Perfeito regular en *-ir*: *dormi, dormiu, dormimos*. *Até tarde* = hasta tarde, igual que en español. Molde para el finde: perfeito + *até* + momento: *fiquei na praia até o pôr do sol*."],
        ["Ontem choveu o dia todo.", "Ayer llovió todo el día.", "*Choveu*, sin sujeto, como «llovió». *O dia todo* = todo el día: *todo* puede ir detrás del sustantivo, con el artículo adelante. Molde: *a noite toda*, *a semana toda*, *o ano todo*."],
        ["A gente saiu pra dançar.", "Salimos a bailar.", "*A gente* va con verbo en 3.ª singular también en pasado: *a gente saiu*, no «saímos». *Sair para* + infinitivo = salir a hacer algo: donde decís «a», va *para*. Molde: *a gente saiu para jantar*. Así suena en la calle: *para a* se dice *pra* y *para o*, *pro*; por escrito, la forma plena."],
        ["Perdi o celular no Uber.", "Perdí el celular en el Uber.", "Sin pronombre: *perdi o celular*, donde el español a veces dice «se me perdió». Perfeito en *-er*: *perdi, perdeu*. *No Uber* = em + o. Molde: *perdi a chave*, *perdi o ônibus*."],
        ["Foi muito divertido!", "¡Fue muy divertido!", "*Foi*, de *ser*, para valorar algo terminado: *foi ótimo*, *foi um sucesso*. Donde decís «estuvo muy divertido», el portugués usa *ser*. *Divertido* = divertido."],
        ["Conheci uma pessoa muito interessante.", "Conocí a una persona muy interesante.", "Sin «a» personal: *conheci uma pessoa*. *Conhecer* en perfeito = conocer por primera vez. *Pessoa* es femenino aunque sea un hombre: *uma pessoa interessante*."],
        ["Cheguei tarde ontem à noite.", "Anoche llegué tarde.", "Perfeito *cheguei*, con *gu* ante *e* (de *chegar*). *Ontem à noite* = anoche. Ll- española → *ch-*: *llegar → chegar*. Molde: *cheguei cedo*, *cheguei atrasado*."],
        ["Assisti a um filme ótimo.", "Vi una película buenísima.", "Para espectáculos el portugués usa *assistir a* («asistir a»): *assisti a um filme*, *assisti ao jogo*, donde decís «vi». En el habla se cae la preposición: *assisti um filme*. *Ótimo* = buenísimo."]
      ] },

    { id: "saude", week: 12, emoji: "🩺", name: "Farmácia e médico",
      blurb: "Decir qué te duele, pedir un remedio y entender al médico.",
      phrases: [
        ["Não estou me sentindo bem.", "No me siento bien.", "*Sentir-se* en progresivo: literal «no estoy sintiéndome bien», donde decís «no me siento bien». En Brasil el pronombre va entre *estar* y el gerundio: *estou me sentindo*. Molde: *estou me sentindo melhor*, *estou me sentindo cansado*."],
        ["Estou com dor de cabeça.", "Me duele la cabeza.", "*Estar com dor de* + parte del cuerpo, literal «estoy con dolor de cabeza», donde decís «me duele la cabeza». Molde: *estou com dor de garganta*, *de barriga*, *nas costas*. *A dor* es femenino: *uma dor forte*."],
        ["Estou com febre.", "Tengo fiebre.", "*Estar com* + sustantivo = tener, para estados del cuerpo: *com febre*, *com fome*, *com sede*, *com frio*, *com sono*. Donde decís «tengo fiebre», el portugués dice «estoy con fiebre». *A febre* es femenino."],
        ["Onde tem uma farmácia aqui perto?", "¿Dónde hay una farmacia acá cerca?", "*Onde tem…?* = ¿dónde hay…?, con *ter* impersonal, lo normal en el habla. *Aqui perto* = acá cerca, con *aqui* adelante. Molde: *onde tem um caixa eletrônico aqui perto?* (un cajero)."],
        ["Preciso marcar uma consulta.", "Necesito sacar un turno.", "*Precisar* + infinitivo, sin *de*. *Marcar* = fijar, agendar: *marcar uma consulta* = sacar turno con el médico; *marcar um horário*, en la peluquería o el banco; *marcar um encontro*, una cita."],
        ["Sou alérgico a camarão.", "Soy alérgico al camarón.", "*Ser alérgico a* + sustantivo sin artículo: *alérgico a camarão*, *a amendoim*, donde decís «al camarón». *Ser* porque es permanente. Concuerda: *sou alérgica*. *Alergia* lleva la tónica en *-gi-*: a-ler-GI-a."],
        ["Tome este remédio de oito em oito horas.", "Tomá este remedio cada ocho horas.", "*De oito em oito horas* = cada ocho horas: el molde *de X em X* marca la frecuencia (*de duas em duas semanas*). *Tome*, imperativo de *você*: así habla el médico. *Remédio* = remedio, medicamento."],
        ["Descanse e beba muita água.", "Descansá y tomá mucha agua.", "Imperativo de *você*: el verbo en *-ar* termina en *-e* (*descanse*) y el de *-er* en *-a* (*beba*), como el «usted» español. Molde de consejo: *coma bem*, *durma cedo*. *Muita água*: *muito* concuerda con *água*."],
        ["Minha garganta está doendo.", "Me duele la garganta.", "Cambia la construcción: donde decís «me duele la garganta», el portugués hace sujeto a la parte del cuerpo con posesivo: *minha garganta está doendo*. *Doer* = doler (la l entre vocales cae). Molde: *minha cabeça está doendo*."],
        ["Machuquei o pé.", "Me lastimé el pie.", "Sin pronombre: *machuquei o pé*, donde decís «me lastimé el pie». La parte del cuerpo va con artículo. *Machucar*: la *c* pasa a *qu* ante *e*. Molde: *machuquei a mão*, *cortei o dedo*."],
        ["Tem algum remédio para gripe?", "¿Hay algún remedio para la gripe?", "*Algum* / *alguma* concuerda: *algum remédio*, *alguma coisa*. *Remédio para* + malestar, sin artículo: *para gripe*, *para dor de cabeça*, donde decís «para la gripe». *Tem* impersonal = hay."],
        ["Precisa de receita?", "¿Hace falta receta?", "*Precisar de* + sustantivo, sin sujeto: «¿se necesita…?», ¿hace falta…? *Receita* = receta médica y también de cocina. Molde: *precisa de documento?*, *precisa de reserva?*"],
        ["Tô gripado.", "Estoy engripado.", "*Estar* + adjetivo de enfermedad: *gripado* (engripado), *resfriado*, *doente* (enfermo). Concuerda con quien habla: *estou gripada*. Donde decís «engripado», el portugués no lleva *en-*. *Tô* y *tá* son *estou* y *está* en la boca: así habla todo Brasil; en un texto formal, la forma plena."],
        ["Tô melhor, obrigada.", "Estoy mejor, gracias.", "*Estar melhor* = estar mejor de salud. *Melhor*: j española → *lh* (*mejor → melhor*). *Obrigada*, dicho por una mujer. Molde: *estou bem melhor* (mucho mejor), *estou pior* (peor). *Tô* y *tá* son *estou* y *está* en la boca: así habla todo Brasil; en un texto formal, la forma plena."],
        ["Chame uma ambulância!", "¡Llamá a una ambulancia!", "Imperativo de *você*: *chamar* → *chame*. *Chamar* = llamar (ll- española → *ch-*). A una persona no se le pone preposición: *chame um médico*, donde decís «llamá a un médico». Molde: *chame a polícia!*"],
        ["Melhoras!", "¡Que te mejores!", "Fórmula fija: plural de *melhora* (mejoría), para desearle a alguien que se recupere. Versión completa: *estimo melhoras!* Molde de deseo sin verbo, como *parabéns!* (¡felicitaciones!)."],
        ["O plano de saúde cobre a consulta?", "¿La prepaga cubre la consulta?", "*Cobrir* = cubrir: *cobre* en 3.ª persona (la *u* española → *o*). *Plano de saúde* = prepaga u obra social. Molde: *o plano cobre exames?*, *o seguro cobre isso?*"]
      ] },

    { id: "reacoes", week: 13, emoji: "🤩", name: "Reações",
      blurb: "Nossa!, Caramba!, Que legal!: las muletillas que te hacen sonar de acá.",
      phrases: [
        ["Nossa!", "¡Uy! / ¡Guau!", "*Nossa* es lo que quedó de *Nossa Senhora* (Nuestra Señora): sirve para la sorpresa buena o mala, sin tono religioso. Se estira según la emoción: *nossaaa!* Con complemento: *nossa, que calor!*"],
        ["Caramba!", "¡Caramba!", "Como en español, para sorpresa o fastidio, pero menos frecuente que *nossa!* Su versión coloquial carioca es *caraca!* Molde: *caramba, que caro!*"],
        ["Que legal!", "¡Qué copado!", "*Que* + adjetivo = ¡qué…!, igual que en español: *que legal*, *que bom*, *que chato*. *Legal* = copado, buena onda (no solo «legal» de ley). Para cosas y personas: *ele é muito legal*."],
        ["Sério?", "¿En serio?", "Alcanza el adjetivo con entonación de pregunta, como «¿en serio?», pero sin «en». Variante: *é sério?* Para afirmar: *sério!* (¡te juro!). Molde: *jura?*, *mesmo?*"],
        ["Não acredito!", "¡No lo puedo creer!", "*Acreditar* = creer; *crer* existe, pero en la charla se usa mucho menos. El portugués omite el «lo»: *não acredito*. Con objeto: *não acredito que…*, *acredito em você* (te creo). Donde decís «no lo puedo creer», basta *não acredito*."],
        ["Que pena!", "¡Qué lástima!", "*Que* + sustantivo = ¡qué…!: *que pena*, *que saudade*, *que vergonha*. *Pena* = lástima (no «tristeza»). Con motivo: *que pena que você não vem*. Molde: *é uma pena* = es una lástima."],
        ["Que chato!", "¡Qué embole!", "*Que* + adjetivo. *Chato* = aburrido, pesado, molesto: *que chato!* = ¡qué embole! Falso amigo: la nariz chata es *nariz achatado*. Molde: *ele é chato*, *que filme chato*."],
        ["Que bom!", "¡Qué bien!", "*Que* + adjetivo, como «¡qué bien!» aunque *bom* sea «bueno». Con oración: *que bom que você veio!*, en indicativo si es un hecho. Molde: *que ótimo!*, *que maravilha!*"],
        ["Jura?", "¿Posta?", "*Jura* es «¿jurás?», presente de *jurar* con *você* implícito: ¿me lo jurás?, o sea ¿posta? Coloquial. Molde de sorpresa con verbo solo: *sério?*, *mesmo?* Para confirmar: *juro!*"],
        ["Pois é.", "Y sí. / Así es.", "*Pois* es un «pues» antiguo; *pois é* = «pues es», o sea «así es». Sirve para darle la razón a alguien, o para llenar un silencio incómodo. Muy brasileño. Molde: *pois é, né?*"],
        ["Imagina!", "¡No es nada! / ¡Por favor!", "Imperativo de *imaginar*: «¡imaginate!», o sea «ni se te ocurra agradecerme». Es respuesta a un *obrigado* o a una disculpa: «¡por favor, nada que ver!». Molde parecido: *de nada*, *que isso!*"],
        ["Tá bom.", "Está bien.", "Coloquial: *tá* = *está*, recortado. *Tá bom* = «está bueno», o sea está bien, dale. Molde: *tá certo*, *tá ótimo*, *tá bom demais*. En mensajes, *tá* también se escribe así."],
        ["Deus me livre!", "¡Dios me libre!", "Fórmula fija con *livrar* (librar) en subjuntivo: «¡Dios me libre!». Rechazo fuerte, algo así como «¡ni loco!». Molde: *Deus me livre de* + cosa: *Deus me livre de acordar cedo*."],
        ["Que saudade!", "¡Cuánto te extrañé! / ¡Qué nostalgia!", "*Que* + sustantivo. *Saudade* es el sentimiento de extrañar a alguien, algo o un tiempo. *Que saudade!* = ¡cuánto te extrañé!, al reencontrarse. Con objeto: *estou com saudade de você* = te extraño."],
        ["Ai, que vergonha!", "¡Ay, qué vergüenza!", "*Ai* = ay; *que* + sustantivo = ¡qué…! *Vergonha* = vergüenza: -güenza española → *-gonha*. Molde: *que vergonha alheia!* (¡qué vergüenza ajena!). *Estou com vergonha* = me da vergüenza."],
        ["Tomara!", "¡Ojalá!", "*Tomara* = ojalá, sola como respuesta. Con oración pide subjuntivo: *tomara que dê certo*. Es invariable: no se conjuga. Molde: *tomara que não chova*."],
        ["Com certeza!", "¡Seguro! / ¡Sin duda!", "*Com certeza* = «con certeza»: seguro, sin duda. Mismo sustantivo en *ter certeza* = estar seguro: *tenho certeza*. Donde decís «estoy seguro», el portugués *tiene* certeza. Muy usado para afirmar."],
        ["Que absurdo!", "¡Qué absurdo!", "*Que* + adjetivo = ¡qué…!: *absurdo* no cambia porque no se refiere a un sustantivo. Molde: *que estranho!*, *que injusto!*. Para indignación más fuerte: *que absurdo isso!*"]
      ] },

    { id: "falsos", week: 14, emoji: "🪤", name: "Falsos amigos",
      blurb: "Palabras que parecen españolas y te traicionan.",
      phrases: [
        ["Que comida esquisita!", "¡Qué comida más rara!", "Falso amigo: *esquisito* = raro, extraño; «exquisito» es *delicioso* o *gostoso*. Así que la frase critica la comida. Molde *que* + sustantivo + adjetivo: *que dia estranho!*, *que gente esquisita!*"],
        ["Esse bolo está gostoso!", "¡Esta torta está rica!", "*Estar gostoso* = estar rico (este, ahora), de *gosto* (sabor, gusto). Falso amigo doble: *bolo* = torta; el *pastel* es una empanada frita. Ojo: *gostoso* dicho de una persona es «está buenísimo»."],
        ["Ela está grávida.", "Ella está embarazada.", "*Estar grávida* = estar embarazada, del latín *gravida* (cargada). Falso amigo: *embaraçada* es avergonzada o complicada; decirlo de una embarazada es un error clásico. Molde: *está grávida de três meses*."],
        ["Fiquei muito embaraçado.", "Me dio mucha vergüenza.", "*Ficar* + adjetivo = quedar, ponerse: *fiquei embaraçado* = me dio vergüenza, donde decís «me dio». *Embaraçado* = avergonzado, incómodo, y también enredado (*cabelo embaraçado*). Embarazada es *grávida*."],
        ["Meu apelido é Tino.", "Mi apodo es Tino.", "Falso amigo: *apelido* = apodo; el apellido es *sobrenome*. Mismo molde que *meu nome é…*. En Brasil el apodo es casi obligatorio, y hasta los futbolistas juegan con él. Pregunta: *qual é o seu apelido?*"],
        ["Qual é o seu sobrenome?", "¿Cuál es tu apellido?", "*Sobrenome* = apellido, literal «sobre-nombre»; *apelido* = apodo: la trampa es doble. *O seu*, de *você*: tu apellido, con artículo ante posesivo. *Qual é…?* = ¿cuál es…? Molde: *qual é o seu nome completo?*"],
        ["Deixei o carro na oficina.", "Dejé el auto en el taller.", "Falso amigo: *oficina* = taller mecánico; la oficina es *escritório*. *Deixar* = dejar algo en un lugar, sin *lo*. Perfeito en *-ei*. Molde: *deixei o celular em casa*, *deixei a chave com o porteiro*."],
        ["Essa rua é bem larga.", "Esta calle es bien ancha.", "Falso amigo: *largo* = ancho; «largo» es *comprido*. *Bem* + adjetivo = bastante, muy. *Ser* porque es una característica. Molde: *essa rua é comprida mas estreita* (larga pero angosta)."],
        ["Espera um pouquinho.", "Esperá un ratito.", "*Um pouquinho* = un ratito, diminutivo de *pouco*. Falso amigo: *rato* = ratón; «un rato» es *um tempinho* o *um pouco*. *Espera*: imperativo de *tu*, lo normal en el habla aunque se trate de *você*."],
        ["Pode me emprestar uma borracha?", "¿Me prestás una goma?", "*Emprestar* = prestar (quien da); pedir prestado es *pegar emprestado*. *Pode me* + infinitivo = ¿me podés…? Falso amigo: *borracha* = goma de borrar; borracho es *bêbado*."],
        ["Tem polvo no cardápio.", "Hay pulpo en la carta.", "Falso amigo: *polvo* = pulpo; el polvo es *poeira* (o *pó*). *Tem* impersonal = hay, sin artículo. *No cardápio* = en la carta. Molde: *tem peixe no cardápio?*"],
        ["Qual é a sobremesa de hoje?", "¿Cuál es el postre de hoy?", "Falso amigo: *sobremesa* = postre, literal lo que va «sobre la mesa» al final. Para la charla después de comer no hay palabra única. *De hoje*: el complemento va con *de*. Molde: *qual é o prato do dia?*"],
        ["Vou tirar uma foto.", "Voy a sacar una foto.", "*Tirar* = sacar: *tirar uma foto*, *tirar férias* (tomarse vacaciones), *tirar o passaporte*. Tirar algo a la basura es *jogar*. *Ir* + infinitivo, sin *a*. Molde: *pode tirar uma foto da gente?*"],
        ["Ele é muito chato.", "Él es muy pesado.", "*Ser chato* = ser pesado, insoportable (así es); *estar chato* = estar aburrido, algo de ahora. Falso amigo: no es «chato» de nariz plana. Muy frecuente: *que chato!* = ¡qué embole!"],
        ["Me passa um copo d'água?", "¿Me pasás un vaso de agua?", "Falso amigo: *copo* = vaso; el *vaso* es la maceta o el inodoro. *D'água* = *de água* con apóstrofo, contracción escrita. *Me passa* + cosa = ¿me pasás…?, pronombre adelante, del habla."],
        ["As crianças estão brincando.", "Los chicos están jugando.", "Falso amigo: *brincar* = jugar (los chicos) o bromear, no «saltar». *Jogar* es jugar a un juego con reglas: *jogar futebol*. *Criança* = niño, chico. Molde: *é brincadeira!* = ¡es un chiste!"],
        ["Estou sem graça.", "Me da vergüenza. / Estoy incómodo.", "Literal «estoy sin gracia»: incómodo, avergonzado, sin saber qué decir. Con *ficar*: *fiquei sem graça*. Dicho de algo, es soso: *um filme sem graça*. Donde decís «me da cosa», va *estou sem graça*."],
        ["Acordei cedo hoje.", "Hoy me desperté temprano.", "Falso amigo: *acordar* = despertar(se), sin pronombre; ponerse de acuerdo es *combinar* o *concordar*. *Cedo* = temprano. Perfeito en *-ei*. Molde: *acordei tarde*, *acordei com sono*."]
      ] },

    { id: "sentimentos", week: 15, emoji: "❤️", name: "Sentimentos",
      blurb: "Decir lo que sentís: gustos, ganas, miedos y saudade.",
      phrases: [
        ["Estou com saudade de você.", "Te extraño.", "*Estar com* + sustantivo = sentir algo ahora: *com saudade*, *com medo*, *com fome*. *De* + lo extrañado: *saudade de você*, *de casa*. Donde decís «te extraño», el portugués dice «estoy con saudade de vos». También *sinto sua falta*."],
        ["Gosto muito de você.", "Te quiero mucho.", "*Gostar de*: quien siente el gusto es el sujeto, como con «querer», no como con «gustar»: *eu gosto de você*, no «me gustas». Siempre con *de*. Entre amigos equivale a «te quiero»; *te amo* es más fuerte."],
        ["Te amo.", "Te amo.", "Pronombre antes del verbo, como en el habla de Brasil. En Portugal: *amo-te*. Molde *te* + verbo: *te adoro*, *te espero*, *te ligo*. Más suave: *gosto muito de você*."],
        ["Tô muito feliz por você.", "Estoy muy feliz por vos.", "*Feliz por* alguien, como en español. Tras preposición, *você* queda igual: *por você*, *com você*, *para você*. Molde: *estou muito orgulhoso de você*. *Tô* y *tá* son *estou* y *está* en la boca: así habla todo Brasil; en un texto formal, la forma plena."],
        ["Estou com medo.", "Tengo miedo.", "*Estar com* + sustantivo = tener: *com medo*, *com fome*, *com sono*. Donde decís «tengo miedo», el portugués dice «estoy con miedo». Con objeto: *com medo de* + cosa: *com medo de avião*."],
        ["Fiquei chateado com isso.", "Eso me dio bronca.", "*Ficar* + adjetivo = ponerse, quedar: *fiquei chateado* = me dio bronca, me molestó. *Chateado com* algo = molesto por: cambia la preposición. Molde: *fiquei feliz*, *fiquei nervoso*."],
        ["Tô morrendo de fome.", "Me muero de hambre.", "*Estar morrendo de* + sustantivo = morirse de, en gerundio: *morrendo de sono*, *de calor*. Donde decís «me muero», el portugués usa el progresivo y sin *me*. *Fome*: h- española → *f-* (*hambre → fome*). *Tô* y *tá* son *estou* y *está* en la boca: así habla todo Brasil; en un texto formal, la forma plena."],
        ["Estou com vontade de chorar.", "Tengo ganas de llorar.", "*Estar com vontade de* + infinitivo = tener ganas de. *Vontade* = voluntad, ganas. Molde: *estou com vontade de viajar*. Ll- española → *ch-*: *llorar → chorar*."],
        ["Que alegria te ver!", "¡Qué alegría verte!", "*Te* antes del infinitivo: *te ver*, donde decís «verte». Orden brasileño. *Que* + sustantivo = ¡qué…! Molde: *que bom te ver!*, *que prazer te conhecer!*"],
        ["Adoro esse lugar.", "Me encanta este lugar.", "*Adorar* sin preposición, mucho más usado que en español: *adoro samba*, *adoro você*. Donde decís «me encanta», el portugués hace sujeto a quien siente. *Esse* por «este», del habla."],
        ["Não aguento mais.", "No doy más.", "«Ya no» = *não… mais*, con *mais* al final: *não aguento mais*, *não moro mais lá*. *Aguentar* = aguantar, sin diéresis desde 1990. Donde decís «no doy más», el portugués dice «no aguanto más»."],
        ["Estou apaixonado.", "Estoy enamorado.", "*Estar apaixonado por* alguien = enamorado de: cambia la preposición. De *paixão* (pasión). Molde: *estou apaixonado pelo Rio*. Concuerda: *apaixonada*."],
        ["Quando eu era criança, tinha medo do escuro.", "Cuando era chico, le tenía miedo a la oscuridad.", "Imperfeito para describir cómo era el pasado: *era*, *tinha*, como «era», «tenía». *Ter medo de* + cosa = tenerle miedo a: cambia la preposición. *Do escuro* = de + o. Molde: *quando eu era criança, morava em…*"],
        ["Morro de vergonha de falar em público.", "Me muero de vergüenza de hablar en público.", "*Morrer de* + sustantivo = morirse de: *morro de vergonha*, *morro de rir*. Sin *me*: *morro*. *De* + infinitivo para la causa: *de falar*. Molde: *morro de medo de avião*."],
        ["Estou nervoso com a entrevista.", "Estoy nervioso por la entrevista.", "*Nervoso com* algo = nervioso por: cambia la preposición. *Estar* porque es algo del momento. Molde: *estou ansioso com a viagem*, *preocupado com a prova*."],
        ["Fico feliz em saber.", "Me alegra saberlo.", "*Ficar* + adjetivo: *fico feliz* = me alegra. *Em* + infinitivo para la causa: *feliz em saber*. Donde decís «me alegra», el portugués hace sujeto a quien siente. Molde: *fico triste em ouvir isso*."],
        ["Não tem nada a ver.", "No tiene nada que ver.", "*Ter a ver com* = tener que ver con: *a* donde decís «que». *Não tem nada a ver* = no tiene nada que ver, no tiene sentido. Molde: *isso não tem nada a ver com você*."]
      ] },

    { id: "conectores", week: 16, emoji: "🌉", name: "Conectores",
      blurb: "Las palabras puente que te dan tiempo para pensar.",
      phrases: [
        ["Na verdade, eu prefiro ficar em casa.", "En realidad, prefiero quedarme en casa.", "*Na verdade* es literalmente «en la verdad»: en realidad, para corregir o matizar. *Preferir* cambia la vocal en 1.ª persona: *eu prefiro*. *Ficar em casa* = quedarse en casa, sin *se*. Molde: *na verdade, eu queria…*"],
        ["Tipo, não sei explicar.", "O sea, no sé explicarlo.", "Coloquial y juvenil: *tipo* («tipo, clase») funciona como «como», «o sea», para ganar tiempo. *Não sei* + infinitivo = no sé hacer algo: *não sei nadar*, *não sei dizer*. Molde: *tipo, sabe?* (¿viste?)."],
        ["Quer dizer, mais ou menos.", "Bueno, más o menos.", "*Quer dizer* es literal «quiere decir»: sirve para corregir lo que acabás de decir, como «bueno», «o sea». Sin sujeto: se entiende «lo que dije». Molde: *são dez, quer dizer, onze*."],
        ["Ou seja, a gente não vai.", "O sea, no vamos.", "*Ou seja* = «o sea»: *seja* es el subjuntivo de *ser*, congelado en la fórmula igual que en español. Resume o reformula. *A gente não vai* = no vamos, con verbo en singular. Molde: *ou seja, tudo certo*."],
        ["Então, o que você acha?", "Entonces, ¿qué te parece?", "*Então* (entonces) abre o retoma la charla, como nuestro «bueno». *O que você acha?* = ¿qué te parece?: *achar* es opinar, no solo «encontrar». Molde: *acho que sim* (creo que sí), *acho que não*."],
        ["Aliás, você viu a Bia?", "Por cierto, ¿viste a Bia?", "*Aliás* = por cierto, a propósito, para cambiar de tema; también corrige: *são três, aliás, quatro* (mejor dicho). *Viu*: perfeito de *ver* con *você*. Sin «a» personal: *viu a Bia*, donde *a* es el artículo."],
        ["Enfim, vamos ver.", "En fin, ya veremos.", "*Enfim* = «en fin», en una palabra: cierra el tema o resume. *Vamos ver* = ya veremos, con *ir* + infinitivo sin *a*. Molde para cerrar: *enfim, é isso* (en fin, eso)."],
        ["Por isso eu vim.", "Por eso vine.", "*Por isso* = por eso: *isso* = eso; *isto* = esto. *Vim*: perfeito irregular de *vir* (*vim, veio, viemos*). Molde: *por isso* + oración: *por isso eu liguei*, *por isso não fui*."],
        ["Mesmo assim, valeu a pena.", "Aun así, valió la pena.", "*Mesmo assim* = aun así: *mesmo* («mismo») con valor de «aun». *Valer a pena* = valer la pena; en perfeito, *valeu* (de ahí el *valeu!* = gracias). Molde: *mesmo assim, obrigado*."],
        ["Pelo menos está fazendo sol.", "Por lo menos hay sol.", "*Pelo menos* = por lo menos. El clima va con *fazer*: *fazer sol* = haber sol; *está fazendo sol* = ahora hay sol, *faz frio* = hace frío. Molde: *pelo menos não choveu*."],
        ["De qualquer jeito, obrigado.", "De todas formas, gracias.", "*Jeito* = manera, modo; *qualquer* = cualquier: «de cualquier manera», o sea de todas formas. También *de qualquer forma*. *Jeito* aparece mucho: *não tem jeito* (no hay caso), *dar um jeito* (arreglárselas)."],
        ["Ah, é mesmo!", "¡Ah, es verdad!", "*É mesmo* = «es mismo», o sea ¡es verdad!: *mesmo* refuerza. Como pregunta, *é mesmo?* = ¿en serio? Molde de reacción: *ah, é?*, *é verdade!*"],
        ["Olha, sinceramente, não gostei.", "Mirá, sinceramente, no me gustó.", "*Olha* (mirá, imperativo de *olhar*) abre una opinión franca. *Não gostei*: *gostar* pide *de* solo si hay objeto (*não gostei do filme*); donde decís «no me gustó», el portugués hace sujeto a quien opina."],
        ["Além disso, é caríssimo.", "Además, es carísimo.", "*Além disso* = además, literal «más allá de eso» (*além* = más allá). Superlativo en *-íssimo*: *caro → caríssimo*, *lindo → lindíssimo*, con doble *s*. Sin sujeto: *é caríssimo* = es carísimo."],
        ["No fim das contas, deu tudo certo.", "Al final, salió todo bien.", "*No fim das contas* = al final, literal «al fin de las cuentas». *Dar certo* = salir bien, con el sujeto detrás: *deu tudo certo*. Lo contrario: *deu errado*. Molde: *vai dar certo* (va a salir bien)."],
        ["Aí eu falei: chega!", "Entonces le dije: ¡basta!", "Coloquial: *aí* = entonces, el conector de los relatos: *aí ele disse…* *Falar* se usa como «decir» en el habla. *Chega!* = ¡basta!, de *chegar* (llegar): «llega», o sea ya alcanza."],
        ["Bom, deixa eu ver…", "Bueno, dejame ver…", "*Bom* = bueno, para ganar tiempo. *Deixa eu ver* = dejame ver: tras *deixa*, en el habla va *eu*, no «me»; lo escrito pide *deixe-me ver*. Molde: *deixa eu pensar*."]
      ] },

    { id: "papo", week: 17, emoji: "☀️", name: "Papo furado",
      blurb: "Charla de ascensor y de playa: el calor, el fútbol, el feriado.",
      phrases: [
        ["Que calor hoje, né?", "Qué calor hoy, ¿no?", "*Né* es *não é* contraído, «¿no es?»: pide confirmación como nuestro «¿no?» y va al final de cualquier frase. *Que* + sustantivo = ¡qué…! Molde para romper el hielo: *que frio, né?*, *tá caro, né?*"],
        ["Parece que vai chover.", "Parece que va a llover.", "*Parece que* + indicativo, como en español. *Vai chover* = futuro con *ir*, sin la *a* de «va a llover». Molde: *parece que vai dar certo*, *parece que ele não vem*."],
        ["Amanhã vai fazer quarenta graus.", "Mañana va a hacer cuarenta grados.", "El clima va con *fazer*, como «hace calor»: *faz calor*, *faz frio*, *vai fazer quarenta graus*. *Ir* + infinitivo sin *a* = futuro del habla. Molde: *ontem fez frio*, *hoje está fazendo sol*."],
        ["O que cê vai fazer no feriado?", "¿Qué vas a hacer en el feriado?", "*Ir* + infinitivo = el futuro de la charla: *vai fazer*. *No feriado*: con fechas y períodos el portugués pone *em*, donde decís «en el» o nada: *no sábado* (el sábado), *no Natal*. Molde: *o que você vai fazer no fim de semana?* *Cê* es *você* achicado, muy común en el habla rápida; por escrito, siempre *você*."],
        ["Segundo a previsão, choverá o fim de semana todo.", "Según el pronóstico, va a llover todo el fin de semana.", "El futuro simple (*choverá*) es de la tele, las noticias y lo escrito; en la charla, *vai chover*. *Segundo* = según (no solo «segundo»). *O fim de semana todo*: *todo* detrás del sustantivo. Molde: *segundo o jornal…*"],
        ["Você viu o jogo ontem?", "¿Viste el partido ayer?", "*Viu*: perfeito irregular de *ver* con *você*. *Jogo* = partido; *jogar* = jugar un juego o deporte. Molde: *você viu a novela?*, *você viu o que aconteceu?* La pregunta es la afirmación con entonación."],
        ["Cê torce pra qual time?", "¿De qué cuadro sos?", "*Torcer para* = ser hincha de (*torcer* es también «retorcer»); *torcedor* = hincha. *Qual* puede ir al final, como un eco: *para qual time?* *Time* = equipo, cuadro. En Río: Flamengo, Fluminense, Vasco, Botafogo. Así suena en la calle: *para a* se dice *pra* y *para o*, *pro*; por escrito, la forma plena. *Cê* es *você* achicado, muy común en el habla rápida; por escrito, siempre *você*."],
        ["Sou Flamengo!", "¡Soy de Flamengo!", "*Ser* + nombre del club, sin «de»: *sou Flamengo*, *sou Vasco*, donde decís «soy de Flamengo». También: *sou flamenguista*. Molde para preguntar: *você é Flamengo?*"],
        ["Faz tempo que não te vejo!", "¡Hace mucho que no te veo!", "*Faz* + tiempo + *que* = hace… que: *faz tempo* = hace mucho. Con *você*, el pronombre de la charla es *te*, antes del verbo. *Vejo*: 1.ª persona irregular de *ver*. Molde: *faz um ano que moro aqui*."],
        ["E aí, quais são as novidades?", "¿Y, qué hay de nuevo?", "*E aí?* = «¿y ahí?»: abre la charla, ¿qué onda? Coloquial. *Quais*: plural de *qual*, concuerda con *novidades* (novedades). Molde: *e aí, tudo bem?*, *e aí, como foi?*"],
        ["Nada de mais.", "Nada del otro mundo.", "*De mais* = «de más», nada especial: *nada de mais*. Ojo: *demais*, junto, es «demasiado» o, coloquial, «genial»: *foi demais!* Se oyen igual; la escritura distingue. Molde: *não foi nada de mais*."],
        ["Esse fim de semana foi demais!", "¡Este fin de semana estuvo genial!", "*Demais* al final = buenísimo, coloquial (su sentido literal es «demasiado»). *Foi*, de *ser*, para valorar algo terminado, donde decís «estuvo». *Esse*, del habla. Molde: *o show foi demais!*"],
        ["Vou ficar por aqui mesmo.", "Me voy a quedar por acá nomás.", "*Mesmo* al final refuerza: *aqui mesmo* = acá nomás, acá mismo. *Ficar* = quedarse, sin *se*. *Ir* + infinitivo sin *a*. Molde: *hoje mesmo* (hoy mismo), *agora mesmo* (ahora mismo)."],
        ["No Rio, o inverno é bem suave.", "En Río, el invierno es bastante suave.", "*Bem* + adjetivo = bastante, muy: *bem suave*, *bem quente*. *Ser* porque es algo general del clima; *estar* para hoy (*hoje está frio*). *No Rio*: la ciudad lleva artículo."],
        ["Tá tudo muito caro, né?", "Está todo carísimo, ¿no?", "*Tudo* = todo, pronombre invariable, sin sustantivo. *Muito caro* = carísimo: *muito* + adjetivo. *Né?* (= *não é?*) pide acuerdo al final. Molde de queja: *está tudo muito difícil, né?* *Tô* y *tá* son *estou* y *está* en la boca: así habla todo Brasil; en un texto formal, la forma plena."],
        ["O Carnaval tá chegando!", "¡Se viene el Carnaval!", "*Estar chegando* = se viene, está por llegar: el gerundio muestra lo que se acerca. Donde decís «se viene», el portugués dice «está llegando». Molde: *o verão está chegando*, *as férias estão chegando*. *Tô* y *tá* son *estou* y *está* en la boca: así habla todo Brasil; en un texto formal, la forma plena."],
        ["Hoje o céu está limpo.", "Hoy el cielo está despejado.", "*Estar limpo* dicho del cielo = despejado, literal «limpio». *Céu*: la l entre vocales cae (*cielo → céu*). Molde: *o céu está nublado*. Lo pasajero va con *estar*."]
      ] },

    { id: "restaurante", week: 18, emoji: "🍽️", name: "No restaurante",
      blurb: "Reservar, pedir con cortesía y quejarte sin pelear.",
      phrases: [
        ["Mesa para dois, por favor.", "Mesa para dos, por favor.", "Pedido sin verbo: *mesa para* + número de personas. *Dois* / *duas* concuerda con lo contado: *mesa para duas pessoas*. Sin artículo, como en español. Molde: *mesa para quatro, lá fora* (afuera)."],
        ["Eu gostaria de fazer uma reserva.", "Quisiera hacer una reserva.", "*Gostaria* (futuro do pretérito de *gostar*) = me gustaría, quisiera: el pedido cortés. Cambia la construcción: *eu gostaria de*, con quien pide como sujeto y *de* + infinitivo, donde decís «me gustaría». Molde: *gostaria de pedir*."],
        ["Poderia trazer o cardápio?", "¿Podría traer la carta?", "*Poderia* (condicional de *poder*) + infinitivo = ¿podría…?, un grado más cortés que *pode*. El sujeto (*o senhor*, *você*) se sobreentiende y el «me» también. Molde: *poderia repetir?*, *poderia fechar a conta?*"],
        ["O que você recomenda?", "¿Qué me recomienda?", "*O que* = qué, al comienzo de la pregunta. El portugués omite el «me» que el español pone: *o que você recomenda?* = ¿qué me recomendás? Respuesta: *recomendo a moqueca*. Molde: *o que você sugere?*"],
        ["Eu queria o prato do dia.", "Quería el plato del día.", "*Queria* (imperfeito de *querer*) suaviza el pedido: «quería», como en español, sin ser pasado real. *O prato do dia* = el plato del día. Molde de pedido: *eu queria* + plato: *eu queria uma água*."],
        ["Vou querer uma moqueca para dois.", "Voy a pedir una moqueca para dos.", "*Vou querer* + plato: la fórmula más común para pedir en Brasil, literal «voy a querer». Donde decís «para mí…» o «me traés…», el brasileño anuncia lo que va a querer. *Para dois* = para dos personas."],
        ["Eu queria a carne mal passada.", "Quería la carne jugosa.", "*Mal passada* = literal «mal pasada»: jugosa, poco hecha; *ao ponto* = a punto; *bem passada* = bien cocida. Concuerda con *carne*. Molde: *eu queria o bife ao ponto*."],
        ["Pode trazer mais um guardanapo?", "¿Puede traer otra servilleta?", "*Mais um* = otro, uno más: el portugués suma donde decís «otro». *Pode* + infinitivo = pedido directo y cortés. *Guardanapo* = servilleta, masculino. Molde: *pode trazer mais uma cerveja?*"],
        ["Sou vegetariana.", "Soy vegetariana.", "*Ser* para una característica estable, sin artículo, como en español. Concuerda: *vegetariano* / *vegetariana*. Molde para avisar: *sou alérgico a…*, *não como carne*. *Vegano* = vegano."],
        ["Estava tudo delicioso.", "Estaba todo riquísimo.", "*Estava* (imperfeito de *estar*) describe cómo estuvo la comida, como «estaba». *Tudo* + adjetivo en masculino: *tudo delicioso*. Molde para el mozo: *estava tudo ótimo, obrigado*."],
        ["Seria possível trocar a batata por salada?", "¿Sería posible cambiar la papa por ensalada?", "*Seria possível* + infinitivo = ¿sería posible…?, el pedido más cortés. *Trocar X por Y* = cambiar X por Y. Falso amigo: *salada* = ensalada; salado es *salgado*. Molde: *seria possível sem cebola?*"],
        ["Bom apetite!", "¡Buen provecho!", "Literal «buen apetito»: se dice antes de comer, como «buen provecho». *Apetite* es masculino: *bom apetite*. Se contesta *obrigado, igualmente*. Molde de deseo: *bom* / *boa* + sustantivo: *boa viagem*."],
        ["Estou satisfeito, obrigado.", "Estoy lleno, gracias.", "*Estar satisfeito* = estar lleno, «satisfecho». -cho español → *-ito*: *satisfecho → satisfeito*, *hecho → feito*, *dicho → dito*. Forma cortés de rechazar más comida."],
        ["Pode embrulhar pra viagem?", "¿Me lo puede envolver para llevar?", "*Embrulhar* = envolver; *para viagem* = para llevar. El objeto se sobreentiende: donde decís «¿me lo envolvés?», el portugués no pone «me» ni «lo». Molde: *pode embrulhar para presente?* (para regalo). Así suena en la calle: *para a* se dice *pra* y *para o*, *pro*; por escrito, la forma plena."],
        ["Aceitam cartão de débito?", "¿Aceptan tarjeta de débito?", "Verbo en 3.ª plural sin sujeto: *aceitam* = ¿aceptan?, hablando del local. *Cartão de débito* / *de crédito*, sin artículo. Molde: *aceitam Pix?*, *vocês aceitam dinheiro?*"],
        ["A comida está demorando muito.", "La comida está tardando mucho.", "*Demorar* = tardar, el verbo común (*tardar* se usa menos). *Estar* + gerundio para lo que pasa ahora, como «está tardando». Molde de queja cortés: *o pedido está demorando*. *Muito* después del verbo = mucho."],
        ["Você poderia fechar a janela?", "¿Podrías cerrar la ventana?", "*Poderia* + infinitivo = ¿podrías…?, pedido cortés. *Fechar* = cerrar; *abrir* = abrir. *Janela* = ventana. Molde: *você poderia abrir a porta?*, *poderia ligar o ar?*"]
      ] },

    { id: "whatsapp", week: 19, emoji: "📱", name: "No WhatsApp",
      blurb: "Mensajes, audios y abreviaturas: cómo se escribe en el celular.",
      phrases: [
        ["Tô chegando!", "¡Ya llego!", "Coloquial: *tô* = *estou* sin la *es-*, en el habla y en los mensajes. *Estar chegando* = estar llegando: el gerundio dice «ya casi», donde decís «ya llego». Molde: *tô saindo* (ya salgo), *tô indo* (ya voy)."],
        ["Foi mal, me atrasei.", "Perdón, llegué tarde.", "Coloquial: *foi mal* = literal «fue mal»: perdón, fue mi culpa. *Me atrasei* = me atrasé, llegué tarde, de *atrasar-se*, con el pronombre adelante como en todo Brasil. Molde: *foi mal, esqueci*."],
        ["Me manda a localização.", "Mandame la ubicación.", "Pedido informal: *manda* es el imperativo de *tu*, idéntico al presente de *você*, y es el que se usa en el habla: *me manda* = mandame. Pronombre al principio, normal en el habla aunque la norma escrita lo evite. Molde: *me passa o número*, *me avisa*."],
        ["Vou ver e te aviso.", "Me fijo y te aviso.", "*Vou ver* = me fijo, voy a ver: *ir* + infinitivo sin *a*. *Te aviso*: *te* antes del verbo y presente con valor de futuro. Molde para no comprometerte: *vou ver e te falo*."],
        ["Pode me mandar um áudio?", "¿Me podés mandar un audio?", "*Pode me* + infinitivo = ¿me podés…?: el pronombre va entre los dos verbos. *O áudio* = el mensaje de voz, masculino. Molde: *pode me mandar uma foto?*, *pode me ligar?*"],
        ["Tá bom, beleza.", "Está bien, dale.", "Coloquial. *Tá bom* = está bien (*tá* = *está*). *Beleza* (belleza) funciona como «dale», «ok»; en mensajes, *blz*. También saluda: *beleza?* = ¿todo bien? Molde: *beleza, combinado*."],
        ["Kkkkk, que engraçado!", "¡Jajaja, qué gracioso!", "En Brasil la risa escrita es *kkkkk* (la *k* suena «ca») o *rsrs* (de *risos*); más letras, más risa. *Que* + adjetivo = ¡qué…! *Engraçado* = gracioso, de *graça*. Nuestro «jaja» se entiende, pero suena extranjero."],
        ["Me liga mais tarde?", "¿Me llamás más tarde?", "*Ligar* = llamar por teléfono (y prender un aparato). *Me liga* = presente usado como pedido: ¿me llamás? En lo escrito: *ligar para alguém*. Molde: *me liga quando chegar*."],
        ["Vi sua mensagem agora.", "Recién vi tu mensaje.", "*Agora* al final con perfeito = recién: *vi agora* = recién lo vi. *Sua*, de *você*, sin artículo. *A mensagem*: femenina, como todas las palabras en *-agem* (*a viagem*, *a garagem*), donde el español dice «el mensaje»."],
        ["Desculpa a demora.", "Perdón por la demora.", "*Desculpa* + sustantivo, sin *por*: *desculpa a demora*, *desculpa o atraso*, donde decís «perdón por». Con verbo sí va *por*: *desculpa por não responder*. *Demora* = tardanza."],
        ["Tô sem sinal aqui.", "Acá no tengo señal.", "*Estar sem* + sustantivo = no tener algo ahora, literal «estoy sin señal». Molde: *sem sinal*, *sem internet*, *sem bateria*. *Sinal* es masculino (*o sinal*), donde el español dice «la señal». *Tô* y *tá* son *estou* y *está* en la boca: así habla todo Brasil; en un texto formal, la forma plena."],
        ["Meu celular tá sem bateria.", "Mi celular se quedó sin batería.", "*Estar sem* = quedarse sin, como estado: *está sem bateria*. Donde decís «se quedó sin», el portugués no usa *ficar* ni pronombre. *Bateria*: tónica en *-ri-*. Molde: *o carro está sem gasolina*. *Tô* y *tá* son *estou* y *está* en la boca: así habla todo Brasil; en un texto formal, la forma plena."],
        ["Me adiciona no grupo?", "¿Me agregás al grupo?", "*Adicionar* = agregar (en redes). Pronombre adelante, presente como pedido: *me adiciona?* = ¿me agregás? *No grupo* = em + o: *em* donde decís «a». Molde: *me tira do grupo* (sacame del grupo)."],
        ["Vc vem hj?", "¿Venís hoy?", "Abreviaturas de chat: *vc* = você, *hj* = hoje, *tb* = também, *pq* = por que / porque, *blz* = beleza. *Vem*: 3.ª persona de *vir* (venir): *você vem?* = ¿venís? Solo para mensajes."],
        ["Tô sem crédito, te ligo depois.", "No tengo crédito, te llamo después.", "*Tô sem* = no tengo (*estar sem*). *Te ligo* = te llamo: en el habla *ligar* lleva *te*; en lo escrito, *ligar para alguém*. Presente con valor de futuro: *te ligo depois*. Molde: *te mando depois*."],
        ["Beijos, até mais!", "¡Besos, hasta la próxima!", "*Beijos* (o *bjs*) cierra mensajes entre amigos y familia, sin romanticismo. *Até mais* = literal «hasta más»: hasta luego. Molde de cierre: *abraço* (más neutro), *beijos, até amanhã*."],
        ["Posso te ligar agora?", "¿Te puedo llamar ahora?", "*Posso* + pronombre + infinitivo: en Brasil el pronombre va antes del infinitivo, *te ligar*, donde decís «¿te puedo llamar?» o «¿puedo llamarte?». Molde: *posso te perguntar uma coisa?*"]
      ] },

    { id: "reclamar", week: 20, emoji: "😤", name: "Reclamar sem brigar",
      blurb: "Quejarte en un negocio, en el edificio o por teléfono: firme, pero sin pelear.",
      phrases: [
        ["Olha, acho que teve um engano.", "Mire, creo que hubo un error.", "*Teve*, de *ter*: en el habla, *ter* hace de «haber» también en pasado (*teve um engano*); por escrito, *houve*. *Olha* abre el reclamo sin agresividad. Molde: *acho que teve um problema com a conta*."],
        ["Eu pedi sem cebola, mas veio com cebola.", "Pedí sin cebolla, pero vino con cebolla.", "Dos perfeitos: *pedi* (de *pedir*) y *veio* (de *vir*, irregular). *Sem* + sustantivo, sin artículo. Molde para contrastar lo pedido y lo recibido: *eu pedi X, mas veio Y*."],
        ["A loja cobrou duas vezes.", "El negocio me cobró dos veces.", "*Cobrar* = cobrar; el «me» del español no hace falta. *Duas vezes*: *vez* hace el plural en *-zes*. Molde: *cobrou a mais* (de más), *cobrou errado*."],
        ["Isso não funciona desde ontem.", "Esto no anda desde ayer.", "*Funcionar* = andar, funcionar (una máquina): nunca «andar». Presente + *desde*, igual que en español. Molde: *a internet não funciona*, *o chuveiro não esquenta*."],
        ["Gostaria de falar com o gerente, por favor.", "Quisiera hablar con el encargado, por favor.", "*Gostaria de* + infinitivo, el futuro do pretérito de la cortesía: firme sin ser grosero. *Gerente* = encargado. Molde: *gostaria de trocar*, *gostaria de cancelar*."],
        ["Quero trocar este produto: veio com defeito.", "Quiero cambiar este producto: vino fallado.", "*Trocar* = cambiar (un producto, plata, de ropa); *mudar* es cambiar de estado o de casa. *Com defeito* = fallado. Molde: *posso trocar?*, *quero devolver*."],
        ["Estou esperando há mais de uma hora.", "Hace más de una hora que estoy esperando.", "*Há* + tiempo = hace: *há uma hora*. El orden cambia: *estou esperando há…*, donde decís «hace… que estoy». Molde: *moro aqui há dois anos*."],
        ["Não é a primeira vez que isso acontece.", "No es la primera vez que pasa esto.", "*Acontecer* = pasar, suceder; *passar* es pasar por un lugar o el tiempo. Molde para subir el tono sin gritar: *é a terceira vez que isso acontece*."],
        ["O vizinho de cima faz barulho toda noite.", "El vecino de arriba hace ruido todas las noches.", "*De cima* = de arriba; *de baixo* = de abajo. *Fazer barulho* = hacer ruido. *Toda noite*, sin artículo: *todo* + singular es «cada». Molde: *todo dia*, *toda semana*."],
        ["Vou reclamar com o síndico.", "Me voy a quejar con el administrador.", "*Reclamar com* alguien = quejarse ante alguien; *reclamar de* algo = quejarse de algo. El *síndico* administra el edificio: es un vecino elegido. Molde: *vou reclamar da conta*."],
        ["Vocês poderiam resolver isso até amanhã?", "¿Podrían resolver esto para mañana?", "*Poderiam*, futuro do pretérito de *poder*: pedido firme y cortés. *Até amanhã* marca el plazo, donde decís «para mañana». Molde: *até sexta*, *até o fim do mês*."],
        ["O atendimento foi péssimo.", "La atención fue pésima.", "*Atendimento* = la atención al cliente; *atenção* es prestar atención. *Péssimo* = pésimo, el superlativo de *ruim*; lo contrario, *ótimo*. Molde: *o serviço foi ótimo*."],
        ["Quero o meu dinheiro de volta.", "Quiero que me devuelvan la plata.", "*De volta* = de vuelta: literal «quiero mi plata de vuelta». *Dinheiro* = plata. Más cortés: *gostaria de um reembolso*. Molde: *estou de volta* (volví)."],
        ["Tudo bem, obrigado por resolver.", "Está bien, gracias por resolverlo.", "*Obrigado por* + infinitivo, sin pronombre: el portugués omite el «lo». Cerrar agradeciendo también es parte del reclamo brasileño. Molde: *obrigado por avisar*, *obrigado pela ajuda*."]
      ] },

    { id: "consulta", week: 22, emoji: "🏥", name: "No médico e no cartório",
      blurb: "Hablar con el médico o con un funcionario, de *o senhor* y *a senhora*.",
      phrases: [
        ["Bom dia, doutor. Marquei uma consulta para as dez.", "Buen día, doctor. Tengo turno a las diez.", "Al médico se le dice *doutor* (y a menudo al abogado). *Marcar uma consulta* = sacar turno; *para as dez*, con artículo delante de la hora. Molde: *marquei horário com a doutora Ana*."],
        ["O senhor pode me explicar de novo?", "¿Me lo puede explicar otra vez?", "*O senhor* / *a senhora* = usted: verbo en 3.ª persona (*pode*). Es el trato para el médico, el funcionario o una persona mayor. *De novo* = otra vez. Molde: *a senhora pode repetir?*"],
        ["Tenho sentido muita dor nas costas.", "Vengo sintiendo mucho dolor de espalda.", "*Tenho sentido* = vengo sintiendo: el perfeito composto dice algo que se repite y sigue, no «he sentido». *As costas* = la espalda, en plural. Molde: *tenho dormido mal*."],
        ["Faz três dias que estou com febre.", "Hace tres días que tengo fiebre.", "*Faz* + tiempo + *que* = hace… que. *Estar com* + síntoma: *estou com febre*, *com tosse*, donde decís «tengo». Molde: *faz uma semana que…*"],
        ["A senhora é alérgica a algum remédio?", "¿Es alérgica a algún remedio?", "*A senhora* + 3.ª persona: así habla el médico con una paciente adulta. *Alérgico a* + cosa; *algum* = algún. Respuesta: *sou alérgica a dipirona*."],
        ["Preciso de um atestado para o trabalho.", "Necesito un certificado médico para el trabajo.", "*Atestado* (médico) = el certificado que justifica la falta. *Precisar de* + sustantivo. Molde: *preciso de uma receita*, *preciso de um pedido de exame*."],
        ["Onde eu pego a receita?", "¿Dónde retiro la receta?", "*Pegar* = agarrar, retirar, buscar: *pegar a receita*, *pegar o resultado*. *Receita* es la receta médica y la de cocina. Molde: *onde eu pego a senha?* (el número de turno)."],
        ["O documento já foi autenticado?", "¿El documento ya está certificado?", "Pasiva con *ser* + participio: *foi autenticado*. *Autenticar* = certificar una copia en el *cartório* (la escribanía). Molde: *a assinatura foi reconhecida?*"],
        ["Em quantos dias o documento fica pronto?", "¿En cuántos días está listo el documento?", "*Ficar pronto* = estar listo (algo que se hace). Presente por futuro, como en español. *Pronto* = listo; «pronto» (enseguida) es *logo*. Molde: *quando fica pronto?*"],
        ["Falta algum documento?", "¿Falta algún papel?", "*Faltar* con el sujeto después, como en español. En los trámites, *documento* = papel. Respuesta posible: *falta o comprovante de residência* (el comprobante de domicilio)."],
        ["Com licença, esta é a fila da senha?", "Permiso, ¿esta es la fila para el número?", "*Com licença* para interrumpir o entrar. *Fila* = fila, cola. *Senha* es el número de turno (y también la contraseña). Molde: *qual é a minha senha?*"],
        ["O senhor aceita cartão?", "¿Acepta tarjeta?", "*Cartão* (de crédito, de débito) = tarjeta. Con *o senhor*, verbo en 3.ª persona. Molde: *aceita Pix?*, la transferencia instantánea que en Brasil se usa para todo."],
        ["Minha carteira de identidade foi roubada.", "Me robaron el documento de identidad.", "Pasiva: *foi roubada*, donde decís «me robaron». *Carteira de identidade* (o *RG*) = documento; *carteira* sola es la billetera. Molde: *meu celular foi roubado*."],
        ["Muito obrigado pela atenção.", "Muchas gracias por la atención.", "*Pela* = *por* + *a*. *Atenção* = atención, amabilidad: la fórmula para cerrar con un profesional o un funcionario. Molde: *obrigado pela paciência*, *pela ajuda*."]
      ] },

    { id: "opinioes", week: 23, emoji: "🧠", name: "Opiniões",
      blurb: "Opinar y matizar, ya con el subjuntivo incorporado.",
      phrases: [
        ["Acho que você tem razão.", "Creo que tenés razón.", "*Achar* es «encontrar», pero *acho que* = creo que: la manera normal de opinar. Va con indicativo: *acho que é*, *acho que tem*. *Ter razão* = tener razón, igual. Molde: *acho que sim*, *acho que não*."],
        ["Não acho que seja uma boa ideia.", "No creo que sea una buena idea.", "Negado, *achar* pide subjuntivo: *não acho que seja*, igual que «no creo que sea». Afirmado va indicativo: *acho que é*. *Seja*, subjuntivo irregular de *ser*. Molde: *não acho que ele venha*."],
        ["Na minha opinião, o Rio é a cidade mais bonita do Brasil.", "En mi opinión, Río es la ciudad más linda de Brasil.", "*Na minha opinião* = en mi opinión, con *em* + artículo + posesivo. Superlativo: *a* + sustantivo + *mais* + adjetivo + *do* / *da*: *a cidade mais bonita do Brasil*. *O Rio* y *o Brasil* llevan artículo."],
        ["Duvido que ele venha.", "Dudo que venga.", "*Duvidar que* + subjuntivo, como «dudar que»: *venha*, de *vir* (venir), irregular. Molde: *duvido que chova*, *duvido que seja verdade*. Sola, *duvido!* = ¡lo dudo!"],
        ["Tomara que faça sol amanhã!", "¡Ojalá haga sol mañana!", "*Tomara que* + subjuntivo = ojalá: *faça*, subjuntivo irregular de *fazer*. El clima va con *fazer*: *fazer sol* = haber sol. Molde: *tomara que dê certo*, *tomara que não chova*."],
        ["Talvez eu vá à festa.", "Tal vez vaya a la fiesta.", "*Talvez* antes del verbo pide subjuntivo, como «tal vez vaya»: *vá*, de *ir*. Si va después, indicativo: *eu vou, talvez*. Es una sola palabra. Molde: *talvez ele venha*, *talvez seja melhor*."],
        ["Espero que você goste.", "Espero que te guste.", "*Esperar que* + subjuntivo: *goste*, de *gostar*. Cambia la construcción: *você goste* (vos guste), con quien disfruta como sujeto, donde decís «te guste». Y el portugués omite el «lo». Molde: *espero que dê certo*."],
        ["Depende.", "Depende.", "Solo, como en español, o con *de* + artículo: *depende do preço*, *depende da hora*. *Depender de*, igual que acá. Molde para matizar: *depende de você*, *depende do dia*."],
        ["Concordo plenamente.", "Estoy totalmente de acuerdo.", "*Concordar* = estar de acuerdo, en un solo verbo: *concordo* = estoy de acuerdo. *Plenamente* = totalmente. Molde: *concordo com você*, *concordo em parte*. Lo opuesto: *discordo*."],
        ["Não concordo com você.", "No estoy de acuerdo con vos.", "*Concordar com* alguien = estar de acuerdo con. Donde decís «no estoy de acuerdo», el portugués usa un solo verbo. Lo opuesto lleva *de*: *discordar de*. Molde: *não concordo com isso*."],
        ["Pode ser, mas não tenho certeza.", "Puede ser, pero no estoy seguro.", "*Ter certeza* = estar seguro: con *ter* («tener certeza»), no con *estar*. *Pode ser* = puede ser. *Mas* = pero. Molde: *tenho certeza de que…*, *você tem certeza?*"],
        ["É importante que todos participem.", "Es importante que todos participen.", "*É importante que* + subjuntivo, como en español: *participem*. Mismo molde con cualquier valoración: *é bom que*, *é preciso que*, *é melhor que*. Con infinitivo, sin *que*: *é importante participar*."],
        ["Para mim, tanto faz.", "Para mí, da igual.", "*Para mim*, nunca «para mí»: tras preposición, *mim*. *Tanto faz* = literal «tanto hace»: me da igual. Molde: *tanto faz, você escolhe*. Con opciones: *tanto faz ir ou ficar*."],
        ["Sinceramente, prefiro que a gente fique em casa.", "Sinceramente, prefiero que nos quedemos en casa.", "*Preferir que* + subjuntivo: *fique*, de *ficar* (*c* → *qu* ante *e*). Con *a gente*, verbo en 3.ª singular: *a gente fique*, donde decís «nos quedemos». *Ficar* = quedarse, sin *se*."],
        ["Faz sentido.", "Tiene sentido.", "*Fazer sentido* = tener sentido: con *fazer* donde decís «tener». Negado: *não faz sentido*. Molde: *isso faz sentido?*, *agora faz sentido!*"],
        ["Por um lado, é caro; por outro, vale a pena.", "Por un lado, es caro; por otro, vale la pena.", "*Por um lado… por outro* = por un lado… por otro: el segundo *lado* se sobreentiende. *Valer a pena* = valer la pena, igual. Molde para sopesar: *por um lado é longe; por outro, é barato*."],
        ["Tenho minhas dúvidas.", "Tengo mis dudas.", "*Ter dúvidas* = dudar, con *ter*. Posesivo sin artículo, frecuente en Brasil: *tenho minhas dúvidas*. Tono: educadamente escéptico. Molde: *tenho minhas razões*."],
        ["Que bom que você veio!", "¡Qué bueno que viniste!", "*Que bom que* + indicativo cuando es un hecho: *você veio*, perfeito de *vir*. Igual que «¡qué bueno que viniste!»; en registro cuidado también se oye *que bom que você tenha vindo*. Molde: *que bom que deu certo!*"]
      ] },

    { id: "briga", week: 25, emoji: "💞", name: "Discutir com carinho",
      blurb: "Discutir con la pareja o con un amigo sin romper nada: reprochar, explicar, pedir perdón, reconciliarte.",
      phrases: [
        ["Precisamos conversar.", "Tenemos que hablar.", "*Precisar* + infinitivo = tener que. *Conversar*, no «hablar», para una charla seria. En el habla: *a gente precisa conversar*. La frase que todos temen, en Brasil también."],
        ["Fiquei chateada porque você não me avisou.", "Me molestó que no me avisaras.", "*Ficar chateado* = quedar molesto (no «chato», aburrido). *Avisar* = avisar, con el pronombre adelante: *não me avisou*. Molde: *fiquei chateada com você*."],
        ["Não foi isso que eu quis dizer.", "No es eso lo que quise decir.", "*Querer dizer* = querer decir; *quis*, perfeito irregular de *querer*. Donde decís «no es eso», el portugués concuerda el tiempo: *não foi isso*. Molde: *não foi por mal* (no fue con mala intención)."],
        ["Não é bem assim, deixa eu explicar.", "No es tan así, dejame explicarte.", "*Não é bem assim* suaviza el desacuerdo. *Deixa eu* + infinitivo = dejame + verbo; la norma escrita pide *deixe-me*. Molde: *deixa eu terminar*."],
        ["Desculpa, eu exagerei.", "Perdón, me pasé.", "*Exagerar* = pasarse, exagerar, sin *se*: *eu exagerei*. Admitirlo baja la tensión. Molde: *eu errei*, *fui grosso* (fui grosero)."],
        ["Você sempre faz isso!", "¡Siempre hacés lo mismo!", "*Sempre* + presente: el reproche clásico, donde decís «lo mismo», va *isso*. Ojo: el «siempre» y el «nunca» agrandan la pelea. Molde: *você nunca me escuta!*"],
        ["Não quero que a gente brigue por isso.", "No quiero que nos peleemos por esto.", "*Querer que* + subjuntivo: *brigue*, de *brigar* (pelear; *g* → *gu* ante *e*). Con *a gente*, 3.ª singular. Molde: *não quero que você fique triste*."],
        ["Fica tranquilo, já passou.", "Quedate tranquilo, ya pasó.", "*Fica*, imperativo de *ficar* en el habla; *tranquilo* concuerda: *fica tranquila*. *Já passou* = ya pasó. Molde: *fica calmo*, *fica à vontade* (ponete cómodo)."],
        ["Eu entendo o seu lado.", "Entiendo tu postura.", "*O seu lado* = tu lado, tu punto de vista. *Entender* va sin preposición. Molde para ponerte en el lugar del otro: *entendo que você esteja cansado*, con subjuntivo."],
        ["É que eu estava muito cansado.", "Es que estaba muy cansado.", "*É que* = es que: para justificarte, igual que en español. Imperfeito para el estado de fondo: *estava cansado*. Molde: *é que eu não sabia*, *é que tinha trânsito*."],
        ["Vamos fazer as pazes?", "¿Hacemos las paces?", "*Fazer as pazes* = hacer las paces, igual. *Vamos* + infinitivo, sin *a*. Molde: *vamos esquecer isso?*, *vamos recomeçar?*"],
        ["Contanto que você me avise, tudo bem.", "Mientras me avises, está todo bien.", "*Contanto que* = siempre que, mientras: condición + subjuntivo (*avise*). Con el mismo sentido, *desde que*. Molde: *contanto que você chegue cedo*."],
        ["Você é a pessoa com quem eu mais gosto de conversar.", "Sos la persona con la que más me gusta charlar.", "Relativo con preposición: *com quem*, para personas; la preposición va adelante del relativo. *Gostar de conversar*: el *de* de *gostar* no se pierde. Molde: *a pessoa em quem eu confio*."],
        ["Te amo, mesmo quando você me tira do sério.", "Te amo, aunque a veces me saques de quicio.", "*Tirar do sério* = sacar de quicio (literal «sacar de lo serio»). *Mesmo quando* = incluso cuando, con indicativo. *Te amo*, con el pronombre adelante, como se dice en Brasil."]
      ] },

    { id: "empresa", week: 29, emoji: "🏢", name: "Na empresa",
      blurb: "Reuniones, plazos, jefes y colegas: el portugués de la oficina.",
      phrases: [
        ["Vamos marcar uma reunião para alinhar o projeto?", "¿Armamos una reunión para alinear el proyecto?", "*Marcar uma reunião* = agendar una reunión. *Alinhar* = ponerse de acuerdo, en la jerga de oficina. Molde: *vamos alinhar isso amanhã?*"],
        ["Qual é o prazo de entrega?", "¿Cuál es el plazo de entrega?", "*Prazo* = plazo. *Qual é* para preguntar por un dato. Molde: *o prazo vence na sexta*, *estourou o prazo* (se pasó el plazo)."],
        ["Estou sobrecarregado esta semana.", "Estoy tapado de trabajo esta semana.", "*Sobrecarregado* = sobrecargado, desbordado. *Esta semana*, sin preposición. Más informal: *estou atolado de trabalho* (hasta las manos)."],
        ["Assim que eu terminar o relatório, te mando.", "Apenas termine el informe, te lo mando.", "*Assim que* + futuro do subjuntivo: *terminar*, igual al infinitivo en los regulares. *Relatório* = informe. El portugués omite el «lo»: *te mando*. Molde: *quando eu tiver tempo, te ligo*."],
        ["O chefe pediu para nós refazermos a apresentação.", "El jefe nos pidió que rehiciéramos la presentación.", "*Pedir para* + infinitivo pessoal (*refazermos*) es la forma del habla; la escrita, *pediu que refizéssemos*. Molde: *pediu para eles chegarem cedo*."],
        ["Se eu fosse você, pediria um aumento.", "Yo que vos, pediría un aumento.", "Hipótesis: *se* + imperfeito do subjuntivo (*fosse*) + futuro do pretérito (*pediria*). *Se eu fosse você* = yo que vos. *Aumento* = aumento de sueldo."],
        ["Ele pediu demissão na semana passada.", "Renunció la semana pasada.", "*Pedir demissão* = renunciar a un trabajo; al que echan, lo *demitem* (*foi demitido*). *Na semana passada*, con *em* + artículo."],
        ["Trabalho de carteira assinada.", "Trabajo en blanco.", "*Carteira assinada* = la libreta de trabajo firmada: el empleo formal, con los derechos de la CLT. Lo contrario: *trabalhar sem carteira* (en negro) o *como PJ* (monotributista)."],
        ["Vou tirar férias em janeiro.", "Me voy a tomar vacaciones en enero.", "*Tirar férias* = tomarse vacaciones: *tirar* hace de «sacar» y de «tomar». *Férias* va siempre en plural. Molde: *tirar licença*, *tirar folga*."],
        ["Hoje estou de folga.", "Hoy tengo franco.", "*Estar de folga* = tener el día libre. *Folga* es el franco; *férias*, las vacaciones. Molde: *estou de férias*, *estou de plantão* (de guardia)."],
        ["Posso trabalhar de casa amanhã?", "¿Puedo trabajar desde casa mañana?", "*Trabalhar de casa* = trabajar desde casa (también *em home office*, así, en inglés). *Posso* + infinitivo para pedir permiso. Molde: *posso sair mais cedo hoje?*"],
        ["Seria bom a gente dividir as tarefas.", "Estaría bueno que nos dividiéramos las tareas.", "*Seria bom* + infinitivo: una sugerencia suave. Con sujeto propio, el infinitivo lleva persona; con *a gente*, 3.ª singular: *a gente dividir*. Molde: *seria bom vocês chegarem cedo*."],
        ["Caso o cliente ligue, diga que eu volto às três.", "Si el cliente llama, decile que vuelvo a las tres.", "*Caso* + subjuntivo presente = en caso de que: *caso ligue*. *Diga*, imperativo de *dizer* para *você*. Molde: *caso precise, me chama*."],
        ["Bom trabalho, pessoal!", "¡Buen trabajo, equipo!", "*Pessoal* = la gente, el equipo, como vocativo informal: *oi, pessoal!* Sin artículo al llamar. Molde: *valeu, pessoal!*, *pessoal, atenção!*"]
      ] },

    { id: "ideias", week: 30, emoji: "🏛️", name: "Falar de ideias",
      blurb: "Para charlar de historia, política, libros y sociedad de Brasil y Portugal sin quedarte mudo.",
      phrases: [
        ["O Brasil foi o último país independente das Américas a abolir a escravidão, em 1888.", "Brasil fue el último país independiente de América en abolir la esclavitud, en 1888.", "La Lei Áurea la firmó la princesa Isabel el 13 de mayo de 1888. Molde: *o último* / *o primeiro* + sustantivo + *a* + infinitivo = el último en…: donde decís «en abolir», va *a abolir*."],
        ["A corte portuguesa chegou ao Rio em 1808, fugindo de Napoleão.", "La corte portuguesa llegó a Río en 1808, huyendo de Napoleón.", "Río pasó a ser la sede del Imperio portugués. *Fugindo de* = huyendo de: gerundio para la circunstancia, como en español. *Chegar a* + lugar: *chegou ao Rio*, donde el habla dice *chegou no Rio*."],
        ["A Independência foi proclamada em 1822, e a República, em 1889.", "La Independencia se proclamó en 1822, y la República, en 1889.", "Pasiva: *ser* + participio que concuerda: *foi proclamada*. La coma reemplaza al verbo repetido: *e a República, em 1889*. Año con *em*: *em 1822*, donde decís «en»."],
        ["Palmares foi o maior quilombo do período colonial.", "Palmares fue el mayor quilombo del período colonial.", "Su último líder, Zumbi, murió el 20 de noviembre de 1695: hoy es el Dia da Consciência Negra. *O maior* + sustantivo + *do* = el mayor de: superlativo con artículo y *de* + artículo. *Quilombo* = comunidad de esclavizados fugados."],
        ["Durante a ditadura militar, de 1964 a 1985, muitos artistas foram exilados.", "Durante la dictadura militar, de 1964 a 1985, muchos artistas fueron exiliados.", "Caetano Veloso y Gilberto Gil, por ejemplo, vivieron exiliados en Londres. Pasiva *ser* + participio en plural: *foram exilados*. *De 1964 a 1985*, sin artículos, como en español."],
        ["O movimento Diretas Já pedia eleições diretas para presidente.", "El movimiento Diretas Já pedía elecciones directas para presidente.", "Las grandes manifestaciones fueron en 1983 y 1984. *Pedia*: imperfeito para una acción que duró. *Já* = ya: «¡directas ya!». *Para presidente*, sin artículo, como «para presidente»."],
        ["A Constituição de 1988 é chamada de Constituição Cidadã.", "La Constitución de 1988 es llamada Constitución Ciudadana.", "El nombre se lo dio Ulysses Guimarães, presidente de la Asamblea Constituyente. *Ser chamado de* + nombre = ser llamado: en Brasil *chamar* lleva *de* ante el apodo (*chamam ele de Tino*), donde el español no pone nada."],
        ["Sérgio Buarque de Holanda escreveu sobre o homem cordial.", "Sérgio Buarque de Holanda escribió sobre el hombre cordial.", "En *Raízes do Brasil* (1936). *Cordial* viene de *cor, cordis* (corazón): no quiere decir amable, sino guiado por el afecto y no por la regla. *Escrever sobre* = escribir sobre."],
        ["Gilberto Freyre publicou Casa-Grande & Senzala em 1933.", "Gilberto Freyre publicó Casa-Grande & Senzala en 1933.", "Una lectura célebre, y muy discutida, de la sociedad colonial: la *casa-grande* era la casa del señor; la *senzala*, el alojamiento de los esclavizados. Año con *em*: *em 1933*."],
        ["O jeitinho brasileiro é um tema clássico da antropologia.", "El jeitinho brasileño es un tema clásico de la antropología.", "Roberto DaMatta lo analizó junto con el «Você sabe com quem está falando?». *Jeitinho* es diminutivo de *jeito* (manera): la manera de arreglárselas esquivando la regla. *Dar um jeito* = arreglárselas."],
        ["Paulo Freire defendia uma educação libertadora.", "Paulo Freire defendía una educación liberadora.", "*Pedagogia do Oprimido* la escribió en el exilio, en Chile (1968). *Defendia*: imperfeito para una postura sostenida en el tiempo. *Libertador* = liberador, que libera."],
        ["Machado de Assis é considerado o maior escritor brasileiro.", "Machado de Assis es considerado el mayor escritor brasileño.", "Fue el primer presidente de la Academia Brasileira de Letras (1897). *Ser considerado* + atributo, sin preposición: *é considerado o maior*. *O maior* = el mayor, con artículo."],
        ["A Revolução dos Cravos derrubou o Estado Novo em 1974.", "La Revolución de los Claveles derribó el Estado Novo en 1974.", "El 25 de Abril, en Portugal. Una de las señales por radio fue *Grândola, Vila Morena*, de Zeca Afonso. *Cravo* = clavel (y también el clavo de olor). *Derrubar* = derribar, voltear."],
        ["O terremoto de 1755 destruiu grande parte de Lisboa.", "El terremoto de 1755 destruyó gran parte de Lisboa.", "La reconstrucción la dirigió el futuro marqués de Pombal. *Grande parte de* = gran parte de: *grande* no se acorta como «gran». *Destruiu*: perfeito de *destruir*, en *-iu*."],
        ["Fernando Pessoa escreveu com vários heterônimos.", "Fernando Pessoa escribió con varios heterónimos.", "Alberto Caeiro, Ricardo Reis, Álvaro de Campos. En Portugal se escribe *heterónimos*: la vocal ante *m* o *n* va con circunflejo en Brasil y con agudo en Portugal (*econômico* / *económico*)."],
        ["A saudade é um tema central da cultura portuguesa.", "La saudade es un tema central de la cultura portuguesa.", "Eduardo Lourenço la pensó en *O Labirinto da Saudade* (1978). *A saudade*, con artículo, como sustantivo abstracto. *Da cultura* = de + a."],
        ["Brasília foi inaugurada em 1960.", "Brasilia fue inaugurada en 1960.", "Bajo Juscelino Kubitschek; urbanismo de Lúcio Costa, arquitectura de Oscar Niemeyer. Pasiva: *foi inaugurada*, participio que concuerda con *Brasília*. Molde: *a ponte foi construída em…*"],
        ["Esse livro me fez pensar muito.", "Ese libro me hizo pensar mucho.", "*Fazer* + infinitivo = hacer que alguien haga algo: *me fez pensar*, como «me hizo pensar». Molde: *me fez rir*, *me fez chorar*. *Esse*, del habla, para el libro del que se habla."],
        ["Qual é o contexto histórico dessa obra?", "¿Cuál es el contexto histórico de esa obra?", "*Qual é…?* para preguntar por algo concreto, donde a veces decimos «¿cuál es?» o «¿qué?». *Dessa* = de + essa. Molde para charlar de libros: *qual é o tema?*, *quem é o autor?*"]
      ] },

    { id: "aluguel", week: 32, emoji: "📦", name: "Mudança e aluguel",
      blurb: "Buscar departamento, hablar con el dueño y mudarte: fiador, condomínio, contrato.",
      phrases: [
        ["Aluga-se apartamento de dois quartos.", "Se alquila departamento de dos dormitorios.", "Pasiva con *se*: *aluga-se*, el cartel típico. *Quarto* = dormitorio: en Brasil los departamentos se cuentan por dormitorios, no por ambientes. Plural: *alugam-se apartamentos*."],
        ["Quanto é o aluguel com o condomínio?", "¿Cuánto es el alquiler con las expensas?", "*Aluguel* = alquiler; *condomínio* = las expensas (y también el edificio). Se pregunta *quanto é*, sin «sale». Molde: *o IPTU está incluído?* (el impuesto inmobiliario)."],
        ["Precisa de fiador?", "¿Hace falta garante?", "*Fiador* = garante. Sin sujeto, *precisa de…?* = ¿hace falta…? Otras opciones: *seguro-fiança* (seguro de caución) o *caução* (depósito)."],
        ["O apartamento é mobiliado?", "¿El departamento está amueblado?", "*Mobiliado* = amueblado (de *mobília*, los muebles), con *ser* porque es una característica. Lo contrario: *vazio* o *sem móveis*."],
        ["Posso visitar o imóvel no sábado?", "¿Puedo ver la propiedad el sábado?", "*Imóvel* = inmueble, propiedad: la palabra de las inmobiliarias (*imobiliária*). *No sábado* = el sábado. Molde: *posso ver o apartamento hoje?*"],
        ["Quando é que vence o aluguel?", "¿Cuándo vence el alquiler?", "*Vencer* = vencer (un plazo, una cuenta). *Quando é que…?* = ¿cuándo…?, muy frecuente en el habla. Molde: *o boleto vence no dia dez*."],
        ["Vendem-se móveis usados.", "Se venden muebles usados.", "Pasiva con *se*: el verbo concuerda con la cosa, *vendem-se móveis*. En el habla se oye *vende-se móveis*; la norma pide el plural. *Móveis* = muebles, plural de *móvel*."],
        ["A mudança vai ser no fim do mês.", "La mudanza va a ser a fin de mes.", "*Mudança* = mudanza; *mudar-se* = mudarse (*vou me mudar*). *No fim do mês*, con *em* + artículo. Molde: *a mudança é amanhã*."],
        ["Contratei um carreto para levar as caixas.", "Contraté un flete para llevar las cajas.", "*Carreto* = flete, el camioncito de mudanzas. *Para* + infinitivo, igual que en español. *Caixa* = caja. Molde: *contratei uma empresa de mudança*."],
        ["Já assinamos o contrato.", "Ya firmamos el contrato.", "*Assinar* = firmar, con *ss*; *firmar* existe, pero es afirmar o establecer. Molde: *assina aqui, por favor*, *falta assinar*."],
        ["O chuveiro não esquenta: dá para chamar alguém?", "La ducha no calienta: ¿se puede llamar a alguien?", "*Chuveiro* = ducha, en Brasil casi siempre eléctrica. *Dá para* + infinitivo = se puede. Molde: *dá para consertar?*"],
        ["Os vizinhos são gente boa.", "Los vecinos son buena gente.", "*Gente boa* = buena gente, con el adjetivo después; sirve también para una persona: *ele é gente boa*. Molde: *o porteiro é gente boa*."],
        ["Não se aceitam animais no prédio.", "No se aceptan animales en el edificio.", "Pasiva con *se* negativa: *não se aceitam animais*, en plural. *Prédio* = edificio. En la charla: *não pode ter bicho no prédio*. Molde: *não se permite fumar*."],
        ["Deixa eu te ajudar a carregar as caixas!", "¡Dejame ayudarte a cargar las cajas!", "*Carregar* = cargar, llevar a cuestas. *Deixa eu* + infinitivo (norma escrita: *deixe-me*). *Ajudar a* + infinitivo, con *a*. Molde: *deixa eu ver*."]
      ] },

    { id: "politica", week: 34, emoji: "🗳️", name: "Política na mesa",
      blurb: "Hablar de elecciones, impuestos y noticias en un asado sin perder amigos.",
      phrases: [
        ["Em quem você vai votar?", "¿A quién vas a votar?", "*Votar em* alguien: donde decís «votar a», va *em*, y la preposición se adelanta en la pregunta: *em quem*. En Brasil el voto es obligatorio de los 18 a los 70 años."],
        ["Vai ter segundo turno.", "Va a haber segunda vuelta.", "*Segundo turno* = segunda vuelta, el balotaje. *Vai ter* = va a haber: *ter* por *haver* en el habla. Molde: *a eleição foi decidida no primeiro turno*."],
        ["Política, futebol e religião não se discutem.", "Política, fútbol y religión no se discuten.", "El dicho de las mesas brasileñas. Pasiva con *se*, en plural porque son tres cosas: *não se discutem*. Y justo por eso se discuten siempre."],
        ["Eu voto em branco.", "Voto en blanco.", "*Votar em branco* = votar en blanco; *anular o voto* = anular. En la urna electrónica hay una tecla *branco*. Molde: *votei nulo*."],
        ["O imposto está cada vez mais alto.", "Los impuestos están cada vez más altos.", "*Imposto* = impuesto; se dice mucho en singular, como colectivo. *Cada vez mais* + adjetivo, igual que en español. Molde: *o imposto de renda* (el impuesto a las ganancias)."],
        ["Isso é notícia falsa, ou seja, fake news.", "Eso es una noticia falsa, o sea, fake news.", "*Ou seja* = o sea: para reformular. *Fake news* se usa tal cual en Brasil. Molde para desconfiar: *qual é a fonte?* (¿de dónde sale?)."],
        ["Por um lado, o prefeito melhorou os ônibus; por outro, aumentou a tarifa.", "Por un lado, el intendente mejoró los colectivos; por otro, aumentó el boleto.", "*Por um lado… por outro* para sopesar, con el segundo *lado* sobreentendido. *Prefeito* = intendente; *tarifa* = el precio del boleto."],
        ["Não concordo, mas respeito a sua opinião.", "No estoy de acuerdo, pero respeto tu opinión.", "*Concordar* = estar de acuerdo, en un solo verbo. Separar el desacuerdo del respeto baja la temperatura. Molde: *discordo, mas entendo*."],
        ["Quem ganhou o debate ontem?", "¿Quién ganó el debate ayer?", "*Ganhar* = ganar, con *nh*. El debate de la tele es un ritual de la campaña. Molde: *quem se saiu melhor?* (¿a quién le fue mejor?)."],
        ["Segundo a pesquisa, ele está na frente.", "Según la encuesta, él va adelante.", "*Pesquisa* = encuesta (y también investigación). *Estar na frente* = ir adelante. *Segundo* = según. Molde: *de acordo com a pesquisa…*"],
        ["Aliás, você viu o que o vereador disse?", "Por cierto, ¿viste lo que dijo el concejal?", "*Aliás* = por cierto, a propósito: agrega algo o cambia de tema. *Vereador* = concejal, de la *Câmara Municipal*. Molde: *aliás, esqueci de te contar…*"],
        ["Portanto, a culpa não é só do governo.", "Por lo tanto, la culpa no es solo del gobierno.", "*Portanto* = por lo tanto, para concluir. *A culpa é de* = la culpa es de. *Só* = solo. Molde: *portanto, a gente também precisa fazer a nossa parte*."],
        ["Chega de política: vamos falar de outra coisa?", "Basta de política: ¿hablamos de otra cosa?", "*Chega de* + sustantivo = basta de: *chega de papo*. La salida elegante de la discusión. *Outra coisa*, sin artículo indefinido. Molde: *chega de trabalho por hoje*."],
        ["Pelo menos nisso a gente concorda!", "¡Por lo menos en eso estamos de acuerdo!", "*Pelo menos* = por lo menos. *Nisso* = *em* + *isso*. *A gente concorda*, en 3.ª singular. El final feliz de la mesa."]
      ] },

    { id: "burocracia", week: 35, emoji: "📑", name: "Burocracia",
      blurb: "CPF, cartório, senha y segunda via: sobrevivir a la ventanilla brasileña.",
      phrases: [
        ["Preciso tirar o CPF.", "Necesito sacar el CPF.", "*Tirar* = sacar un documento: *tirar o CPF*, *tirar o passaporte*, *tirar a carteira de motorista*. *Precisar* + infinitivo, sin *de*. El CPF es el número de contribuyente: te lo piden para casi todo, hasta en la farmacia."],
        ["Onde fica o cartório mais próximo?", "¿Dónde queda la escribanía más cercana?", "*Onde fica…?* para lugares fijos. Superlativo: *o* + sustantivo + *mais próximo* = el más cercano, con el artículo una sola vez. *Cartório* = registro, escribanía: ahí se certifican firmas y copias."],
        ["Preciso reconhecer firma deste documento.", "Necesito certificar la firma de este documento.", "*Reconhecer firma* = certificar la firma, literal «reconocer firma», sin artículo. Ojo: en otros contextos *firma* es «empresa»; la firma que ponés es *assinatura*. *Deste* = de + este."],
        ["Quais documentos eu preciso trazer?", "¿Qué documentos tengo que traer?", "*Quais* + sustantivo plural = ¿qué…?, donde decís «qué documentos». *Eu* explícito, normal en la pregunta hablada. *Precisar* + infinitivo, sin *de* = tener que. Molde: *quais documentos são necessários?*"],
        ["Tem que pegar senha?", "¿Hay que sacar número?", "*Ter que* + infinitivo, sin sujeto = hay que. *Pegar senha* = sacar número de turno. *Senha* es ese número y también la contraseña. Molde: *tem que marcar horário?*, *tem que pagar?*"],
        ["Qual é o horário de atendimento?", "¿Cuál es el horario de atención?", "*Atendimento* = atención al público, de *atender* (+ *-mento*, como *pagamento*). *Horário* = horario; *qual é…?* = ¿cuál es…? Molde: *qual é o horário de funcionamento?*"],
        ["Preciso de uma segunda via do boleto.", "Necesito un duplicado de la boleta.", "*Precisar de* + sustantivo. *Segunda via* = duplicado, literal «segunda vía». *Boleto* = boleta de pago con código de barras; *pagar um boleto* = pagar una factura. Molde: *segunda via da conta de luz*."],
        ["O sistema está fora do ar.", "El sistema no funciona.", "*Fora do ar* = literal «fuera del aire», como una radio que dejó de transmitir: caído, sin servicio. *Estar* porque es pasajero. Molde: *o site está fora do ar*. La frase que más vas a oír en una ventanilla."],
        ["Onde eu assino?", "¿Dónde firmo?", "*Assinar* = firmar; *assinatura* = firma (y suscripción). El *eu* explícito es normal en la pregunta hablada. Presente para preguntar el procedimiento: *onde eu pago?*, *onde eu entrego?*"],
        ["Faltou uma cópia autenticada.", "Faltó una copia certificada.", "*Faltar* concuerda con lo que falta, que va detrás: *faltou uma cópia*, *faltaram duas*. *Cópia autenticada* = copia certificada por el *cartório*. Molde: *falta assinar aqui*."],
        ["Quanto tempo demora para ficar pronto?", "¿Cuánto tarda en estar listo?", "*Demorar para* + infinitivo = tardar en: *para* donde decís «en». *Ficar pronto* = quedar listo; concuerda: *pronta*. Falso amigo: *pronto* es «listo», no «enseguida». Molde: *demora para sair o resultado?*"],
        ["Vocês aceitam o passaporte como documento?", "¿Aceptan el pasaporte como documento?", "*Vocês* + 3.ª plural: *aceitam* = ¿aceptan?, a la institución. *Como* = en calidad de. Molde: *vocês aceitam cópia?*, *aceitam comprovante digital?*"],
        ["Posso agendar pela internet?", "¿Puedo sacar turno por internet?", "*Agendar* = sacar turno (de *agenda*). *Pela* = por + a: *pela internet*, *pelo telefone*, *pelo aplicativo*. *Posso* + infinitivo = ¿puedo…?"],
        ["O prazo já venceu.", "El plazo ya venció.", "*Vencer* = vencer, un plazo o una factura; *vencimento* = vencimiento. *Já* + perfeito = ya. *Prazo*: pl- español → *pr-*. Molde: *quando vence?*, *o boleto vence amanhã*."],
        ["Preciso abrir uma conta no banco.", "Necesito abrir una cuenta en el banco.", "*Precisar* + infinitivo, sin *de*. *Abrir uma conta* = abrir una cuenta; *conta* es también la cuenta del bar. *No banco* = em + o. Molde: *preciso abrir uma conta corrente* (cuenta corriente)."],
        ["Isso depende do seu visto.", "Eso depende de tu visa.", "*Depender de* + artículo + posesivo: *do seu visto*, donde decís «de tu visa». *O visto* = la visa, masculino (de *ver*). *Isso* = eso. Molde: *depende do caso*."],
        ["Me informaram que o processo leva trinta dias.", "Me informaron que el trámite tarda treinta días.", "3.ª plural sin sujeto = impersonal: *me informaram* = me dijeron, igual que «me informaron». *Processo* = trámite, expediente. *Levar* + tiempo = tardar. Molde: *me disseram que…*"]
      ] },

    { id: "giria", week: 38, emoji: "😎", name: "Gírias cariocas",
      blurb: "El habla de la calle en Río. Todo coloquial: entendelo y usalo solo entre amigos.",
      phrases: [
        ["Coé, mermão!", "¡Qué hacés, hermano!", "Carioca y muy coloquial, entre amigos. *Coé* es *qual é?* («¿cuál es?», o sea ¿qué onda?) gastado por el uso; *mermão* es *meu irmão* (mi hermano) pegado. Así se saluda en la calle en Río: *coé, tudo certo?*"],
        ["Caraca, que maneiro!", "¡Uau, qué copado!", "Coloquial carioca. *Caraca* = ¡uau!, para asombro bueno o malo, versión suave de una palabrota. *Maneiro* = copado, piola. Molde *que* + adjetivo: *que maneiro!*, *que irado!* Entre amigos."],
        ["Tô bolado com isso.", "Estoy re caliente con eso.", "Coloquial carioca: *bolado* = enojado o preocupado, según el tono. *Bolado com* + causa, con *com* donde decís «con» o «por». *Tô* = *estou*. Molde: *fiquei bolado* (me calenté)."],
        ["Deu ruim.", "Salió mal.", "Coloquial: *dar* + adjetivo = salir, resultar: *deu ruim* = salió mal; lo opuesto, *deu bom*. Es la versión joven de *deu errado* / *deu certo*. Sin sujeto: «la cosa». *Ruim* = malo."],
        ["Vou dar um rolé na orla.", "Voy a dar una vuelta por la costanera.", "Coloquial: *dar um rolé* = dar una vuelta, pasear; el molde *dar um* + sustantivo. *Orla* = costanera, el borde de la playa. *Na orla*: *em* donde decís «por». Molde: *bora dar um rolé?*"],
        ["Tá de brincadeira?", "¿Me estás cargando?", "*Estar de brincadeira* = literal «estar de juego»: estar bromeando. *Tá* = *está*. Donde decís «¿me estás cargando?», el portugués dice «¿estás de broma?». Molde: *tá de sacanagem?* (más fuerte, vulgar)."],
        ["Fala sério!", "¡No me digas! / ¡Dejate de joder!", "Imperativo de *falar*: «¡hablá en serio!». Coloquial: expresa incredulidad o fastidio, como «¡dejate de joder!». *Sério* es adverbio acá, sin concordar. Molde: *fala sério, que absurdo!*"],
        ["Ele é gente boa.", "Es buena gente.", "*Gente boa* = buena gente, pero con el adjetivo detrás y sin artículo. Es invariable: *ele é gente boa*, *ela é gente boa*, *eles são gente boa*. Coloquial y muy usado para elogiar a alguien."],
        ["Que parada é essa?", "¿Qué es esto?", "Coloquial carioca: *parada* = cosa, asunto, lo que sea (literal «parada»). *Que* + sustantivo + *é essa?* = ¿qué es esto?, con *essa* por «esta». Molde: *que parada estranha*, *a parada é a seguinte* (la cosa es así)."],
        ["Papo reto: não gostei.", "Te lo digo sin vueltas: no me gustó.", "Coloquial: *papo reto* = literal «charla recta»: hablando en serio, sin vueltas. *Papo* = charla (de ahí *papo furado*, charla vacía). Molde: *papo reto* + opinión franca. Entre amigos."],
        ["Tô de boa.", "Estoy tranqui.", "*Estar de boa* = estar tranqui, sin problema. *Tô* = *estou*. Variante: *numa boa*. Muy coloquial. Molde: *tá de boa?* (¿todo tranqui?), *fica de boa* (quedate tranqui)."],
        ["Ele deu mole.", "Se descuidó.", "Coloquial carioca: *dar mole* = literal «dar blando»: descuidarse, regalarse; también dar pie a un coqueteo. Molde: *não dá mole!* (¡no te descuides!), *deu mole para o ladrão*."],
        ["Ficou irado!", "¡Quedó bárbaro!", "Coloquial carioca: *irado* = genial, no «enojado»: el mismo adjetivo dio vuelta su sentido. *Ficar* + adjetivo = quedar: *ficou irado* = quedó bárbaro. Molde: *o show foi irado*."],
        ["Partiu, galera!", "¡Vamos, gente!", "*Partiu*: perfeito de *partir* usado como «¡vamos!», la salida anunciada como hecha. *Galera* = la barra, los amigos (literal «galera», el barco). Coloquial. Molde: *partiu praia, galera!*"],
        ["Isso aí é roubada.", "Eso es un clavo.", "*Isso aí* = eso, con *aí* de refuerzo coloquial. *Roubada* = mal negocio, trampa, de *roubar* (robar): algo que te roba. Molde: *entrei numa roubada* (me metí en un clavo)."],
        ["Ele é muito mané.", "Es muy gil.", "Coloquial carioca: *mané* = tonto, gil, de *Manuel* (*Mané*). *Ser mané*, con *ser* porque es su manera de ser. Ofende poco, entre amigos. Molde: *deixa de ser mané!*"],
        ["Valeu, tamo junto!", "¡Gracias, estamos!", "Coloquial. *Valeu* = gracias («valió»). *Tamo* = *estamos* sin la *es-*; *junto* sin concordar, invariable en la fórmula: «estamos juntos», cuento con vos. Cierre muy usado entre amigos y en redes."],
        ["Mó calor hoje!", "¡Re calor hoy!", "Coloquial carioca: *mó* viene de *maior* (mayor) gastado: «el mayor calor», o sea re, muy. Va delante del sustantivo: *mó calor*, *mó fila* (re cola), *mó legal*. Solo entre amigos."]
      ] },

    { id: "citacoes", week: 40, emoji: "✒️", name: "Citações célebres",
      blurb: "Versos y frases que cualquier brasileño o portugués reconoce, con su fuente. Aprenderlas es aprender la lengua y la cultura a la vez.",
      phrases: [
        ["No meio do caminho tinha uma pedra.", "En medio del camino había una piedra.", "Carlos Drummond de Andrade, «No meio do caminho» (1928). *Tinha* por *havia*: el uso brasileño de *ter* = haber, llevado a la poesía. *No meio do* = en medio del, con artículos donde el español no los pone."],
        ["E agora, José?", "¿Y ahora, José?", "Drummond, «José» (1942). Hoy se usa como frase hecha ante cualquier callejón sin salida. *E agora?* = ¿y ahora?, con el nombre como vocativo: sirve para cualquier persona, *e agora, Maria?*"],
        ["Ao vencedor, as batatas!", "¡Al vencedor, las papas!", "Machado de Assis, *Quincas Borba* (1891): la sátira del «humanitismo». Sin verbo: *ao* (a + o) + beneficiario, y lo que recibe. Hoy se cita, con ironía, cuando el que gana se queda con todo."],
        ["Viver é muito perigoso.", "Vivir es muy peligroso.", "Guimarães Rosa, *Grande Sertão: Veredas* (1956): Riobaldo lo repite a lo largo de la novela. Infinitivo como sujeto, sin artículo, igual que «vivir es…». *Perigoso* = peligroso: -oso se mantiene."],
        ["O sertão é do tamanho do mundo.", "El sertón es del tamaño del mundo.", "Guimarães Rosa, *Grande Sertão: Veredas*. *Ser do tamanho de* = ser del tamaño de: molde para comparar escalas (*é do tamanho de uma casa*). *Sertão* = el interior semiárido del Nordeste."],
        ["O sertanejo é, antes de tudo, um forte.", "El sertanejo es, antes que nada, un fuerte.", "Euclides da Cunha, *Os Sertões* (1902), el libro sobre la guerra de Canudos. *Antes de tudo* = antes que nada: *tudo* donde decís «nada». *Um forte*: adjetivo sustantivado con artículo."],
        ["Só a antropofagia nos une.", "Solo la antropofagia nos une.", "Oswald de Andrade, *Manifesto Antropófago* (1928): la primera frase. *Só* = solo, delante de lo que se restringe. *Nos une*: pronombre antes del verbo, como en español."],
        ["Ai, que preguiça!", "¡Ay, qué fiaca!", "Mário de Andrade, *Macunaíma* (1928): la muletilla del «herói sem nenhum caráter». *Que* + sustantivo = ¡qué…! *Preguiça* = pereza, fiaca: hoy se dice igual, *que preguiça de trabalhar!*"],
        ["O poeta é um fingidor.", "El poeta es un fingidor.", "Fernando Pessoa, «Autopsicografia» (1932). *Fingidor* = el que finge (de *fingir* + *-dor*). Sigue: «Finge tão completamente / Que chega a fingir que é dor / A dor que deveras sente»."],
        ["Tudo vale a pena se a alma não é pequena.", "Todo vale la pena si el alma no es pequeña.", "Fernando Pessoa, «Mar Português», en *Mensagem* (1934). En el original son dos versos. *Se* + indicativo para una condición general, como en español: *se a alma não é pequena*."],
        ["Navegar é preciso; viver não é preciso.", "Navegar es necesario; vivir no es necesario.", "Pessoa la cita como lema de «navegadores antigos»: viene de Plutarco, que se la atribuye a Pompeyo. Caetano la retomó en «Os Argonautas». *Preciso* = necesario, y también «exacto»: el doble sentido es el juego."],
        ["As armas e os barões assinalados…", "Las armas y los varones señalados…", "Primer verso de *Os Lusíadas* (1572), de Luís de Camões. *Barões* = varones ilustres (no «barones» nobles); *assinalados* = señalados, destacados. Plural en *-ões*: *barão → barões*."],
        ["Amor é fogo que arde sem se ver.", "Amor es fuego que arde sin verse.", "Camões, soneto. *Amor* sin artículo, como abstracto de poema. *Sem se ver* = sin verse: *sem* + pronombre + infinitivo, con el *se* antes del verbo, donde el español lo pega detrás."],
        ["Mudam-se os tempos, mudam-se as vontades.", "Cambian los tiempos, cambian las voluntades.", "Camões, soneto. Con ênclise (*mudam-se*), la norma escrita: el pronombre detrás del verbo. En la charla brasileña sería *os tempos mudam*. *Vontades* = voluntades, deseos."],
        ["Se podes olhar, vê. Se podes ver, repara.", "Si podés mirar, mirá. Si podés ver, fijate.", "Epígrafe de *Ensaio sobre a Cegueira* (1995), de José Saramago, que la atribuye a un imaginario «Livro dos Conselhos». Portugués europeo: tuteo (*podes, vê*). Gradación: *olhar* (mirar), *ver*, *reparar* (fijarse)."],
        ["Não tive filhos, não transmiti a nenhuma criatura o legado da nossa miséria.", "No tuve hijos, no le transmití a ninguna criatura el legado de nuestra miseria.", "Machado de Assis, *Memórias Póstumas de Brás Cubas* (1881): el cierre de la novela. *Transmitir a* alguien + algo: el destinatario va antes del objeto. *Nenhuma* = ninguna, tras *não*: doble negación normal."],
        ["Saio da vida para entrar na História.", "Salgo de la vida para entrar en la Historia.", "Getúlio Vargas, carta-testamento (1954), escrita antes de suicidarse en el Palácio do Catete, en Río. *Sair de* / *entrar em*: *da vida*, *na História*, con artículo. Presente con valor de acto inmediato."],
        ["O Brasil não é para principiantes.", "Brasil no es para principiantes.", "Atribuida a Tom Jobim; no hay una fuente escrita segura. *O Brasil*, con artículo, como siempre. *Ser para* + persona = ser apto para. Molde irónico: *isso não é para amadores*."],
        ["Educação não transforma o mundo. Educação muda pessoas. Pessoas transformam o mundo.", "La educación no transforma el mundo. La educación cambia a las personas. Las personas transforman el mundo.", "Circula como de Paulo Freire, pero así no aparece en sus libros: es una paráfrasis apócrifa. Sustantivos genéricos sin artículo (*educação*, *pessoas*), donde el español pone «la», «las»."],
        ["Ninguém educa ninguém, ninguém educa a si mesmo.", "Nadie educa a nadie, nadie se educa a sí mismo.", "Paulo Freire, *Pedagogia do Oprimido* (1968). Sigue: «os homens se educam entre si, mediatizados pelo mundo». *Ninguém* + verbo + *ninguém*: sin *não* cuando *ninguém* va antes. *A si mesmo* = a sí mismo."],
        ["O povo é quem mais ordena.", "El pueblo es quien más ordena.", "De «Grândola, Vila Morena», de Zeca Afonso, himno del 25 de Abril de 1974. *É quem* = es quien; *mais ordena* = más manda. *Ordenar* = mandar, dar órdenes."],
        ["Vemos, ouvimos e lemos. Não podemos ignorar.", "Vemos, oímos y leemos. No podemos ignorar.", "Sophia de Mello Breyner Andresen, «Cantata da Paz» (1969). Tres verbos en 1.ª plural, sin *nós*. *Ouvir* = oír: *ouvimos*. *Lemos*, de *ler*: donde el español dice «leer», el portugués tiene una sola *e*."],
        ["Liberdade é pouco. O que eu desejo ainda não tem nome.", "La libertad es poco. Lo que deseo todavía no tiene nombre.", "Clarice Lispector, *Perto do Coração Selvagem* (1943). *O que* = lo que, como relativo. *Ainda não* = todavía no. *Não tem nome*: *ter* = tener, sin artículo ante *nome*."],
        ["Olhos de ressaca.", "Ojos de resaca.", "Machado de Assis, *Dom Casmurro* (1899): así describe Bentinho la mirada de Capitu. *Ressaca* es la resaca del mar (la ola que arrastra), y también la del día después. *Olhos de* + sustantivo, sin artículo."],
        ["Independência ou morte!", "¡Independencia o muerte!", "El «Grito do Ipiranga» de Pedro I, el 7 de septiembre de 1822, según la tradición. Sustantivos sin artículo, como consigna. *Morte*: ue española → *o* (*muerte → morte*, *fuerte → forte*)."]
      ] },

    { id: "email", week: 43, emoji: "📧", name: "E-mail formal",
      blurb: "Abrir, pedir, adjuntar y cerrar: lo que se escribe todos los días en una oficina brasileña.",
      phrases: [
        ["Prezado senhor Almeida,", "Estimado señor Almeida:", "*Prezado* es participio de *prezar* (apreciar, estimar): «estimado». Concuerda con el destinatario: *prezada senhora*, *prezados colegas*. Después va coma, no los dos puntos del español. Formal."],
        ["Escrevo para solicitar informações sobre o curso.", "Le escribo para solicitar información sobre el curso.", "*Escrevo para* + infinitivo = le escribo para: el portugués no pone el «le». *Informações* suele ir en plural, donde decís «información». Molde formal: *escrevo para confirmar…*, *para informar que…*"],
        ["Em anexo, envio o meu currículo.", "Adjunto le envío mi currículum.", "*Em anexo* = adjunto, literal «en anexo»: invariable, va al principio o al final. El mail formal habla en primera persona: *envio* = le envío, sin «le». Molde: *em anexo, encaminho o contrato*."],
        ["Segue em anexo o relatório.", "Adjunto el informe.", "*Seguir* = ir, acompañar: *segue em anexo* = «sigue adjunto», con el sujeto (*o relatório*) detrás. Concuerda: *seguem em anexo os documentos*. La fórmula más común del mail de oficina. *Relatório* = informe."],
        ["Conforme combinado, envio a proposta.", "Según lo acordado, le envío la propuesta.", "*Conforme* + participio = según lo…, sin artículo ni «lo»: *conforme combinado*, *conforme solicitado*, *conforme conversamos*. *Combinado* = acordado. *Envio*: presente, 1.ª persona. Registro de oficina."],
        ["Agradeço desde já a atenção.", "Le agradezco de antemano su atención.", "*Agradecer* + objeto directo, sin *por*: *agradeço a atenção*, donde decís «le agradezco por». *Desde já* = de antemano, literal «desde ya». Cierre cortés antes de la firma. Molde: *agradeço desde já a ajuda*."],
        ["Fico no aguardo de seu retorno.", "Quedo a la espera de su respuesta.", "*Ficar no aguardo de* = quedar a la espera de: *aguardo* (espera) viene de *aguardar* (esperar). *Retorno* = respuesta, en el lenguaje de oficina. *Fico* en presente donde decís «quedo». Formal."],
        ["Peço desculpas pelo atraso na resposta.", "Pido disculpas por la demora en responder.", "*Pedir desculpas por* algo = pedir disculpas por; *pelo* = por + o. *Peço*: 1.ª persona irregular de *pedir*. *Atraso na resposta*: *em* donde decís «en». Molde: *peço desculpas pelo transtorno*."],
        ["Gostaria de confirmar a reunião de quinta-feira.", "Quisiera confirmar la reunión del jueves.", "*Gostaria de* + infinitivo = quisiera, con quien escribe como sujeto. El día va con *de*, sin artículo: *a reunião de quinta-feira*, donde decís «del jueves». *Quinta-feira* = jueves: los días hábiles se numeran."],
        ["Poderia me enviar os documentos até sexta?", "¿Podría enviarme los documentos a más tardar el viernes?", "*Poderia* (condicional) + *me* + infinitivo: en Brasil el pronombre va antes del infinitivo, *me enviar*, donde decís «enviarme». *Até sexta* = hasta el viernes, es decir a más tardar el viernes."],
        ["Estou à disposição para qualquer esclarecimento.", "Quedo a disposición para cualquier aclaración.", "*À disposição* = a + a disposição, con crase, donde decís «a disposición», sin artículo. *Estou*, donde decís «quedo». *Esclarecimento* = aclaración, de *esclarecer*. Cierre formal estándar."],
        ["Atenciosamente,", "Atentamente,", "Adverbio de *atencioso* (atento): el cierre formal estándar, seguido del nombre. Con coma, como en español. Más cálido: *cordialmente*; entre colegas: *abraço*."],
        ["Um abraço,", "Un abrazo,", "Cierre cordial entre colegas que ya se conocen: menos formal que *atenciosamente*, más que *beijos*. *Abraço* = abrazo: -zo español → *-ço*. Variante: *abraços*."],
        ["Em resposta ao seu e-mail de ontem, informo que o pagamento foi realizado.", "En respuesta a su mail de ayer, le informo que el pago fue realizado.", "*Em resposta a* = en respuesta a: *ao seu e-mail*. *Informar que* + indicativo, sin «le»: *informo que*. Pasiva: *foi realizado* concuerda con *o pagamento*. Molde: *em resposta à sua solicitação…*"],
        ["Solicito, por gentileza, a confirmação do recebimento.", "Solicito, por favor, la confirmación de recepción.", "*Por gentileza* = por favor, en lo formal (literal «por gentileza»). *Solicito* + objeto directo, en 1.ª persona. *Recebimento* = recepción, de *receber* + *-mento*. Molde: *solicito, por gentileza, o envio de…*"],
        ["Encaminho abaixo a mensagem da diretoria.", "Le reenvío abajo el mensaje de la dirección.", "*Encaminhar* = reenviar, derivar (literal «encaminar»). *Abaixo* = abajo, en el cuerpo del mail; *acima* = arriba. *Diretoria* = la dirección de la empresa. Molde: *encaminho abaixo as informações*."],
        ["Caso haja alguma dúvida, estou à disposição.", "Si tuviera alguna duda, quedo a disposición.", "*Caso* + subjuntivo presente = si, en caso de que: *caso haja*, de *haver*. Registro escrito formal; en la charla, *se tiver alguma dúvida*. Molde: *caso precise, é só avisar*."]
      ] },

    { id: "debate", week: 47, emoji: "🗣️", name: "Debater e argumentar",
      blurb: "Dar la opinión, conceder y contradecir sin pelear, con las ideas de quienes pensaron Brasil y Portugal.",
      phrases: [
        ["Em primeiro lugar, é preciso definir o problema.", "En primer lugar, hay que definir el problema.", "*É preciso* + infinitivo = hay que, es necesario: acá *preciso* es necesario, no «exacto». *Em primeiro lugar* = en primer lugar, con *em*. Molde para ordenar: *em segundo lugar…*, *por fim…*"],
        ["Por outro lado, não podemos esquecer o contexto histórico.", "Por otro lado, no podemos olvidar el contexto histórico.", "*Esquecer* + objeto directo, sin *de*: *esquecer o contexto*, donde decís «olvidarnos del». Con pronombre sí lleva *de*: *esquecer-se de*. *Por outro lado* = por otro lado."],
        ["Concordo em parte, mas discordo da conclusão.", "Estoy de acuerdo en parte, pero no con la conclusión.", "*Concordar com* / *discordar de*: *discordo da conclusão* (de + a). *Em parte* = en parte. Molde para matizar sin pelear: *concordo em parte, mas…*"],
        ["Não se trata de culpar ninguém.", "No se trata de culpar a nadie.", "*Tratar-se de* impersonal = se trata de, con *se* antes del verbo por la negación. Doble negación normal: *não… ninguém*. Sin «a» personal: *culpar ninguém*, donde decís «a nadie»."],
        ["Darcy Ribeiro via os brasileiros como um povo novo.", "Darcy Ribeiro veía a los brasileños como un pueblo nuevo.", "En *O Povo Brasileiro* (1995): un pueblo hecho de matrices indígenas, africanas y europeas. *Via*: imperfeito de *ver*. *Ver X como Y* = ver a X como Y, sin «a» personal: *via os brasileiros*."],
        ["Vale lembrar que a abolição não veio acompanhada de reparação.", "Vale recordar que la abolición no vino acompañada de reparación.", "Florestan Fernandes estudió cómo la sociedad de clases no integró a los libertos (*A Integração do Negro na Sociedade de Classes*, 1964). *Vale lembrar que* = vale recordar que. *Vir acompanhado de* = venir acompañado de."],
        ["Lélia Gonzalez propôs o conceito de amefricanidade.", "Lélia Gonzalez propuso el concepto de amefricanidad.", "Intelectual y militante del movimiento negro; el concepto es de 1988. *Propôs*: perfeito irregular de *propor* (de *pôr*: *pus, pôs*). Molde: *propor um conceito*, *propor uma ideia*."],
        ["Para Roberto Schwarz, o liberalismo no Brasil escravista era uma ideia fora do lugar.", "Para Roberto Schwarz, el liberalismo en el Brasil esclavista era una idea fuera de lugar.", "Del ensayo «As ideias fora do lugar» (1973). *Para* + autor = según: *para Schwarz*, *para Freire*. *Fora do lugar* = fuera de lugar, con artículo."],
        ["Milton Santos pensou a globalização a partir do Sul.", "Milton Santos pensó la globalización desde el Sur.", "Geógrafo bahiano; *Por uma Outra Globalização* (2000). *A partir de* = desde, a partir de: *a partir do Sul*. *Pensar* + objeto directo = pensar algo, reflexionar sobre."],
        ["Boaventura de Sousa Santos fala em epistemologias do Sul.", "Boaventura de Sousa Santos habla de epistemologías del Sur.", "Sociólogo portugués, de la Universidad de Coimbra. *Falar em* + concepto = hablar de, proponer: *falar em crise*. Con *em* donde decís «de»."],
        ["A antropofagia de Oswald propunha devorar a cultura estrangeira e transformá-la.", "La antropofagia de Oswald proponía devorar la cultura extranjera y transformarla.", "Pronombre tras infinitivo: *transformar* + *a* → *transformá-la* (cae la *r*, lleva tilde), donde decís «transformarla». Registro escrito; en la charla, *transformar ela*. *Propunha*: imperfeito de *propor*, como *punha* de *pôr*."],
        ["Ainda que o argumento seja forte, faltam dados.", "Aunque el argumento sea fuerte, faltan datos.", "*Ainda que* + subjuntivo = aunque, para conceder: literal «aun que». *Faltam dados*: *faltar* concuerda con lo que falta, que va detrás. Molde para conceder y objetar: *ainda que seja verdade, não basta*."],
        ["Não resta dúvida de que a desigualdade é o grande problema do país.", "No cabe duda de que la desigualdad es el gran problema del país.", "*Não resta dúvida de que* + indicativo = no cabe duda de que: *restar* = quedar, sobrar. Ojo con el *de* antes de *que*, obligatorio en lo escrito. *O grande problema*: *grande* antes del sustantivo = principal."],
        ["Eu diria que a questão é mais complexa.", "Yo diría que la cuestión es más compleja.", "Condicional *diria* (de *dizer*, raíz *dir-*) para opinar con cautela, igual que «yo diría». *Questão* = cuestión, tema. Molde para matizar sin chocar: *eu diria que depende*, *eu diria que não é bem assim*."],
        ["Se me permite discordar…", "Si me permite disentir…", "*Se* + presente de indicativo para una condición cortés: «si me permite». *Me* antes del verbo, como en español. *Discordar* = disentir. Molde para interrumpir con elegancia: *se me permite uma observação…*"],
        ["Até que ponto isso é verdade?", "¿Hasta qué punto eso es verdad?", "*Até que ponto* = hasta qué punto: *até* = hasta. Pregunta que pone en duda sin negar. *Isso* = eso, lo recién dicho. Molde: *até que ponto isso é justo?*, *até que ponto dá para confiar?*"],
        ["O argumento não se sustenta.", "El argumento no se sostiene.", "*Sustentar-se* = sostenerse. Con negación el pronombre va antes del verbo: *não se sustenta*; sin ella, lo escrito pide *sustenta-se*. Molde para refutar con cortesía: *essa tese não se sustenta*, *os dados não se confirmam*."],
        ["Em suma, o debate continua aberto.", "En suma, el debate sigue abierto.", "*Em suma* = en suma, para cerrar. *Continuar* + adjetivo = seguir: *continua aberto*, donde decís «sigue abierto»; *seguir* también existe, pero *continuar* es más frecuente. Molde: *em suma, a questão continua sem resposta*."]
      ] }
  ];

  /* ------------------------------------------- errores del hispanohablante

     Frasi.traps(frase) devuelve la misma frase con los errores típicos de
     quien habla español (Grannier 2002; Durão 1999; Almeida Filho 1995): la
     palabra española que se cuela (muy, más, hoy, todo), la contracción
     deshecha a la española (del, al, en el, a la), la grafía española
     (ñ, ll, -ción, -dad, -ble, -aje) y la -m final escrita -n.  Nunca un
     error que se descarte por el sentido: siempre la misma frase.  Acá van
     las tablas; el recorrido de la frase está en el núcleo (frasi.js). */

  // The Spanish word that slips in.  Only what is never right in Portuguese
  // in that slot.
  var SPAN = {
    "muito": "muy", "muita": "mucha", "muitos": "muchos", "muitas": "muchas",
    "mais": "más", "não": "no", "sim": "sí", "também": "también", "então": "entonces",
    "depois": "después", "agora": "ahora", "hoje": "hoy", "amanhã": "mañana", "ontem": "ayer",
    "noite": "noche", "bom": "buen", "boa": "buena", "eu": "yo", "e": "y", "com": "con",
    "sem": "sin", "em": "en", "um": "un", "uma": "una", "tudo": "todo", "sou": "soy",
    "estou": "estoy", "vou": "voy", "tenho": "tengo", "tem": "tiene", "quero": "quiero",
    "posso": "puedo", "pode": "puede", "é": "es", "são": "son", "onde": "donde",
    "quando": "cuando", "qual": "cual", "quem": "quien", "ninguém": "nadie", "alguém": "alguien",
    "sempre": "siempre", "ainda": "todavía", "isso": "eso", "isto": "esto", "esse": "ese",
    "essa": "esa", "aquilo": "aquello", "meu": "mi", "minha": "mi", "seu": "su", "sua": "su",
    "pouco": "poco", "outro": "otro", "outra": "otra", "coisa": "cosa", "pessoa": "persona",
    "nome": "nombre", "fome": "hambre", "praia": "playa", "cerveja": "cerveza",
    "desculpa": "disculpa", "até": "hasta", "mim": "mí", "comigo": "conmigo", "fala": "habla",
    "falar": "hablar", "fazer": "hacer", "faz": "hace", "ele": "él", "ela": "ella",
    "nós": "nosotros", "vocês": "ustedes", "bem": "bien", "mesmo": "mismo", "melhor": "mejor",
    "pior": "peor", "trabalho": "trabajo", "filho": "hijo", "mulher": "mujer", "novo": "nuevo",
    "nova": "nueva", "tempo": "tiempo", "festa": "fiesta", "porta": "puerta",
    "obrigado": "obligado", "obrigada": "obligada", "prato": "plato", "igreja": "iglesia",
    "chegar": "llegar", "chamo": "llamo", "chove": "llueve", "cheio": "lleno", "chave": "llave",
    "leite": "leche", "oito": "ocho", "feito": "hecho", "direito": "derecho",
    "cidade": "ciudad", "ano": "año", "pão": "pan", "mão": "mano", "irmão": "hermano",
    "pequeno": "pequeño", "senhor": "señor", "senhora": "señora", "há": "hay", "aqui": "acá",
    "lá": "allá", "aceita": "acepta", "aceitam": "aceptan", "receita": "receta",
    "dois": "dos", "quatro": "cuatro", "sete": "siete", "nove": "nueve", "dez": "diez",
    "meio": "medio", "quilo": "kilo", "uns": "unos", "umas": "unas", "ajuda": "ayuda",
    "escreve": "escribe", "escrever": "escribir", "quer": "quiere", "dizer": "decir",
    "diz": "dice", "saúde": "salud", "aquela": "aquella", "aquele": "aquel", "deus": "dios",
    "esquisita": "exquisita", "esquisito": "exquisito", "vai": "va", "foi": "fue",
    "goste": "guste", "ou": "o", "morte": "muerte", "se": "si", "pães": "panes"
  };
  // The contraction undone the Spanish way.
  var CONTR = {
    "no": "en el", "na": "en la", "nas": "en las", "do": "del", "da": "de la",
    "dos": "de los", "das": "de las", "ao": "al", "aos": "a los", "à": "a la", "às": "a las",
    "pelo": "por el", "pela": "por la", "pelos": "por los", "pelas": "por las",
    "num": "en un", "numa": "en una", "dele": "de él", "dela": "de ella", "deles": "de ellos",
    "delas": "de ellas", "neste": "en este", "nesta": "en esta", "nesse": "en ese",
    "nessa": "en esa", "disso": "de eso", "nisso": "en eso", "daqui": "de aquí", "deste": "de este",
    "desse": "de ese", "dessa": "de esa"
  };
  // The article the Spanish way.
  var ART = { "o": "el", "os": "los", "a": "la", "as": "las" };

  // The same word spelled the Spanish way (ñ, ll, -ción, -dad, -ble, -aje).
  function spell(low) {
    var out = [];
    if (/nh/.test(low)) out.push(low.replace("nh", "ñ"));
    if (/lh/.test(low)) out.push(low.replace("lh", "ll"));
    if (/ções$/.test(low)) out.push(low.replace(/ções$/, "ciones"));
    else if (/ção$/.test(low)) out.push(low.replace(/ção$/, "ción"));
    if (/dade$/.test(low) && low.length > 5) out.push(low.replace(/dade$/, "dad"));
    if (/veis$/.test(low)) out.push(low.replace(/veis$/, "bles"));
    else if (/vel$/.test(low) && low.length > 4) out.push(low.replace(/vel$/, "ble"));
    if (/agem$/.test(low)) out.push(low.replace(/agem$/, "aje"));
    if (/eir[oa]s?$/.test(low) && low.length > 5) out.push(low.replace(/eir([oa]s?)$/, "er$1"));
    if (/íssim[oa]s?$/.test(low)) out.push(low.replace(/íssim/, "ísim"));
    // ch- where Spanish has ll- (chegar → llegar, chamar → llamar, chover → llover)
    if (/^ch(eg|am|ov|or|ei)/.test(low)) out.push(low.replace(/^ch/, "ll"));
    return out;
  }
  // Looser slips: ss → s, final -m → -n, ç → z.
  function loose(low) {
    var out = [];
    if (/ss/.test(low) && low.length > 4) out.push(low.replace("ss", "s"));
    if (/[aeiouãõ]m$/.test(low) && low.length > 2) out.push(low.slice(0, -1) + "n");
    if (/ç/.test(low)) out.push(low.replace("ç", "z"));
    // the Spanish preterite ending: ficou → ficó, partiu → partió, valeu → valió
    if (/[^aeiou]ou$/.test(low) && low.length > 3) out.push(low.slice(0, -2) + "ó");
    if (/[^aeiou][ie]u$/.test(low) && low.length > 3) out.push(low.slice(0, -2) + "ió");
    return out;
  }


  root.FRASI_DATA = {
    SCENES: SCENES,
    // Cloze: words too common to be the one to recall.
    STOP: ["você", "vocês", "como", "isso", "esse", "essa", "este", "esta", "muito", "muita",
           "mais", "também", "porque", "sempre", "ainda", "então", "para", "pela", "pelo",
           "está", "estou", "não", "uma", "que", "com", "sem", "mas", "dos", "das", "nos", "nas"],
    ui: {
      tiles: "Armá la frase en portugués",
      write: "Escribilo en portugués (las tildes no cuentan)",
      dictation: "Ditado: escuchá y escribí lo que oís"
    },
    // Frasi.traps(): the word that slips in (span; alone: when it ends the
    // sentence), the contraction undone (contr, only before a word), the
    // article (art, looser), the spelling (spell) and looser slips (loose).
    // from: the week each table starts to count (contractions and articles: week 3).
    traps: { span: SPAN, alone: { "muito": "mucho" }, contr: CONTR, art: ART, spell: spell, loose: loose,
             from: { contr: 3, art: 3 } },
    // «Adiviná» without enough traps: these words always go before the next
    // one (article, preposition, clitic), so swapping them is an error.
    glue: ["o", "a", "os", "as", "um", "uma", "uns", "umas", "de", "em", "por", "para", "com", "sem", "no", "na",
           "nos", "nas", "do", "da", "dos", "das", "ao", "à", "pelo", "pela", "num", "numa", "me", "te", "se", "lhe"]
  };
})(typeof window !== "undefined" ? window : globalThis);
