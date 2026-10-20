#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""La capa de frecuencia del vocabulario portugués (Brasil).

Compila docs/data/frequenza.json con el mismo esquema que la versión
italiana:

    {"fonti": [...],
     "lemmi": {lema: [zipfEscrito, zipfOral, nivel, pos]},
     "forme": {forma: lema}}

Fuentes:

- OpenSubtitles 2018, portugués de Brasil (hermitdave/FrequencyWords,
  CC BY-SA 4.0): las 50.000 formas más frecuentes de los subtítulos, con
  su cuenta.  Es la única lista abierta de PB con cuentas que se baja sin
  registro, así que el Zipf «escrito» es el mismo que el oral (no hay una
  lista escrita abierta equivalente a itWaC; si aparece, va en la
  primera columna).
- El banco del curso (tools/bank: sustantivos, verbos, adjetivos,
  palabras): da los lemas, la clase de palabra y las formas (plurales,
  femeninos, conjugación).
- Opcional pero recomendado: el diccionario VERO de LibreOffice (pt_BR,
  LGPL 3 / MPL) leído con spylls (pip install spylls): lematiza las
  formas que el banco no cubre (falei → falar, corações → coração) y
  separa las palabras portuguesas de nombres propios y palabras de otros
  idiomas (john, okay), que quedan sin nivel.

Lematización, en este orden: excepciones a mano (FORCE); la forma es un
lema del banco (como, para, casa se quedan como están aunque sean también
formas de comer, parar, casar); formas generadas desde el banco (plurales,
femeninos, conjugación regular de los verbos del banco y tablas de los
irregulares más frecuentes); raíces de hunspell; diminutivos y
superlativos (-inho, -zinho, -íssimo).  Una forma que admite varios
lemas va al más frecuente.

Nivel MCER: no hay lista KELLY para portugués, así que el nivel es una
banda de frecuencia (rango del lema entre los lemas portugueses
reconocidos): A1 1-800, A2 801-2.000 (los 2.000 fundamentales que cuenta
la app), B1 hasta 4.000, B2 hasta 7.000, C1 hasta 10.000, C2 hasta
13.000.  Las palabras gramaticales del banco (artículos, preposiciones,
contracciones, pronombres, conjunciones) son A1 o A2 como en el banco.
Es una aproximación: documentada como tal en la app.

