#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Controla las lecturas semanales (docs/lang/pt/letture_settimana.js) contra el curso.

    python3 tools/check_letture.py            todas (informe de las que fallan)
    python3 tools/check_letture.py w-3        solo las que empiezan con «w-3», con detalle
    python3 tools/check_letture.py -v         detalle de todas

Para cada texto de la semana N:

1. Gramática: nada posterior a la semana N (curriculo.TENSE_WEEK y las
   construcciones de la tabla CONSTR).  Los tiempos se reconocen por la forma:
   un generador de formas del portugués (abajo) para los verbos del
   vocabulario, más las formas de docs/lang/pt/conjugator.js (window.Conj) si ya es
   el conjugador portugués.  Una forma ambigua (fale = imperativo o
   subjuntivo; falamos = presente o perfeito) cuenta por su lectura más
   temprana: el detector prefiere dejar pasar a descartar de más.  En lo que
   se lee el presente vale desde la semana 1 (CONTENIDO.md).
2. Vocabulario: a lo sumo tres palabras desconocidas sin glosa (sin contar
   nombres propios).  Se da por conocida una palabra si su lema está en el
   vocabulario básico del nivel (VOCAB, abajo, por nivel como en lessico.py:
   A1 desde la 1, A2 desde la 9, B1 desde la 19, B2 desde la 31, C1 desde la
   43), si se glosó en un texto de una semana anterior, si aparece en la
   teoría de una semana ≤ N (tools/lessons, cuando está en portugués), o si
   es transparente para un hispanohablante (sufijos cultos: -ção, -dade,
   -mente, -ismo, -ível…).
3. Forma: 80-110 palabras hasta la semana 26 y 110-160 desde la 27; tres
   preguntas con la respuesta entre las opciones; vf con "verdadeiro",
   "falso" o "não se diz"; los blancos de la caza y las claves del glosario
   están en el texto; al menos tres glosas sirven para opción múltiple.
"""
import json
import os
import re
import subprocess
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import curriculo  # noqa: E402

LEVEL_WEEK = {"A1": 1, "A2": 9, "B1": 19, "B2": 31, "C1": 43, "T": 1}
VF = ("verdadeiro", "falso", "não se diz")

# ---------------------------------------------------------------- gramática
# Semana de cada tiempo (curriculo.TENSE_WEEK); en lectura el presente vale
# desde la 1.
TW = dict(curriculo.TENSE_WEEK)
TW["presente"] = 1
TW["imperativo"] = min(TW["imperativo"], TW.get("subjPresente", 99))
TW["gerundio"] = curriculo.TENSE_WEEK["gerundio"]

# Construcciones que no son un tiempo simple (semana en que se enseñan).
CONSTR = {
    "ir + infinitivo": 8,
    "possessivos": 3,
    "demonstrativos contraídos": 10,
    "crase": 7,
    "àquele / àquela": 36,
    "pronome átono (o, a, lhe)": 16,
    "reflexivo enclítico": 12,
    "mesóclise": 33,
    "perfeito composto": 21,
    "mais-que-perfeito composto": 21,
    "voz passiva (ser + particípio)": 22,
    "comparativo": 19,
    "relativo cujo / o qual": 25,
    "tempos compostos do subjuntivo e condicional": 30,
}
# Formas fijas que se enseñan como vocabulario antes que su tiempo.
FIXED = {"tomara": 23, "chamo-me": 1, "chama-se": 1, "pudera": 41}
# Palabras que coinciden con una forma verbal tardía pero acá no lo son.
NOT_VERBS = set("""
fora colher colheres sobre entre tarde livre conforme segundo cara caso canto sede meio medo nada passo
casa como pena rede sorte parte janta porta volta certo junto vale base corte ante saia
venda verão sério nossa graça pé gente jogo baixo alto fundo espera mesa conta cedo acordo
chefe prova marco batida suma letra vindo pois morro combinado passados prezados falta
vista verdes
""".split())
FIXED_CONNECTORS = {"seja": 26}   # «ou seja», «seja como for»: fórmulas

# Sustantivos en -ar / -er / -ir que no son verbos.
NOUNS_R = set("bar mar lugar par lar açúcar colher mulher talher ar elixir".split())

# Palabras extranjeras citadas (el inglés de Oswald, el latín de Sérgio Buarque).
FOREIGN = set("the not or question that is cor cordis".split())

# Participios que funcionan como adjetivo: «está cansado» no es una pasiva.
ADJ_PP = set("""
cansado cansada cansados cansadas casado casada obrigado obrigada ocupado
ocupada preocupado preocupada animado animada lotado lotada fechado fechada
aberto aberta atrasado atrasada emocionado emocionada conhecido conhecida
conhecidos conhecidas considerado considerada famoso ligado apaixonado
sentado sentada escrito calado acelerado combinado marcado marcada
""".split())

TER = {"tenho", "tens", "tem", "temos", "têm", "tinha", "tinhas", "tínhamos", "tinham"}
TER_PRES = {"tenho", "tens", "tem", "temos", "têm"}
TER_LATE = {"tenha", "tenhas", "tenhamos", "tenham", "tivesse", "tivesses", "tivéssemos",
            "tivessem", "tiver", "tiveres", "tivermos", "tiverem", "teria", "terias",
            "teríamos", "teriam", "terei", "terá", "teremos", "terão", "ter"}
SER = {"sou", "és", "é", "somos", "são", "era", "eram", "foi", "foram", "fui", "será",
       "serão", "seria", "seriam", "seja", "sejam", "fosse", "fossem", "sido", "ser", "for", "forem"}
IR_PRES = {"vou", "vais", "vai", "vamos", "vão"}
BETWEEN = {"não", "já", "nunca", "sempre", "também", "ainda", "muito", "bem", "se", "me",
           "te", "lhe", "nos", "o", "a", "os", "as", "mesmo", "até", "só"}
SUBJ_PRON = {"eu", "tu", "você", "ele", "ela", "nós", "eles", "elas", "vocês", "gente"}
ADVS = {"não", "já", "nunca", "sempre", "também", "ainda", "muito", "bem", "mesmo", "só", "logo"}
POSS = re.compile(r"^(meu|minha|meus|minhas|teu|tua|teus|tuas|seu|sua|seus|suas|nosso|nossa|nossos|nossas)$")
DEM_CONTR = re.compile(r"^(n|d)(este|esta|estes|estas|esse|essa|esses|essas|isto|isso|aquele|aquela|aqueles|aquelas|aquilo)$")
ENCL_OBJ = re.compile(r"^[a-zà-ú]+-(o|a|os|as|lo|la|los|las|no|na|nos|nas|lhe|lhes)$")
ENCL_REFL = re.compile(r"^[a-zà-ú]+-(me|te|se)$")
MESO = re.compile(r"^[a-zà-ú]+-(me|te|se|lhe|lhes|nos|vos|o|a|os|as|lo|la|los|las)-(ei|ás|á|emos|eis|ão|ia|ias|íamos|íeis|iam)$")


def plain(w):
    return "".join(c for c in unicodedata.normalize("NFD", w) if unicodedata.category(c) != "Mn")


# ------------------------------------------------- generador de formas (PB)
# Suficiente para reconocer tiempos: regulares, ortografía (-car, -gar, -çar,
# -cer, -ger/-gir, -guir) y los irregulares frecuentes con sus derivados.
IRR = {
    "ser": dict(pres="sou és é somos sois são", perf="fui foste foi fomos fostes foram",
                imp="era eras era éramos éreis eram", subj="seja sejas seja sejamos sejais sejam", pp="sido"),
    "estar": dict(pres="estou estás está estamos estais estão",
                  perf="estive estiveste esteve estivemos estivestes estiveram",
                  subj="esteja estejas esteja estejamos estejais estejam"),
    "ter": dict(pres="tenho tens tem temos tendes têm", perf="tive tiveste teve tivemos tivestes tiveram",
                imp="tinha tinhas tinha tínhamos tínheis tinham", subj="tenha tenhas tenha tenhamos tenhais tenham"),
    "haver": dict(pres="hei hás há havemos haveis hão", perf="houve houveste houve houvemos houvestes houveram",
                  subj="haja hajas haja hajamos hajais hajam"),
    "ir": dict(pres="vou vais vai vamos ides vão", perf="fui foste foi fomos fostes foram",
               subj="vá vás vá vamos vades vão"),
    "vir": dict(pres="venho vens vem vimos vindes vêm", perf="vim vieste veio viemos viestes vieram",
                imp="vinha vinhas vinha vínhamos vínheis vinham", subj="venha venhas venha venhamos venhais venham",
                pp="vindo", ger="vindo"),
    "fazer": dict(pres="faço fazes faz fazemos fazeis fazem", perf="fiz fizeste fez fizemos fizestes fizeram",
                  fut="far", pp="feito"),
    "dizer": dict(pres="digo dizes diz dizemos dizeis dizem", perf="disse disseste disse dissemos dissestes disseram",
                  fut="dir", pp="dito"),
    "trazer": dict(pres="trago trazes traz trazemos trazeis trazem",
                   perf="trouxe trouxeste trouxe trouxemos trouxestes trouxeram", fut="trar"),
    "poder": dict(pres="posso podes pode podemos podeis podem", perf="pude pudeste pôde pudemos pudestes puderam"),
    "querer": dict(pres="quero queres quer queremos quereis querem",
                   perf="quis quiseste quis quisemos quisestes quiseram", subj="queira queiras queira queiramos queirais queiram"),
    "saber": dict(pres="sei sabes sabe sabemos sabeis sabem", perf="soube soubeste soube soubemos soubestes souberam",
                  subj="saiba saibas saiba saibamos saibais saibam"),
    "caber": dict(pres="caibo cabes cabe cabemos cabeis cabem", perf="coube coubeste coube coubemos coubestes couberam"),
    "ver": dict(pres="vejo vês vê vemos vedes veem", perf="vi viste viu vimos vistes viram", pp="visto"),
    "dar": dict(pres="dou dás dá damos dais dão", perf="dei deste deu demos destes deram",
                subj="dê dês dê demos deis deem"),
    "pôr": dict(pres="ponho pões põe pomos pondes põem", perf="pus puseste pôs pusemos pusestes puseram",
                imp="punha punhas punha púnhamos púnheis punham", fut="por", pp="posto", ger="pondo"),
    "ler": dict(pres="leio lês lê lemos ledes leem", perf="li leste leu lemos lestes leram"),
    "crer": dict(pres="creio crês crê cremos credes creem", perf="cri creste creu cremos crestes creram"),
    "rir": dict(pres="rio ris ri rimos rides riem", perf="ri riste riu rimos ristes riram"),
    "sair": dict(pres="saio sais sai saímos saís saem", perf="saí saíste saiu saímos saístes saíram",
                 imp="saía saías saía saíamos saíeis saíam"),
    "cair": dict(pres="caio cais cai caímos caís caem", perf="caí caíste caiu caímos caístes caíram",
                 imp="caía caías caía caíamos caíeis caíam"),
    "valer": dict(pres="valho vales vale valemos valeis valem"),
    "perder": dict(pres="perco perdes perde perdemos perdeis perdem"),
    "ouvir": dict(pres="ouço ouves ouve ouvimos ouvis ouvem"),
    "pedir": dict(pres="peço pedes pede pedimos pedis pedem"),
    "medir": dict(pres="meço medes mede medimos medis medem"),
    "dormir": dict(pres="durmo dormes dorme dormimos dormis dormem"),
    "subir": dict(pres="subo sobes sobe subimos subis sobem"),
    "fugir": dict(pres="fujo foges foge fugimos fugis fogem"),
    "construir": dict(pres="construo constróis constrói construímos construís constroem",
                      perf="construí construíste construiu construímos construístes construíram"),
    "destruir": dict(pres="destruo destróis destrói destruímos destruís destroem",
                     perf="destruí destruíste destruiu destruímos destruístes destruíram"),
    "abrir": dict(pp="aberto"), "cobrir": dict(pres="cubro cobres cobre cobrimos cobris cobrem", pp="coberto"),
    "escrever": dict(pp="escrito"), "morrer": dict(pp="morto"), "matar": dict(pp="morto"),
    "ganhar": dict(pp="ganho"), "gastar": dict(pp="gasto"), "pagar": dict(pp="pago"),
    "eleger": dict(pp="eleito"), "aceitar": dict(pp="aceito"), "entregar": dict(pp="entregue"),
    "prender": dict(pp="preso"), "acender": dict(pp="aceso"), "imprimir": dict(pp="impresso"),
}
# Derivados: prefijo + verbo base.
DERIV = {"propor": "pôr", "compor": "pôr", "supor": "pôr", "dispor": "pôr", "expor": "pôr", "impor": "pôr",
         "manter": "ter", "conter": "ter", "obter": "ter", "deter": "ter", "reter": "ter", "entreter": "ter",
         "intervir": "vir", "convir": "vir", "provir": "vir", "prever": "ver", "rever": "ver",
         "desfazer": "fazer", "satisfazer": "fazer", "refazer": "fazer", "contradizer": "dizer",
         "conseguir": "seguir", "perseguir": "seguir", "sorrir": "rir", "atrair": "trair", "distrair": "trair",
         "recair": "cair", "reler": "ler", "descobrir": "cobrir", "recobrir": "cobrir"}
E_TO_I = set("preferir sentir seguir vestir servir repetir mentir divertir sugerir ferir referir "
             "conseguir perseguir despir competir digerir investir consentir pressentir".split())
IRR["trair"] = dict(pres="traio trais trai traímos traís traem", perf="traí traíste traiu traímos traístes traíram",
                    imp="traía traías traía traíamos traíeis traíam")
IRR["seguir"] = dict(pres="sigo segues segue seguimos seguis seguem")

ACC = {"a": "á", "e": "ê", "i": "í", "o": "ô", "u": "ú"}


def _split(s):
    return s.split() if isinstance(s, str) else s


def _stem_ortho(stem, vowel, conj):
    """Stem ante una vocal (e o a/o): ficar → fiqu(e), chegar → chegu(e), começar → comec(e),
    conhecer → conheç(o/a), dirigir → dirij(o/a)."""
    if conj == "ar" and vowel == "e":
        if stem.endswith("c"):
            return stem[:-1] + "qu"
        if stem.endswith("g"):
            return stem + "u"
        if stem.endswith("ç"):
            return stem[:-1] + "c"
    if conj in ("er", "ir") and vowel in ("o", "a"):
        if stem.endswith("c"):
            return stem[:-1] + "ç"
        if stem.endswith("g"):
            return stem[:-1] + "j"
        if stem.endswith("gu"):
            return stem[:-2] + "g"
    return stem


def forms_of(inf):
    """{forma: set(tiempos)} para un infinitivo."""
    out = {}

    def add(tense, fs):
        for i, f in enumerate(_split(fs)):
            if i == 4 or not f:      # vós: nunca se ejercita
                continue
            out.setdefault(f, set()).add(tense)

    if inf in DERIV:
        base = DERIV[inf]
        pre = inf[: len(inf) - len(base.replace("ô", "o"))]
        sub = forms_of(base)
        for f, ts in sub.items():
            g = pre + f
            if base == "ter":
                g = {"tem": pre + "tém", "tens": pre + "téns"}.get(f, g)
            if base == "vir":
                g = {"vem": pre + "vém", "vens": pre + "véns"}.get(f, g)
            if base == "pôr" and f.startswith("pôr"):
                g = pre + f.replace("pôr", "por")
            for t in ts:
                out.setdefault(g, set()).add(t)
        return out

    real = "por" if inf == "pôr" else inf
    conj = real[-2:]
    stem = real[:-2]
    irr = IRR.get(inf, {})
    if conj not in ("ar", "er", "ir", "or"):
        return out
    if conj == "or":
        conj = "er"
    # presente
    if "pres" in irr:
        pres = _split(irr["pres"])
    else:
        s1 = stem
        if inf in E_TO_I:
            k = s1.rfind("e")
            s1 = s1[:k] + "i" + s1[k + 1:]
        if inf.endswith("ear"):
            pres = [stem + "io", stem + "ias", stem + "ia", stem + "amos", stem + "ais", stem + "iam"]
        else:
            end = {"ar": "o as a amos ais am", "er": "o es e emos eis em", "ir": "o es e imos is em"}[conj].split()
            pres = [_stem_ortho(s1, "o", conj) + end[0]] + [stem + e for e in end[1:]]
    add("presente", pres)
    # perfeito
    if "perf" in irr:
        perf = _split(irr["perf"])
    else:
        end = {"ar": "ei aste ou amos astes aram", "er": "i este eu emos estes eram",
               "ir": "i iste iu imos istes iram"}[conj].split()
        first = (_stem_ortho(stem, "e", conj) + "ei") if conj == "ar" else stem + end[0]
        perf = [first] + [stem + e for e in end[1:]]
    add("perfeito", perf)
    # imperfeito
    if "imp" in irr:
        add("imperfeito", irr["imp"])
    elif conj == "ar":
        add("imperfeito", [stem + e for e in "ava avas ava ávamos áveis avam".split()])
    else:
        add("imperfeito", [stem + e for e in "ia ias ia íamos íeis iam".split()])
    # futuro y condicional
    fs = irr.get("fut", real)
    add("futuro", [fs + e for e in "ei ás á emos eis ão".split()])
    add("condicional", [fs + e for e in "ia ias ia íamos íeis iam".split()])
    # subjuntivo presente (e imperativo de você / nós / vocês)
    if "subj" in irr:
        subj = _split(irr["subj"])
    else:
        r = pres[0][:-1] if pres[0].endswith("o") else stem
        if inf.endswith("ear"):
            r = stem + "i"
        if conj == "ar":
            r = _stem_ortho(r, "e", conj) if not inf.endswith("ear") else r
            subj = [r + e for e in "e es e emos eis em".split()]
        else:
            subj = [r + e for e in "a as a amos ais am".split()]
    add("subjPresente", subj)
    add("imperativo", [subj[2], subj[3], subj[5]])
    # tiempos del tema de perfeito (3.ª plural sin -ram)
    base = perf[5][:-3]
    acc = base[:-1] + ACC.get(base[-1], base[-1])
    if base.endswith(("ou", "uve", "ube")):
        acc = base
    if base[-1] == "e" and base.endswith(("ze", "se", "ve", "ie", "ue", "ce", "pe", "ne", "te", "de", "be", "le", "re", "me", "xe")) and \
            perf[5] != stem + "eram":
        acc = base[:-1] + "é"            # fizéssemos, tivéssemos, disséssemos
    add("subjImperfeito", [base + "sse", base + "sses", base + "sse", acc + "ssemos", acc + "sseis", base + "ssem"])
    add("subjFuturo", [base + "r", base + "res", base + "r", base + "rmos", base + "rdes", base + "rem"])
    add("maisQuePerfeito", [base + "ra", base + "ras", base + "ra", acc + "ramos", acc + "reis", base + "ram"])
    add("infPessoal", [real, real + "es", real, real + "mos", real + "des", real + "em"])
    # gerúndio
    out.setdefault(irr.get("ger", real[:-1] + "ndo") if conj != "er" or inf != "pôr" else "pondo", set()).add("gerundio")
    # quitar el infinitivo: no es un tiempo
    for f in (real, inf):
        if f in out:
            out[f] -= {"subjFuturo", "infPessoal"}
            if not out[f]:
                del out[f]
    return out


def participles(inf):
    real = "por" if inf == "pôr" else inf
    if inf in DERIV:
        base = DERIV[inf]
        pre = inf[: len(inf) - len(base.replace("ô", "o"))]
        return {pre + p for p in participles(base)}
    out = set()
    irr = IRR.get(inf, {})
    if "pp" in irr:
        out.add(irr["pp"])
    if real.endswith("ar"):
        out.add(real[:-2] + "ado")
    elif real.endswith(("er", "ir")):
        out.add(real[:-2] + "ido")
    if real.endswith(("air", "uir")):
        out.add(real[:-2] + "ído")
    res = set()
    for p in out:
        res |= {p, p[:-1] + "a", p + "s", p[:-1] + "as"}
    return res


def node_conj_forms(verbs):
    """Formas del conjugador portugués del proyecto (si ya está), por tiempo."""
    js = r"""