Uso:  python3 tools/build_frequenza.py [carpeta_con_las_listas]
Sin carpeta, las descarga a tools/.cache/frequenza/ (hace falta red).
"""
import json
import math
import os
import re
import sys
import unicodedata
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "docs", "lang", "pt", "data", "frequenza.json")
CACHE = os.path.join(ROOT, "tools", "pt", ".cache", "frequenza")
sys.path.insert(0, os.path.join(ROOT, "tools", "pt"))

SOURCES = {
    "pt_br_50k.txt": "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/pt_br/pt_br_50k.txt",
    "pt_BR.aff": "https://raw.githubusercontent.com/LibreOffice/dictionaries/master/pt_BR/pt_BR.aff",
    "pt_BR.dic": "https://raw.githubusercontent.com/LibreOffice/dictionaries/master/pt_BR/pt_BR.dic",
}

WORD = re.compile(r"^[a-záàâãéêíóôõúüç]+$")
LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]
BANDS = [(800, "A1"), (2000, "A2"), (4000, "B1"), (7000, "B2"), (10000, "C1"), (13000, "C2")]
VERBISH = re.compile(r"(ei|ou|amos|aram|ava|avam|ando|ado|ada|ados|adas|emos|eram|eu|ia|iam|endo|ido|ida|"
                     r"imos|iram|iu|indo|rei|rá|rão|ria|riam|sse|ssem)$")
# Endings that only a verb has (a lemma absent from the list is accepted
# for them only: melodia is not a form of «melodiar»).
STRONG_VERB = re.compile(r"(ou|ei|ava|avam|ávamos|aram|eram|iram|asse|assem|esse|essem|isse|"
                         r"issem|aremos|eremos|iremos|arão|erão|irão|ariam|eriam|iriam)$")
# Letters and the English and Spanish that the subtitles let through: never
# a Portuguese lemma with a level.
NOT_PT = set("b c d f g h i j k l m n p q r s t u v w x y z".split()) | {
    "us", "to", "in", "is", "the", "you", "and", "it", "of", "my", "yes", "no", "el", "los", "las",
    "unos", "hola", "gracias", "señor", "okay", "ok", "hey", "wow", "baby", "man", "go", "oh", "uh"}
WORD_POS = {"interrogativo": "pr", "preposizione": "p", "contrazione": "p", "avverbio": "r",
            "congiunzione": "c", "pronome": "pr", "tempo": "r", "quantità": "d", "numero": "num",
            "espressione": "i"}

# Forms whose lemma the rules would get wrong.
FORCE = {
    # ser / ir share the perfeito: the forms go to ser, the more frequent
    "foi": "ser", "fui": "ser", "foram": "ser", "fomos": "ser", "fora": "ser", "for": "ser",
    "forem": "ser", "fosse": "ser", "fossem": "ser", "era": "ser", "eram": "ser",
    # function words that are also forms of something else
    "para": "para", "como": "como", "sobre": "sobre", "entre": "entre", "a": "a", "o": "o",
    "e": "e", "da": "da", "do": "do", "no": "no", "na": "na", "nos": "nos", "mas": "mas",
    "mais": "mais", "vez": "vez", "se": "se", "só": "só", "cá": "cá", "lá": "lá", "até": "até",
    "casa": "casa", "casas": "casa", "caso": "caso", "canto": "canto", "cartas": "carta",
    "sede": "sede", "sério": "sério", "certo": "certo", "obrigado": "obrigado", "obrigada": "obrigado",
    "seguinte": "seguinte", "presente": "presente", "claro": "claro", "junto": "junto", "tanto": "tanto",
    "logo": "logo", "pois": "pois", "então": "então", "ainda": "ainda", "agora": "agora",
    "tá": "estar", "tô": "estar", "tava": "estar", "tavam": "estar", "tamo": "estar",
    "cê": "você", "cês": "você", "pra": "para", "pro": "pro", "né": "né", "vamo": "ir",
    "morto": "morto", "morta": "morto", "mortos": "morto", "mortas": "morto",
    "feito": "fazer", "dito": "dizer", "visto": "ver", "posto": "pôr", "aberto": "aberto",
    "vocês": "você", "senhores": "senhor", "senhoras": "senhora", "meninas": "menina",
    "desses": "desse", "dessas": "desse", "dessa": "desse", "destes": "deste", "destas": "deste",
    "desta": "deste", "daquela": "daquele", "daquelas": "daquele", "daqueles": "daquele",
    "nesses": "nesse", "nessa": "nesse", "nessas": "nesse", "nestes": "neste", "nesta": "neste",
    "nestas": "neste", "naquela": "naquele", "naqueles": "naquele", "naquelas": "naquele",
    "saia": "sair", "saiam": "sair", "deus": "deus", "antes": "antes", "depois": "depois", "atrás": "atrás", "jesus": "jesus",
    "melhor": "melhor", "pior": "pior", "maior": "maior", "menor": "menor",
    "os": "o", "as": "a", "uma": "um", "umas": "um", "uns": "um", "sua": "seu", "suas": "seu",
    "seus": "seu", "minhas": "meu", "meus": "meu", "nossos": "nosso", "nossas": "nosso",
    "tua": "teu", "tuas": "teu", "teus": "teu", "essa": "esse", "essas": "esse", "esses": "esse",
    "esta": "este", "estas": "este", "estes": "este", "aquela": "aquele", "aquelas": "aquele",
    "aqueles": "aquele", "toda": "todo", "todas": "todo", "outra": "outro", "outras": "outro",
    "outros": "outro", "alguma": "algum", "algumas": "algum", "alguns": "algum", "nenhuma": "nenhum",
    "muitos": "muito", "muitas": "muito", "muita": "muito", "poucos": "pouco", "poucas": "pouco",
    "pouca": "pouco", "quanta": "quanto", "quantos": "quanto", "quantas": "quanto", "duas": "dois",
    "tanta": "tanto", "tantos": "tanto", "tantas": "tanto", "ambas": "ambos", "várias": "vários",
    "minha": "meu", "todos": "todo",
}

# Paradigms of the most frequent irregular verbs (forms beyond what the
# regular generator would give right).  Used with or without hunspell.
IRREG = {
    "ser": "sou és é somos sois são era eras éramos éreis eram fui foste foi fomos fostes foram fora foras "
           "fôramos fôreis serei serás será seremos sereis serão seria serias seríamos seríeis seriam "
           "seja sejas sejamos sejais sejam fosse fosses fôssemos fôsseis fossem for fores formos fordes forem "
           "sermos serdes serem sendo sido",
    "estar": "estou estás está estamos estais estão estava estavas estávamos estáveis estavam estive "
             "estiveste esteve estivemos estivestes estiveram estivera estiveras estivéramos estarei estarás "
             "estará estaremos estarão estaria estaríamos estariam esteja estejas estejamos estejam "
             "estivesse estivesses estivéssemos estivessem estiver estiveres estivermos estiverem estando estado",
    "ter": "tenho tens tem temos tendes têm tinha tinhas tínhamos tínheis tinham tive tiveste teve tivemos "
           "tivestes tiveram tivera tiveras tivéramos terei terás terá teremos terão teria terias teríamos "
           "teriam tenha tenhas tenhamos tenham tivesse tivesses tivéssemos tivessem tiver tiveres tivermos "
           "tiverem termos terem tendo tido",
    "haver": "hei hás há havemos hão havia haviam houve houvera haverá haveria haja hajam houvesse "
             "houver havendo havido",
    "ir": "vou vais vai vamos ides vão ia ias íamos iam irei irás irá iremos irão iria irias iríamos iriam "
          "vá vás vamos vão fôssemos indo ido irmos irem",
    "vir": "venho vens vem vimos vindes vêm vinha vinhas vínhamos vinham vim vieste veio viemos vieram "
           "viera viréis virei virá viremos virão viria viríamos viriam venha venhas venhamos venham viesse "
           "viesses viéssemos viessem vier vieres viermos vierem vindo",
    "fazer": "faço fazes faz fazemos fazem fazia fazias fazíamos faziam fiz fizeste fez fizemos fizeram "
             "fizera farei farás fará faremos farão faria farias faríamos fariam faça faças façamos façam "
             "fizesse fizesses fizéssemos fizessem fizer fizeres fizermos fizerem fazendo feito feita feitos feitas",
    "dizer": "digo dizes diz dizemos dizem dizia dizias dizíamos diziam disse disseste dissemos disseram "
             "dissera direi dirás dirá diremos dirão diria dirias diríamos diriam diga digas digamos digam "
             "dissesse dissessem disser disseres dissermos disserem dizendo dito dita ditos ditas",
    "trazer": "trago trazes traz trazemos trazem trazia traziam trouxe trouxeste trouxemos trouxeram trarei "
              "trará traremos trarão traria traga tragas tragamos tragam trouxesse trouxer trazendo trazido",
    "dar": "dou dás dá damos dão dava davam dei deste deu demos deram dera darei dará daria dê dês demos "
           "deem desse dessem der deres dermos derem dando dado",
    "poder": "posso podes pode podemos podem podia podias podíamos podiam pude pudeste pôde pudemos puderam "
             "pudera poderei poderá poderemos poderão poderia poderíamos poderiam possa possas possamos "
             "possam pudesse pudesses pudéssemos pudessem puder puderes pudermos puderem podendo podido",
    "querer": "quero queres quer queremos querem queria querias queríamos queriam quis quiseste quisemos "
              "quiseram quisera quererei quererá quereria queira queiras queiramos queiram quisesse "
              "quisesses quiséssemos quisessem quiser quiseres quisermos quiserem querendo querido",
    "saber": "sei sabes sabe sabemos sabem sabia sabias sabíamos sabiam soube soubeste soubemos souberam "
             "saberei saberá saberia saiba saibas saibamos saibam soubesse soubessem souber souberem sabendo sabido",
    "ver": "vejo vês vê vemos vedes veem via vias víamos viam vi viste viu vimos vistes viram vira verei "
           "verás verá veremos verão veria veríamos veriam veja vejas vejamos vejam visse visses víssemos "
           "vissem vir vires virmos virem vendo visto vista vistos vistas",
    "ler": "leio lês lê lemos leem lia lias líamos liam li leste leu lemos leram lerei lerá leria leia "
           "leias leiamos leiam lesse lessem ler lendo lido",
    "pôr": "ponho pões põe pomos pondes põem punha punhas púnhamos punham pus puseste pôs pusemos puseram "
           "porei porá poremos porão poria ponha ponhas ponhamos ponham pusesse pusessem puser puserem "
           "pondo posto",
    "sair": "saio sais sai saímos saem saía saías saíamos saíam saí saíste saiu saíram sairei sairá "
            "sairia saia saias saiamos saiam saísse saíssem sair sairmos saírem saindo saído",
    "cair": "caio cais cai caímos caem caía caíam caí caiu caíram cairei cairá caia caiam caísse cair caindo caído",
    "pedir": "peço pedes pede pedimos pedem pedia pedi pediu pedimos pediram pedirei pedirá peça peças "
             "peçamos peçam pedisse pedir pedindo pedido",
    "ouvir": "ouço oiço ouves ouve ouvimos ouvem ouvia ouvi ouviu ouviram ouvirei ouça ouças ouçamos "
             "ouçam ouvisse ouvir ouvindo ouvido",
    "perder": "perco perdes perde perdemos perdem perdia perdi perdeu perderam perderei perca percas "
              "percamos percam perdesse perder perdendo perdido",
    "dormir": "durmo dormes dorme dormimos dormem dormia dormi dormiu dormiram durma durmas durmamos "
              "durmam dormisse dormir dormindo dormido",
    "sentir": "sinto sentes sente sentimos sentem sentia senti sentiu sentiram sinta sintas sintamos "
              "sintam sentisse sentir sentindo sentido",
    "seguir": "sigo segues segue seguimos seguem seguia segui seguiu seguiram siga sigas sigamos sigam "
              "seguisse seguir seguindo seguido",
    "conseguir": "consigo consegues consegue conseguimos conseguem conseguia consegui conseguiu "
                 "conseguiram consiga consigas consigamos consigam conseguisse conseguir conseguindo conseguido",
    "subir": "subo sobes sobe subimos sobem subia subi subiu subiram suba subisse subir subindo subido",
    "preferir": "prefiro preferes prefere preferimos preferem preferia preferi preferiu prefira prefiram preferindo preferido",
    "vestir": "visto vestes veste vestimos vestem vestia vesti vestiu vista vistam vestindo vestido",
    "rir": "rio ris ri rimos riem ria riam ri riu riram ria rias riamos riam risse rindo rido",
    "crer": "creio crês crê cremos creem cria criam cri creu creram creia creiam cresse crendo crido",
    "valer": "valho vales vale valemos valem valia vali valeu valha valham valesse valendo valido",
    "caber": "caibo cabes cabe cabemos cabem cabia coube coubera caiba caibam coubesse couber cabendo cabido",
    "abrir": "aberto aberta abertos abertas",
    "escrever": "escrito escrita escritos escritas",
    "cobrir": "cubro cobres cobre cobrimos cobrem cubra coberto coberta",
    "descobrir": "descubro descobre descobrem descubra descoberto descoberta descobertos",
    "ganhar": "ganho", "pagar": "pago", "gastar": "gasto",
    "construir": "construo constróis constrói construímos constroem construiu construído",
    "destruir": "destruo destróis destrói destruímos destroem destruiu destruído",
    "doer": "dói doem doía doeu doendo doído",
    "passear": "passeio passeias passeia passeiam passeie passeando passeado",
    "odiar": "odeio odeias odeia odeiam odeie odeiem",
    "fugir": "fujo foges foge fugimos fogem fuja fujam",
}

TENSE_ENDS = {
    "ar": "o as a amos am ei aste ou aram ava avas ávamos avam ara aras áramos "
          "arei arás ará aremos arão aria arias aríamos ariam e es emos em "
          "asse asses ássemos assem ar ares armos arem ando ado ada ados adas",
    "er": "o es e emos em i este eu eram ia ias íamos iam era eras êramos "
          "erei erás erá eremos erão eria erias eríamos eriam a as amos am "
          "esse esses êssemos essem er eres ermos erem endo ido ida idos idas",
    "ir": "o es e imos em i iste iu iram ia ias íamos iam ira iras íramos "
          "irei irás irá iremos irão iria irias iríamos iriam a as amos am "
          "isse isses íssemos issem ir ires irmos irem indo ido ida idos idas",
}


def regular_forms(inf):
    """Forms of a regular verb, with the spelling changes (fiquei, conheço)."""
    m = re.match(r"^(.*?)(ar|er|ir)$", inf)
    if not m:
        return set()
    stem, cl = m.groups()
    out = set()
    for e in TENSE_ENDS[cl].split():
        s = stem
        if e[0] in "eéê" and cl == "ar":
            s = re.sub(r"c$", "qu", s)
            s = re.sub(r"g$", "gu", s)
            s = re.sub(r"ç$", "c", s)
        if e[0] in "aoá" and cl in ("er", "ir"):
            if re.search(r"gu$", s) and cl == "ir" or re.search(r"gu$", s) and inf.endswith("guer"):
                s = s[:-1]
            elif s.endswith("c"):
                s = s[:-1] + "ç"
            elif s.endswith("g"):
                s = s[:-1] + "j"
        out.add(s + e)
    return out


def plain(s):
    return unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode()


def fetch(folder):
    os.makedirs(folder, exist_ok=True)
    for name, url in SOURCES.items():
        path = os.path.join(folder, name)
        if os.path.exists(path):
            continue
        print("descargando", name)
        try:
            urllib.request.urlretrieve(url, path)
        except Exception as exc:                      # the dictionary is optional
            if name.endswith("50k.txt"):
                raise
            print("  (sin %s: %s)" % (name, exc))


def hunspell(folder):
    try:
        from spylls.hunspell import Dictionary
    except ImportError:
        print("  (sin spylls: se lematiza solo con el banco; pip install spylls)")
        return None
    base = os.path.join(folder, "pt_BR")
    if not (os.path.exists(base + ".aff") and os.path.exists(base + ".dic")):
        return None
    return Dictionary.from_files(base)


def load_bank():
    from bank import parole_nomi, parole_verbi_agg
    lemmas = {}               # lemma -> (pos, bank level)
    forms = {}                # form -> set(lemmas)

    def add(form, lemma):
        if form and WORD.match(form):
            forms.setdefault(form, set()).add(lemma)

    for n in parole_nomi.NOUNS:
        if " " in n[0] or "-" in n[0]:
            continue
        lemmas.setdefault(n[0], ("n", n[5]))
        add(n[2], n[0])
    for a in parole_verbi_agg.ADJECTIVES:
        if " " in a[0]:
            continue
        lemmas[a[0]] = ("a", a[5])
        for f in a[1:4]:
            add(f, a[0])
    irregular = {}
    for v in parole_verbi_agg.VERBS:
        lemmas[v[0]] = ("v", v[5])
        irregular[v[0]] = v[4]
        if not v[4]:
            for f in regular_forms(v[0]):
                add(f, v[0])
        else:
            # the forms built on the infinitive are safe for most irregulars
            if v[0] not in ("ser", "ir", "vir", "ter", "pôr", "ver", "ler", "dar", "rir", "crer", "haver",
                            "fazer", "dizer", "trazer"):
                for f in regular_forms(v[0]):
                    if re.search(r"(rei|rás|rá|remos|reis|rão|ria|rias|ríamos|ríeis|riam|rmos|rdes|rem|ndo)$", f):
                        add(f, v[0])
    for v, fs in IRREG.items():
        for f in fs.split():
            add(f, v)
        lemmas.setdefault(v, ("v", "A1"))
    for w in parole_verbi_agg.WORDS:
        k = w[0].lower().rstrip("!?")
        if " " in k or not WORD.match(k):
            continue
        # a function word of the bank is a lemma of its own (como, para)
        lemmas.setdefault(k, (WORD_POS.get(w[2], ""), w[3]))
    return lemmas, forms


def guess_pos(lemma, is_verb_stem):
    if is_verb_stem and re.search(r"(ar|er|ir|or)$", lemma):
        return "v"
    if lemma.endswith("mente"):
        return "r"
    if re.search(r"(ção|são|dade|agem|ismo|mento|eza|ura|ância|ência|eiro|eira|ista)$", lemma):
        return "n"
    if re.search(r"(oso|osa|vel|ico|ica|ivo|iva|ante|ente)$", lemma):
        return "a"
    return ""


def main():
    folder = sys.argv[1] if len(sys.argv) > 1 else CACHE
    fetch(folder)
    dic = hunspell(folder)

    counts = {}
    total = 0
    with open(os.path.join(folder, "pt_br_50k.txt"), encoding="utf-8") as fh:
        for line in fh:
            parts = line.split()
            if len(parts) != 2:
                continue
            n = int(parts[1])
            total += n
            w = parts[0].lower()
            if WORD.match(w):
                counts[w] = counts.get(w, 0) + n

    bank, bank_forms = load_bank()
    from bank import glossario
    names = {k for k, v in glossario.GLOSS.items() if v[1] == "N"}

    def portuguese(w):
        if w in bank or w in bank_forms or w in FORCE:
            return True
        if w in names or w in NOT_PT:
            return False
        return bool(dic and dic.lookup(w))

    def stems(w):
        if not dic:
            return set()
        out = set()
        try:
            for f in dic.lookuper.good_forms(w, capitalization=False):
                st = getattr(f, "root", None) or getattr(f, "stem", None)
                st = getattr(st, "stem", st)
                if isinstance(st, str) and WORD.match(st.lower()):
                    out.add(st.lower())
        except Exception:
            pass
        return out

    def freq(lemma):
        return counts.get(lemma, 0)

    verb_stems = set()
    form_to_lemma = {}

    def singular(w):
        """Candidate singulars of a plural-looking form, most specific first."""
        out = []
        for suf, rep in (("ões", "ão"), ("ães", "ão"), ("ãos", "ão"), ("ns", "m"), ("éis", "el"),
                         ("óis", "ol"), ("ais", "al"), ("uis", "ul"), ("res", "r"), ("zes", "z"),
                         ("ses", "s"), ("s", "")):
            if w.endswith(suf) and len(w) > len(suf) + 1:
                out.append(w[: -len(suf)] + rep)
        return [c for c in out if c in counts]

    def resolve(w, depth=0):
        if w in form_to_lemma:
            return form_to_lemma[w]
        if w in FORCE:
            lemma = FORCE[w]
        elif w in bank:
            lemma = w
        elif w in bank_forms:
            # a noun or adjective reading first (casas → casa, comidas → comida)
            ls = bank_forms[w]
            nominal = [l for l in ls if bank.get(l, ("",))[0] in ("n", "a")]
            lemma = max(nominal or ls, key=lambda l: (freq(l), l))
        elif w.endswith("mente") and len(w) > 7:
            lemma = w                       # adverbs in -mente are lemmas of their own
        else:
            lemma = w
            # hunspell also strips prefixes (revelou → velar, desmaiou → maiar):
            # a lemma must start like its form
            cand = {c for c in stems(w) if c != w and plain(c[:2]) == plain(w[:2]) and (
                c in counts or c in bank or (re.search(r"(ar|er|ir)$", c) and STRONG_VERB.search(w)))}
            # a feminine noun is not a form of a masculine one (linha ≠ linho)
            cand = {c for c in cand if not (w.endswith("a") and c == w[:-1] + "o" and freq(w) >= freq(c))}
            if cand:
                best = max(cand, key=lambda l: (freq(l), l))
                verbish = re.search(r"(ar|er|ir)$", best) and w != best
                base = w
                if verbish and w.endswith("s") and singular(w) and not re.search(r"(amos|emos|imos|mos)$", w):
                    base = singular(w)[0]           # drogas → droga
                # BR hardly uses the tu forms in -s: a form whose plural is
                # frequent is a noun or an adjective (arma / armas, fundo /
                # fundos), not the verb hunspell files it under
                nouny = verbish and not VERBISH.search(base) and counts.get(base + "s", 0) * 10 >= counts.get(base, 1)
                if (re.search(r"(ado|ada|ido|ida)$", w) and w in stems(w) and freq(w) > freq(best)):
                    pass            # a noun of its own, more frequent (sentido / sentir, pedido)
                elif nouny or (verbish and re.search(r"(ad|id)(o|a|os|as)$", w) and freq(best) * 20 < freq(w)) or (
                        verbish and not VERBISH.search(w) and (
                        not freq(best) or freq(best) * (20 if w.endswith("s") else 100) < freq(w))):
                    if base != w and depth < 2:
                        lemma = resolve(base, depth + 1)
                else:
                    # the root may itself be a form (novos → novo)
                    lemma = resolve(best, depth + 1) if depth < 3 and best in counts else best
                    if verbish and VERBISH.search(w):
                        verb_stems.add(best)
            elif singular(w) and depth < 2:
                lemma = resolve(singular(w)[0], depth + 1)
            if lemma == w:
                # diminutives and superlatives: cafezinho → café, lindíssimo → lindo
                for suf, reps in (("zinho", ("",)), ("zinha", ("",)), ("inho", ("o", "")), ("inha", ("a", "")),
                                  ("íssimo", ("o", "e")), ("íssima", ("a", "e"))):
                    if w.endswith(suf) and len(w) > len(suf) + 2:
                        for r in reps:
                            c = w[: -len(suf)] + r
                            if c in bank or (c in counts and freq(c) > freq(w)):
                                lemma = resolve(c, depth + 1) if depth < 2 else c
                                break
                        break
        if depth == 0 or w not in form_to_lemma:
            form_to_lemma[w] = lemma
        return lemma

    for w in sorted(counts, key=lambda x: -counts[x]):
        resolve(w)

    oral = {}
    for w, n in counts.items():
        l = form_to_lemma[w]
        oral[l] = oral.get(l, 0) + n

    def zipf(n):
        return round(math.log10(n / total * 1e6) + 3, 2)

    # CEFR band by rank among the Portuguese lemmas
    ranked = sorted((l for l in oral if portuguese(l) and len(l) > 0), key=lambda l: -oral[l])
    level = {}
    for i, l in enumerate(ranked):
        for top, lvl in BANDS:
            if i < top:
                level[l] = lvl
                break
    # the function words of the bank keep the bank's level (a, o, de, no, pelo)
    for l, (pos, lvl) in bank.items():
        if pos in ("p", "pr", "c", "d", "num") and l in oral and lvl in ("A1", "A2"):
            if not level.get(l) or LEVELS.index(level[l]) > LEVELS.index(lvl):
                level[l] = lvl

    out_lemmas = {}
    for l, n in oral.items():
        z = zipf(n)
        lvl = level.get(l, "")
        if not (lvl or z >= 3.3):
            continue
        pos = bank[l][0] if l in bank else guess_pos(l, l in verb_stems)
        out_lemmas[l] = [z, z, lvl, pos]
    # bank lemmas the subtitles never have (rare words of the course): known,
    # with the bank's level, no frequency
    out_forms = {}
    for w, l in form_to_lemma.items():
        if w != l and l in out_lemmas and zipf(counts[w]) >= 2.9:
            out_forms[w] = l

    data = {"fonti": ["OpenSubtitles 2018 pt_br (hermitdave/FrequencyWords, CC BY-SA 4.0)",
                      "VERO pt_BR (LibreOffice dictionaries, LGPL 3 / MPL), para lematizar",
                      "Banco de Rumo C1 (tools/bank), lemas y formas"],
            "nota": "Zipf escrito = oral (una sola fuente abierta). Nivel = banda de frecuencia "
                    "(A1 800, A2 2000, B1 4000, B2 7000, C1 10000, C2 13000 lemas): no hay KELLY para portugués.",
            "lemmi": out_lemmas, "forme": out_forms}
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, separators=(",", ":"))
    by_level = {}
    for rec in out_lemmas.values():
        if rec[2]:
            by_level[rec[2]] = by_level.get(rec[2], 0) + 1
    print("lemas: %d · formas: %d · con nivel: %s · %d KB" % (
        len(out_lemmas), len(out_forms), dict(sorted(by_level.items())), os.path.getsize(OUT) // 1024))


if __name__ == "__main__":
    main()