var C = require(%r);
var out = {};
try {
  var f = C.conjugate("falar", "presente");
  var g = C.conjugate("fazer", "perfeito");
  if (!f || f[0].replace(/^eu /, "") !== "falo" || !g || g[0].replace(/^eu /, "") !== "fiz") { console.log("{}"); process.exit(0); }
} catch (e) { console.log("{}"); process.exit(0); }
var tenses = ["presente","perfeito","imperfeito","maisQuePerfeito","futuro","condicional",
              "subjPresente","subjImperfeito","subjFuturo","infPessoal"];
var verbs = %s.concat(C.list ? C.list() : []);
verbs.forEach(function (v) {
  tenses.forEach(function (t) {
    var fs; try { fs = C.conjugate(v, t); } catch (e) { return; }
    (fs || []).forEach(function (f, i) {
      if (i === 4 || !f) return;
      f = String(f).split(" ").pop();
      if (f === v) return;
      (out[f] = out[f] || {})[t] = 1;
    });
  });
});
console.log(JSON.stringify(out));
""" % (os.path.join(ROOT, "docs/lang/pt/conjugator.js"), json.dumps(sorted(verbs)))
    try:
        res = json.loads(subprocess.check_output(["node", "-e", js], stderr=subprocess.DEVNULL, timeout=60))
    except Exception:
        return {}
    return {f: set(ts) for f, ts in res.items()}


# ---------------------------------------------------------------- vocabulario
# Vocabulario que se da por sabido en cada nivel: palabras gramaticales, las
# ~1500 más frecuentes del portugués de Brasil y el léxico de las unidades del
# temario (curriculo.SAI_FARE).  Lemas: infinitivos, masculino singular.
VOCAB = {
"A1": """
a o os as um uma uns umas de em por para com sem sob sobre entre até desde contra após perante
e ou mas nem que se porque quando como onde quem qual quais quanto quanta quantos quantas cujo
não sim já ainda também só sempre nunca muito pouco mais menos bem mal tão tanto aqui ali lá cá
hoje ontem amanhã agora depois antes logo cedo tarde então assim talvez quase até mesmo
eu tu ele ela você nós vós eles elas vocês me te se nos lhe lhes mim ti si comigo contigo conosco
meu teu seu nosso dele dela deles delas este esse aquele isto isso aquilo tudo todo nada algo
alguém ninguém algum nenhum outro mesmo próprio cada vários certo tal qualquer
do da dos das no na nos nas ao aos à às pelo pela pelos pelas num numa nuns numas dum duma
neste nesta nesse nessa naquele naquela deste desta desse dessa daquele daquela disso nisso daquilo
zero um dois duas três quatro cinco seis sete oito nove dez onze doze treze catorze quatorze quinze
dezesseis dezessete dezoito dezenove vinte trinta quarenta cinquenta sessenta setenta oitenta noventa
cem cento duzentos trezentos quatrocentos quinhentos seiscentos setecentos oitocentos novecentos mil
milhão primeiro segundo terceiro quarto quinto último meia meio
segunda-feira terça-feira quarta-feira quinta-feira sexta-feira sábado domingo semana fim-de-semana
janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro
dia noite manhã tarde hora minuto mês ano vez tempo momento data
ser estar ter haver ir vir fazer dizer dar ver poder querer saber ficar falar morar trabalhar
comer beber abrir partir estudar chamar gostar precisar pensar achar levar deixar passar
chegar sair voltar entrar começar comprar pagar custar ler escrever ouvir pedir dormir
conhecer entender aprender ensinar olhar escutar tomar pegar usar abrir fechar esperar
viver acordar levantar cozinhar jantar almoçar lavar cantar dançar tocar jogar andar correr
ajudar encontrar gostar mostrar perguntar responder conversar decidir morrer nascer
viajar visitar mudar ganhar perder vender alugar receber chover pôr trazer ligar
casa apartamento quarto sala cozinha banheiro janela porta mesa cadeira cama sofá chave
rua cidade bairro praia mar sol lua céu água rio montanha país mundo lugar centro praça
escola universidade trabalho empresa escritório loja mercado banco farmácia hospital hotel
restaurante bar café padaria cinema teatro museu igreja estação aeroporto
metrô ônibus carro táxi trem avião barco bicicleta pé
homem mulher menino menina criança pessoa gente amigo amiga família pai mãe filho filha
irmão irmã avô avó tio tia primo marido esposa namorado namorada vizinho professor aluno
senhor senhora dona seu doutor
nome sobrenome idade telefone número endereço
pão queijo leite café chá açúcar sal arroz feijão carne peixe frango ovo fruta banana
laranja limão maçã salada sopa bolo doce cerveja vinho suco água comida almoço jantar
livro caderno caneta papel foto música filme jornal carta mensagem celular computador
bom mau ruim grande pequeno novo velho bonito feio lindo alto baixo gordo magro jovem
feliz triste cansado contente simpático fácil difícil caro barato quente frio longo curto
branco preto vermelho azul verde amarelo cinza rosa marrom laranja
brasileiro argentino português espanhol inglês francês alemão italiano carioca
sim não olá oi tchau obrigado obrigada desculpa favor tudo bem
real algum alguma alguns algumas papai mamãe esquina dever parecer
coisa parte lado frente cima baixo meio fim ponto
""",
"A2": """
viagem férias passeio fim-de-semana feriado festa aniversário presente
corpo cabeça braço mão perna olho boca nariz cabelo dente coração dor febre remédio médico
roupa camisa calça sapato vestido saia bolsa chapéu
esquina ponte praça parque jardim árvore flor animal cachorro gato pássaro cavalo
dinheiro preço conta real troco cartão
sempre às-vezes nunca geralmente
escolher conseguir rir caipirinha lembrar esquecer acreditar sonhar gostar preferir sentir seguir vestir servir repetir
subir descer atravessar virar dobrar parar continuar
buscar procurar achar encontrar perder mandar enviar chegar partir
lavar limpar arrumar cozinhar misturar cortar colocar esquentar ferver
tirar fotografar nadar surfar mergulhar descansar relaxar
sentar deitar vestir levantar divertir
chuva vento neve calor frio sol nuvem tempo
cedo tarde perto longe dentro fora acima abaixo atrás através
alegre calmo tranquilo sério bravo nervoso chato legal ótimo péssimo cheio vazio
rápido lento pronto limpo sujo seguro perigoso importante possível
história histórico antigo moderno famoso
sul norte leste oeste região estado interior litoral
mesmo próprio junto sozinho
cheio metade pedaço quilo litro
""",
"B1": """
trabalho emprego salário chefe colega reunião projeto cliente empresa
saúde doença conselho relação namoro casamento
notícia jornal revista rádio televisão programa internet
lei direito governo presidente política político eleição voto povo
guerra paz exército soldado rei rainha príncipe princesa império reino corte
século época passado futuro presente
escravo escravidão liberdade livre
arte artista pintor quadro escultura estátua poema poeta escritor romance obra autor leitor
igreja santo deus
ideia opinião razão verdade problema solução exemplo motivo
tornar desenvolver mudança mudar crescer diminuir aumentar melhorar piorar
construir destruir criar fundar inaugurar
aceitar recusar permitir proibir obrigar
sucesso fracasso sorte azar
medo vergonha saudade alegria tristeza raiva
""",
"B2": """
sociedade social economia econômico cultura cultural crítica crítico
contudo porém todavia entretanto portanto aliás inclusive
embora caso conforme segundo enquanto
àquele àquela àquilo povo nação colônia colonial independência república ditadura democracia
movimento revolução regime governo oposição
""",
"C1": """
contudo todavia outrossim
""",
# Transparentes para un hispanohablante (iguales o casi iguales al español):
# se dan por conocidas desde la semana 1.
"T": """
gato calmo animal antigo planta enorme perfeito rápido história designer escuro sanduíche
desaparecer on-line disco durar incrível álbum colonial chocolate condensado plano ritual músico
programa adorar emocionado iluminar simples habitante pizza funcionar sistema wi-fi altura armado
metro triângulo melodia discutir futebol explicar prático abolicionista reparar resolver silêncio
militar método preceder década morte pintar remoto anotar aparecer diário pobre página traduzir
campanha crise dividir instituir petróleo reunir admirar cadáver causa dúvida associar criticar
idealizar indígena modo publicar racial sociólogo violência confundir cordialidade detalhe latino
privado resistir chileno moda transformar cruz desenhar palácio título participar assumir direto
eleger governar indireto votar artigo atual biblioteca crime natureza ocasião ocupar bebê capítulo
completar considerar imaginar apresentar consultar célebre disponível edição integrar narrar
dedicar descrever europeu origem processo marcar devorar tupi filosofia fingir inventar pronome
absurdo ambíguo analisar burocracia comum hierarquia ignorar tema defender depender importar
incluir organizar tensão distribuir vídeo áudio atribuir cuidar desastre maremoto redesenhar
resumir tragédia conceito formar líder documento exame receita esculpir terminar contar voz
logotipo engenheiro gravar língua assado turista surfista família foto show táxi hotel trânsito problema cultura natural
""",
}

TRANSPARENT = re.compile(
    r"(ção|ções|são|sões|dade|dades|mente|ismo|ismos|ista|istas|ável|ível|áveis|íveis|"
    r"ência|ências|ância|âncias|ário|ária|ários|árias|ório|ória|órios|órias|logia|logias|"
    r"grafia|grafias|ico|ica|icos|icas|ivo|iva|ivos|ivas|oso|osa|osos|osas|ante|antes|ente|entes|"
    r"al|ais|ura|uras|izar|izou|izado|izada|ificar|ífico|ífica|ês|esa|ano|ana|anos|anas|or|ores)$")


def lemma_candidates(w):
    """Lemas posibles de una forma nominal o adjetiva."""
    out = {w}
    rules = [("íveis", "ível"), ("áveis", "ável"), ("eses", "ês"), ("ões", "ão"), ("ães", "ão"), ("ãos", "ão"), ("ns", "m"), ("éis", "el"), ("eis", "il"),
             ("óis", "ol"), ("uis", "ul"), ("ais", "al"), ("is", "il"), ("ses", "s"), ("zes", "z"),
             ("res", "r"), ("es", ""), ("s", "")]
    for a, b in rules:
        if w.endswith(a) and len(w) > len(a) + 1:
            out.add(w[: -len(a)] + b)
    more = set()
    for x in out:
        if x.endswith("a"):
            more.add(x[:-1] + "o")
        if x.endswith("ã"):
            more.add(x[:-1] + "ão")
        if x.endswith("eia"):
            more.add(x[:-3] + "eu")
        if x.endswith("esa"):
            more.add(x[:-3] + "ês")
        if x.endswith("ora"):
            more.add(x[:-1])
        for d in ("inho", "inha", "zinho", "zinha", "íssimo", "íssima", "érrimo"):
            if x.endswith(d):
                more.add(x[: -len(d)] + "o")
                more.add(x[: -len(d)] + "a")
                more.add(x[: -len(d)])
        if x.endswith("mente"):
            more.add(x[:-5])
            if x[:-5].endswith("a"):
                more.add(x[:-6] + "o")
    return out | more


class Lexicon:
    def __init__(self):
        self.level = {}
        for lv, txt in VOCAB.items():
            for w in txt.split():
                self.level[w] = min(self.level.get(w, 99), LEVEL_WEEK[lv])
        verbs = [w for w in self.level if re.search(r"(ar|er|ir|pôr|por)$", w) and len(w) > 2 and w not in NOUNS_R]
        verbs += list(IRR) + list(DERIV)
        self.forms = {}       # forma → {tiempos}
        self.verb_of = {}     # forma → {infinitivos}
        self.pp_of = {}
        for v in set(verbs):
            for f, ts in forms_of(v).items():
                self.forms.setdefault(f, set()).update(ts)
                self.verb_of.setdefault(f, set()).add(v)
            for p in participles(v):
                self.pp_of.setdefault(p, set()).add(v)
                self.verb_of.setdefault(p, set()).add(v)
            self.verb_of.setdefault(v, set()).add(v)
            self.verb_of.setdefault("pôr" if v == "pôr" else v, set()).add(v)
        for f, ts in node_conj_forms(verbs).items():
            self.forms.setdefault(f, set()).update(ts)
        # El léxico de formas del proyecto (tools/sillabo.py → forms_lexicon.js),
        # si está: más verbos y sus lemas.
        try:
            import sillabo
            fl = sillabo.lexicon()
        except Exception:
            fl = {}
        lemmas = fl.get("lemmas", {})
        for f, ts in fl.get("simple", {}).items():
            ts = set(ts)
            if f in lemmas.get(f, []):            # el infinitivo no es un tiempo
                ts -= {"subjFuturo", "infPessoal"}
            if ts:
                self.forms.setdefault(f, set()).update(ts)
        for f in fl.get("imperatives", []):
            self.forms.setdefault(f, set()).add("imperativo")
        for f in fl.get("gerunds", []):
            self.forms.setdefault(f, set()).add("gerundio")
        for f, vs in lemmas.items():
            self.verb_of.setdefault(f, set()).update(vs)
        for f, vs in fl.get("participles", {}).items():
            self.pp_of.setdefault(f, set()).update(vs)
            self.verb_of.setdefault(f, set()).update(vs)
        # Un infinitivo (levantar, de levantar-se) no es futuro do subjuntivo.
        for f, ts in self.forms.items():
            if f in self.verb_of.get(f, ()) or (f + "-se") in self.verb_of.get(f, ()):
                ts -= {"subjFuturo", "infPessoal"}
        self.forms = {f: ts for f, ts in self.forms.items() if ts}
        # Una forma de subjuntivo presente también se lee como imperativo
        # (fale, vá, faça): cuenta desde la semana del imperativo.
        for f, ts in self.forms.items():
            if "subjPresente" in ts:
                ts.add("imperativo")
        self.lessons = self._lesson_words()

    def _lesson_words(self):
        """Palabras de la teoría por semana (tools/lessons), si ya está en portugués."""
        out = {}
        try:
            from lessons import LESSONS
        except Exception:
            return out
        for w, les in LESSONS.items():
            txt = json.dumps(les, ensure_ascii=False)
            if not re.search(r"\b(não|você|também|muito)\b", txt):
                continue      # todavía en italiano
            for ex in re.findall(r"\*([^*]+)\*", txt):
                for t in words(ex):
                    out[t] = min(out.get(t, 99), w)
            for blk in les.get("blocks", []):
                for pair in blk.get("ex", []) or []:
                    if pair:
                        for t in words(str(pair[0])):
                            out[t] = min(out.get(t, 99), w)
        return out

    def week_of(self, tok):
        """Semana desde la que se conoce la palabra (99 = desconocida)."""
        best = 99
        cands = lemma_candidates(tok)
        for f in list(cands):
            cands |= self.verb_of.get(f, set())
        for c in cands:
            best = min(best, self.level.get(c, 99), self.lessons.get(c, 99))
        if len(tok) >= 7 and TRANSPARENT.search(tok):
            best = 1
        return best


def words(text):
    return [w.lower() for w in re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿ]+(?:-[A-Za-zÀ-ÖØ-öø-ÿ]+)*", text)]


# ------------------------------------------------------------------ análisis
def grammar(text, lex):
    """{rasgo: semana} de lo que usa el texto."""
    feats = {}

    def put(k, w):
        feats[k] = max(feats.get(k, 0), w)

    toks = words(text)
    low = text.lower()
    for i, t in enumerate(toks):
        if t in FIXED:
            put("fórmula «%s»" % t, FIXED[t])
            continue
        if t in FIXED_CONNECTORS and i > 0 and toks[i - 1] in ("ou",):
            put("ou seja", 34)
            continue
        if MESO.match(t):
            put("mesóclise", CONSTR["mesóclise"])
            continue
        parts = t.split("-")
        head = parts[0]
        if len(parts) == 2 and ENCL_OBJ.match(t):
            put("pronome átono (o, a, lhe)", CONSTR["pronome átono (o, a, lhe)"])
        elif len(parts) == 2 and ENCL_REFL.match(t) and t not in FIXED:
            put("reflexivo enclítico", CONSTR["reflexivo enclítico"])
        if head in ("lhe", "lhes"):
            put("pronome átono (o, a, lhe)", CONSTR["pronome átono (o, a, lhe)"])
        if POSS.match(head) and not (head == "seu" and i + 1 < len(toks) and toks[i + 1] == "manuel") \
                and not (head == "nossa" and (i == 0 or text.find("Nossa") >= 0 and toks[i - 1] not in ("a", "da", "na"))):
            put("possessivos", CONSTR["possessivos"])
        if DEM_CONTR.match(head):
            put("demonstrativos contraídos", CONSTR["demonstrativos contraídos"])
        if head in ("à", "às"):
            put("crase", CONSTR["crase"])
        if head in ("àquele", "àquela", "àqueles", "àquelas", "àquilo"):
            put("àquele / àquela", CONSTR["àquele / àquela"])
        if head in ("cujo", "cuja", "cujos", "cujas"):
            put("relativo cujo / o qual", CONSTR["relativo cujo / o qual"])
        if head in ("qual", "quais") and i > 0 and toks[i - 1] in ("o", "a", "os", "as", "do", "da", "no", "na", "pelo", "pela"):
            put("relativo cujo / o qual", CONSTR["relativo cujo / o qual"])
        if re.search(r"(íssim[oa]s?|érrim[oa]s?)$", head):
            put("comparativo", CONSTR["comparativo"])
        # tiempos
        if head in NOT_VERBS:
            continue
        ts = lex.forms.get(head, set())
        if ts:
            wk = min(TW.get(x, 99) for x in ts)
            put("tempo: " + min(ts, key=lambda x: TW.get(x, 99)), wk)
        elif re.search(r"(ássemos|êssemos|íssemos|assem|essem|issem)$", head):
            put("tempo: subjImperfeito (por la terminación)", TW["subjImperfeito"])
        # construcciones con el verbo siguiente (salteando adverbios y pronombres)
        j = i + 1
        while j < len(toks) and toks[j] in BETWEEN and j < i + 3:
            j += 1
        nxt = toks[j] if j < len(toks) else ""
        is_pp = nxt in lex.pp_of and nxt not in ADJ_PP
        if head in TER_PRES and is_pp:
            put("perfeito composto", CONSTR["perfeito composto"])
        if head in TER and head not in TER_PRES and is_pp:
            put("mais-que-perfeito composto", CONSTR["mais-que-perfeito composto"])
        if head in TER_LATE and is_pp:
            put("tempos compostos do subjuntivo e condicional", CONSTR["tempos compostos do subjuntivo e condicional"])
        k = i + 1
        while k < len(toks) and toks[k] in ADVS and k < i + 3:
            k += 1
        nxt_adv = toks[k] if k < len(toks) else ""
        if head in SER and nxt_adv in lex.pp_of and nxt_adv not in ADJ_PP:
            put("voz passiva (ser + particípio)", CONSTR["voz passiva (ser + particípio)"])
        if head in IR_PRES and re.search(r"(ar|er|ir|pôr)$", nxt) and nxt in lex.verb_of:
            put("ir + infinitivo", CONSTR["ir + infinitivo"])
    # Lo que la forma sola no dice: «quando você chegar» (futuro do subjuntivo
    # regular = infinitivo) y «que você venha» (subjuntivo, no imperativo).
    for i, t in enumerate(toks):
        j = i + 1
        if t in ("que", "talvez", "embora", "caso") or (t == "se" and j < len(toks) and toks[j] in SUBJ_PRON) \
                or t in ("quando", "enquanto"):
            while j < len(toks) and (toks[j] in SUBJ_PRON or toks[j] in ADVS or toks[j] in ("me", "te", "se", "nos", "lhe", "o", "a")) and j < i + 4:
                j += 1
            if j >= len(toks):
                continue
            v = toks[j]
            if t in ("que", "talvez", "embora", "caso") and "subjPresente" in lex.forms.get(v, ()) \
                    and v not in NOT_VERBS and not (lex.forms.get(v, set()) & {"presente", "perfeito", "imperfeito"}):
                put("subjuntivo (que / talvez / embora + verbo)", TW["subjPresente"])
            if t in ("se", "quando", "enquanto") and v in lex.verb_of.get(v, ()) and v in lex.verb_of \
                    and re.search(r"(ar|er|ir|pôr)$", v):
                put("futuro do subjuntivo (quando / se + infinitivo)", TW["subjFuturo"])
    if re.search(r"\b(mais|menos|tão)\b(\s+\S+){1,4}?\s+(do que|que|quanto|como)\b", low) or \
            re.search(r"\b(maior|menor|melhor|pior)(es)?\s+(do\s+)?que\b", low) or \
            re.search(r"\b(o|a|os|as)\s+(mais|menos)\s+\w+\s+(d[oa]s?|de)\b", low):
        put("comparativo", CONSTR["comparativo"])
    return feats


def names_in(text):
    """Nombres propios: con mayúscula dentro de la oración, o siempre con mayúscula."""
    caps = re.findall(r"(?<![.!?:\n\"—] )(?<!^)(?<!\n)\b([A-ZÀ-Ý][A-Za-zà-ÿ]+(?:-[A-Za-zÀ-ÿ]+)*)", text)
    out = {w.lower() for w in caps}
    out |= {w.lower() for w in re.findall(r"\b([A-Z]{2,}s?)\b", text)}      # siglas: CLT, JK, XIX
    for w in set(re.findall(r"\b([A-ZÀ-Ý][A-Za-zà-ÿ]+)", text)):
        if not re.search(r"\b" + w.lower() + r"\b", text):
            out.add(w.lower())
    return out


def mc_clean(word, es):
    """Una glosa que sirve para opción múltiple (letture.js, cleanMeaning)."""
    es = str(es or "")
    if not re.match(r"^[a-záéíóúñü ]+$", es, re.I) or len(es.split(" ")) > 2:
        return False
    a = plain(word.lower())
    if len(a) < 4:
        return False

    def lev(x, y):
        d = list(range(len(y) + 1))
        for i2, cx in enumerate(x, 1):
            prev, d[0] = d[0], i2
            for j2, cy in enumerate(y, 1):
                prev, d[j2] = d[j2], min(d[j2] + 1, d[j2 - 1] + 1, prev + (cx != cy))
        return d[len(y)]
    return all(len(w) < 3 or lev(a, plain(w.lower())) / max(len(a), len(w)) > 0.4 for w in es.split(" "))


def testi():
    js = "console.log(JSON.stringify(require(%r).TESTI))" % os.path.join(ROOT, "docs/lang/pt/letture_settimana.js")
    return json.loads(subprocess.check_output(["node", "-e", js]))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    verbose = "-v" in sys.argv
    only = args[0] if args else ""
    lex = Lexicon()
    items = sorted(testi(), key=lambda e: e["week"])
    bad = 0
    seen_gloss = {}          # palabra glosada → semana
    weeks = [e["week"] for e in items]
    problems_global = []
    if sorted(weeks) != list(range(1, 53)):
        problems_global.append("faltan o sobran semanas: %s" % sorted(set(range(1, 53)) ^ set(weeks)))
    ids = [e["id"] for e in items]
    if len(set(ids)) != len(ids):
        problems_global.append("ids repetidos")
    for ep in items:
        week = ep["week"]
        probs = []
        text = ep["text"]
        # 1. gramática
        feats = grammar(text, lex)
        late = {k: v for k, v in feats.items() if v > week}
        if late:
            probs.append("gramática tardía: " + ", ".join("%s (sem. %d)" % kv for kv in sorted(late.items())))
        # 2. vocabulario
        gloss = {k.lower(): v for k, v in ep.get("gloss", {}).items()}
        toks = words(text)
        names = names_in(text)
        here = set()           # lemas de lo glosado en este mismo texto
        for g in gloss:
            here |= lemma_candidates(g) | lex.verb_of.get(g, set())
        unknown = []
        for t in toks:
            if t in gloss or t in names or t in FOREIGN:
                continue
            parts = t.split("-")
            if len(parts) > 1 and all(p in gloss or p in names or lex.week_of(p) <= week or
                                      seen_gloss.get(p, 99) < week or
                                      p in ("o", "a", "os", "as", "lo", "la", "los", "las", "no", "na",
                                            "lhe", "lhes", "me", "te", "se", "nos") for p in parts):
                continue
            if lex.week_of(t) <= week or seen_gloss.get(t, 99) < week:
                continue
            cands = lemma_candidates(t) | lex.verb_of.get(t, set())
            if any(seen_gloss.get(c, 99) < week or c in here for c in cands):
                continue
            unknown.append(t)
        unk = sorted(set(unknown))
        if len(unk) > 3:
            probs.append("%d desconocidas sin glosa: %s" % (len(unk), " ".join(unk)))
        # 3. forma
        n = len(toks)
        lo, hi = (80, 110) if week <= 26 else (110, 160)
        if not lo <= n <= hi:
            probs.append("%d palabras (tiene que tener %d-%d)" % (n, lo, hi))
        tokset = set(toks)
        for g in gloss:
            if g not in tokset:
                probs.append("glosa que no está en el texto: %s" % g)
        for t in ep["hunt"]["targets"]:
            if t not in tokset:
                probs.append("blanco de la caza que no está en el texto: %s" % t)
        if len(ep.get("questions", [])) != 3:
            probs.append("tiene que haber 3 preguntas")
        for q in ep.get("questions", []):
            if q[2] not in q[1] or len(set(q[1])) != len(q[1]):
                probs.append("pregunta mal armada: %s" % q[0])
        if len(ep.get("vf", [])) != 3 or any(v[1] not in VF for v in ep.get("vf", [])):
            probs.append("vf: tres afirmaciones con %s" % " / ".join(VF))
        clean = [g for g, v in gloss.items() if mc_clean(g, v)]
        if len(clean) < 3:
            probs.append("pocas glosas para opción múltiple (%d)" % len(clean))
        if ep.get("level") != curriculo.WEEKS[week - 1]["level"]:
            probs.append("nivel %s ≠ %s del temario" % (ep.get("level"), curriculo.WEEKS[week - 1]["level"]))
        for g in gloss:
            for c in lemma_candidates(g) | lex.verb_of.get(g, set()):
                seen_gloss.setdefault(c, week)
        if not ep["id"].startswith(only):
            continue
        bad += bool(probs)
        if probs or verbose or only:
            print("%-6s sem %2d  %3d palabras  %s" % (ep["id"], week, n, "OK" if not probs else ""))
            for p in probs:
                print("        " + p)
            if verbose or only:
                print("        gramática: " + ", ".join("%s %d" % kv for kv in sorted(feats.items(), key=lambda x: -x[1])))
                if unk:
                    print("        desconocidas: " + " ".join(unk))
    for p in problems_global:
        print(p)
    print("lecturas semanales con problemas: %d de %d" % (bad, len(items)))
    return 1 if bad or problems_global else 0


if __name__ == "__main__":
    sys.exit(main())
