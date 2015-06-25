/**
 * 
 * Changelog
 * @type Array
 */
window.vantagensChangelog = [
	{
        "version" : [4, 1],
        "description" : [
            "Vantagem 'Trabalho Duro' renomeada para 'Trabalhador Esforçado' para resolver conflito com a vantagem 'Trabalho Duro' de Alquimista.",
        ]
    },
	{
        "version" : [4, 0],
        "description" : [
            "Todas as alterações da versão 4.0 estão presentes.",
			"Novas vantagens: Analista, Caminhando nas Sombras, Curandeiro, Engenheiro de Masmorras, Existência Kármica, Segunda Raça - Elemental e Terreno Favorito.",
			"Novas desvantagens: Sotaque, Quirk e Pequena Maldição."
        ]
    },
    {
        "version" : [3, 2],
        "description" : [
            "Androgenia, Narcisista e Androgenia adicionadas."
        ]
    },
    {
        "version" : [3, 1],
        "description" : [
            "Convocação Extraplanar tem o nome certo."
        ]
    },
    {
        "version" : [3, 0],
        "description" : [
            "Website criado.",
            "Vantagens Raciais adicionadas. Elas irão imprimir \"Requisitos\" para informar o que elas exigem.",
            "Vantagens de Arquétipos adicionadas. Elas irão imprimir \"Requisitos\" para informar o que elas exigem.",
            "O palavreado de pontos de algumas Vantagens e Desvantagens inclui muitos 'ou'. Isso é intencional e permite que buscas por quantidade de pontos sejam possíveis."
        ]
    }
].sort(function (a, b) {
    if (a.version[0] > b.version[0]) return -1;
    if (a.version[0] < b.version[0]) return 1;
    if (a.version[1] > b.version[1]) return -1;
    if (a.version[1] < b.version[1]) return 1;
    return 0;
});


window.arquetipos = [
     "",
     "Alquimista",
     "Arauto da Profecia",
     "Artilheiro",
     "Assassino",
     "Bárbaro",
     "Bardo",
     "Caçador",
     "Cavaleiro Negro",
     "Clérigo",
     "Defensor",
     "Druida",
     "Elementalista",
     "Engenheiro",
     "Esgrimista",
     "Estrategista",
     "Ferreiro",
     "Gladiador",
     "Guerreiro",
     "Hematologista",
     "Homem de Lata",
     "Ilusionista",
     "Inquisidor",
     "Invocador Astral",
     "Juggernaut",
     "Ladrão",
     "Mago",
     "Mago Branco",
     "Mercante Príncipe",
     "Mestre das Runas",
     "Monge",
     "Mímico",
     "Necromante",
     "Ninja",
     "Paladino",
     "Pirata",
     "Sabotador",
     "Samurai",
     "Senhor das Bestas"
].sort(function (a,b) {
	var nA = a.toUpperCase();
	var nB = b.toUpperCase();
	if (nA < nB) return -1;
	if (nA > nB) return 1;
	return 0;
});

window.racas = [
	"Anão",
	"Bestial",
	"Changeling",
	"Draconiano",
	"Droid",
	"Elfo",
	"El'zel",
	"Fayri",
	"Golem",
	"Humano",
	"Jorn",
	"Kalkan",
	"Ogrekin",
	"Orc",
	"Quellsir",
	"Yu'qun",
	"Zahari"
];

var racasLength = window.racas.length;
for (var i = 0; i < racasLength; i++) {
	for (var k = 0; k < racasLength; k++) {
		if (k === i) continue;
		window.racas.push(window.racas[i] + "/" + window.racas[k]);
	}
}

window.racas.sort(function (a,b) {
	var nA = a.toUpperCase();
	var nB = b.toUpperCase();
	if (nA < nB) return -1;
	if (nA > nB) return 1;
	return 0;
});


/**
 * Tipos
 * @type Array
 */
window.tiposVant = [
    {
        id : "vantagens",
        nome : "Vantagens",
        descricao : [
            "Um personagem pode ter quantas vantagens puder pagar. Algumas raças concedem pontos de vantagens. Desvantagens concedem pontos para se comprar mais vantagens."
        ]
    },
    {
        id : 'desvantagens',
        nome : 'Desvantagens',
        descricao : [
            'Um personagem pode ter quantas desvantagens quiser, mas apenas as 4 maiores irão conceder pontos. Um personagem não pode ganhar mais do que 10 pontos de vantagens por desvantagens.'
        ]
    }
];

/**
 * Vantagens!
 * @type Array
 */
window.vantagensArray = [
    /* Vantagens Raciais */
    {
        "nome": "Visão Treinada",
        "pontos": "0",
        "descricao": [
			"Os anões viveram muitos anos dentro de montanhas, túneis, cavernas e complexos subterrâneos como um todo, e por isso adquiriram uma facilidade maior de ver coisas no escuro ou com uma iluminação muito baixa. O anão então pode enxergar no escuro numa distância de até 50 metros e com pouca iluminação, como se estivesse em um ambiente bem iluminado, sem penalidades. Você não é capaz de ver cores na escuridão, apenas tonalidades diferentes de cinzas."
        ],
        "requisitos": "Raça Anão"
    },
    {
        "nome": "Força dos Anciões",
        "pontos": "1",
        "descricao": [
            "Devido a sua constituição e força natural, os anões são capazes de carregar diversos equipamentos, itens e objetos em geral sem ter muitos problemas com espaços ou facilidade de carregar. Anões usam (FOR+2) x4 para calcular a carga do que podem carregar."
        ],
        "requisitos": "Raça Anão"
    },
    {
        "nome": "Mapa dos Anões",
        "pontos": "1",
        "descricao": [
            "Andar em complexos subterrâneos, perímetros de montanhas e cidades anãs não é uma tarefa fácil! Justamente por isso, os anões desenvolveram um senso de direção incrível que se ampliou pra todo e qualquer lugar que visitam, impossibilitando que eles se percam ou falhem a encontrar o caminho mais adequado para suas necessidades. Em termos gerais um anão não costuma se perder e ganha sucesso automático em testes para encontrar o caminho ou direção  em ambientes subterrâneos ou montanhosos com uma dificuldade de até 10, recebendo um bônus de +2 em dificuldades maiores."
        ],
        "requisitos": "Raça Anão"
    },
    {
        "nome": "Ganância",
        "pontos": "1",
        "descricao": [
            "Anões são conhecidos por suas riquezas e as mais variadas peças de ouro, prata, platina e gemas preciosas que guardam em seus largos cofres de uma cidade (ou mesmo de suas casas). Mas isso não acontece magicamente: anões costumam dar o melhor em um trabalho ou tarefa artesanal, e por isso são renomados mundialmente como exímios ferreiros e artesãos em geral. Um personagem anão sempre ganha +25% a mais de moedas de ouro quando trabalhando com emprego."
        ],
        "requisitos": "Raça Anão"
    },
    {
        "nome": "Armas Naturais",
        "pontos": "0",
        "descricao": [
            "O corpo dos membros da sua espécie carregam várias armas naturais que podem servir, e muito bem, em combate. Escolha qualquer número de equipamentos que tenha comprado na loja durante a criação da ficha ou criado através de outras Vantagens e refaça elas como partes do seu corpo. Tanto o ponto negativo quanto o ponto positivo disso é que você só pode ser completamente desarmado quando desmembrado."
        ],
        "requisitos": "Raça Bestial"
    },
    {
        "nome": "Sentidos Aguçados",
        "pontos": "1",
        "descricao": [
            "Sua espécie é ainda mais especializada quando lidando com sentidos. Você recebe +2 em rolagens de atributos-teste ou perícias relacionadas a tentar ouvir, sentir cheiro ou enxergar."
        ],
        "requisitos": "Raça Bestial"
    },
    {
        "nome": "Habilidades Naturais",
        "pontos": "1",
        "descricao": [
            "Membros da sua espécie possuem habilidades especiais impressionantes. Ganhe uma Técnica Especial de um Slot com o addon “Habilidade Especial”. As habilidades especiais criadas através do addon “Habilidade Especial” devem levar em consideração as habilidades que seu personagem tem naturalmente, através de seu corpo. Essa vantagem não permite que a limitação de se ter apenas uma técnica com “Habilidade Especial” e a técnica recebida por essa vantagem pode receber Upgrades no futuro, para os quais  a restrição de habilidades corporais não existe."
        ],
        "requisitos": "Raça Bestial"
    },
    {
        "nome": "Olhos da Selva",
        "pontos": "1",
        "descricao": [
            "Seus olhos são adaptados a uma vida noturna. Você enxerga durante situações de baixa iluminação sem lidar com penalidades, apenas podendo ser afetado pela ausência absoluta de luz. Você não é afetado por mudanças rápidas de claridade e enxerga até 50 metros na escuridão ou com baixa iluminação."
        ],
        "requisitos": "Raça Bestial"
    },
    {
        "nome": "Herança dos Dragões",
        "pontos": "2",
        "descricao": [
            "Uma herança anciã corre nas suas veias e faz com que sua resistência seja levemente superior aos de outras criaturas. Ganhe +2 de HP máximo com isso. Essa vantagem não se acumula com \"Duro de matar\"."
        ],
        "requisitos": "Raça Draconiano"
    },
    {
        "nome": "Fome Draconiana",
        "pontos": "0",
        "descricao": [
            "Você está acostumado a comer coisas diversas e de várias origens devido a herança de seus ancestrais dragões, e por isso, criou uma forte resistência contra venenos, intoxicação, comida estragada ou outros efeitos adversos que alimentos teriam se ingeridos via oral (Isso não te torna imune à venenos, apenas à venenos que ingerir diretamente)."
        ],
        "requisitos": "Raça Draconiano"
    },
    {
        "nome": "Sexto Sentido",
        "pontos": "1",
        "descricao": [
            "Outra herança genética oriunda dos antigos dragões quando os mesmos lutavam incansavelmente contra os caçadores: estar sempre preparado para um confronto. Com isso, o personagem ganha um bônus de +2 em rolagens de iniciativa."
        ],
        "requisitos": "Raça Draconiano"
    },
    {
        "nome": "Auto-suficiente",
        "pontos": "1",
        "descricao": [
            "Alguma coisa te aconteceu e você foi abençoado com uma quantidade gigantesca de glamour. Esse glamour vai durar enquanto você estiver vivo e você não precisará procurar mais glamour para se manter vivo. Você ainda pode saborear glamour que encontrar."
        ],
        "requisitos": "Raça Changeling"
    },
    {
        "nome": "Destruir Sonho",
        "pontos": "1",
        "descricao": [
            "Um golpe fatal finalizador, que só pode ser usado em alguém que você acabou de derrotar e não pode mais se defender. O Changeling enche o alvo com todo o próprio Glamour, explodindo ele e forçando todo o Glamour que ele possuía para fora. O changeling se alimenta desse glamour e o alvo continua vivo, mas o alvo nunca mais será capaz de sonhar. Passará o resto da sua vida com depressão e apatia. Você se sente atraído por essa destruição e não consegue evitá-la."
        ],
        "requisitos": "Raça Changeling"
    },
    {
        "nome": "Memórias de Arcadia",
        "pontos": "1",
        "descricao": [
            "Você é capaz de resgatar mais memórias das suas vidas passadas do que a maioria dos Changelings. Suas lembranças de Arcadia, um lugar de beleza indescritível, te dão motivação para enfrentar os desafios do presente: um dia você vai pisar em Arcadia de novo! Até duas vezes por sessão ou dia, o que demorar mais para acontecer, você pode rolar novamente um teste de perícia ou atributo-teste. Você deve utilizar o segundo resultado, mesmo que seja menor, também não podendo usar a segunda re-rolagem no mesmo teste.",
            "O personagem com essa vantagem também ganha acesso à linguagem “Arkadium”."
        ],
        "requisitos": "Raça Changeling"
    },
    {
        "nome": "Fragilidade contra Banalidade",
        "pontos": "5",
        "descricao": [
            "Você é ainda mais frágil que outros changelings. Uma mera expressão de descrença pode acabar te jogando no chão e pessoas especialmente banais irão até te ferir, só por estarem próximas."
        ],
        "requisitos": "Raça Changeling"
    },
    {
        "nome": "Auto-suficiência Biológica",
        "pontos": "1",
        "descricao": [
            "O personagem tem instalações em seu corpo de Droid que o permite ser auto-suficiente em questões mudanças que outros seres vivos são dependentes. Isto é, o Droid não precisa comer, beber, dormir ou respirar, ficando imune à penalidades de fadiga por sono ou por falta de alimento. Isso não deixa o Droid imune à recarregar suas baterias, calibrar circuitos, injetar óleo em suas articulações ou quaisquer aspectos mais narrativos que ele esteja sujeito ou queira ter presente em seu corpo (especificar na história)."
        ],
        "requisitos": "Raça Droid"
    },
    {
        "nome": "Gadget",
        "pontos": "2",
        "descricao": [
            "Muitos Droids possuem inúmeros compartimentos e mecanismos que permitem que eles carreguem pequenas possessões ou aparatos de utilidade geral para situações diversas. Assim, até uma vez por sessão ou dia (o que acontecer primeiro) o personagem pode criar uma pequena máquina / aparato / invenção que tenha um único propósito de existência, e quando completado deixa de existir logo depois.",
            "Exemplos: Uma corda especial de aço que sai do peito do droid e é disparada até 20 metros pro alto com um gancho e permitindo que ele seja puxado até o local desejado, ou então um pequeno robô em formato de morcego que tira  fotos com flash e voe por locais diversos ao comando do droid."
        ],
        "requisitos": "Raça Droid"
    },
    {
        "nome": "Mente Cibernética",
        "pontos": "1",
        "descricao": [
            "Por serem compostos por diversos fios, células virtuais e outros aparelhos com alta diversidade tecnológica, os Droids acabam ficando pouco afetados por encantamentos ou feitiços de ação mental, uma vez que a mente deles funciona diferente de um ser vivo. Justamente por isso, o personagem ganha um bônus de +3 em rolagens quaisquer que envolvam evitar ou resistir à domínio mental ou ataques mentais em geral."
        ],
        "requisitos": "Raça Droid"
    },
    {
        "nome": "Beleza Élfica",
        "pontos": "0",
        "descricao": [
            "Elfos são criaturas belas por natureza, seja do sexo masculino ou feminino e isso é reconhecido por muitas pessoas, mundialmente. Embora o conceito de \"beleza\" seja algo subjetivo, os traços finos, suaves e refinados dos elfos são bem distintos e únicos, gerando fãs e admiradores de sua beleza por todas as partes. Um personagem elfo com essa vantagem pode adicionar um bônus de +2 em testes de Carisma onde sua aparência seja relevante (em testes de Sedução ou outros que forem relevantes e o Mestre permitir)."
        ],
        "requisitos": "Raça Elfo"
    },
    {
        "nome": "Diplomata",
        "pontos": "2",
        "descricao": [
            "Nem todos os elfos são iguais em termos de personalidade, mas essa raça compreende a razão e suas implicações acima das emoções de uma forma mais clara e precisa do que outras raças. Por isso, são capazes de formular e fazer a escolha certa de palavras e estratégias sociais em situações que necessitem isso. Personagens que escolherem essa vantagem podem aumentar seu Carisma em +1 ponto, podendo ultrapassar o limite de 5 pontos mas não acumulando com outras vantagens que aumentem esse atributo."
        ],
        "requisitos": "Raça Elfo"
    },
    {
        "nome": "Sono dos Imortais",
        "pontos": "0",
        "descricao": [
            "Diferentemente de outros seres vivos, um elfo não precisa ter 8 horas de sono para reorganizar sua mente e ter mais disposição física. Ao contrário disso, um elfo pode meditar por apenas 6 horas e estar considerado no estado de \"descanso pleno\", recuperando seus pontos em Stamina e também seu MP. Enquanto meditando, um elfo está consciente do ambiente à sua volta e pode voluntariamente voltar à si em qualquer momento que desejar, diferentemente do sono comum que é um estado alterado de consciência."
        ],
        "requisitos": "Raça Elfo"
    },
    {
        "nome": "Visão Etérea",
        "pontos": "1",
        "descricao": [
            "Membros dessa raça possuem uma notória característica fora a beleza: sua visão bem precisa e infinitamente superior à de um humano normal. Com isso, personagens que comprarem essa vantagem  conseguem ter uma visão que vê 10x além da capacidade humana, ganhando sucesso automático em testes para ver pequenos detalhes de longe ou perceber coisas sutis a partir da visão. Além disso, um elfo consegue ver bem em ambientes com baixa iluminação ou iluminação precária (mas não no escuro)."
        ],
        "requisitos": "Raça Elfo"
    },
    {
        "nome": "Andarilho das Sombras",
        "pontos": "0",
        "descricao": [
			"Por viverem muito em cidadelas e complexos subterrâneos, os El’zels se acostumaram com a escuridão e aprenderam a viver à partir dela. Com isso, o personagem que pegar essa vantagem ganha a capacidade de enxergar no escuro sem problemas e também é capaz de ter uma boa visão em lugares com baixa iluminação, não sofrendo penalidades de qualquer tipo. Entretanto, durante a luz do sol ou sobre muita iluminação, a visão do personagem pode sofrer penalidades ou ficar sutilmente ofuscada. Essa vantagem não se acumula com outras de efeito similar. El’zels enxergam cerca de 50 metros na escuridão e são capazes de distinguir cores e formas com facilidade."
        ],
        "requisitos": "Raça El'zel"
    },
    {
        "nome": "Agilidade da Aranha",
        "pontos": "2",
        "descricao": [
            "Sobreviver é um direito que deve ser conquistado diariamente numa sociedade de El'zes, e justamente por isso estar em boa condição física e mental é essencial. O personagem aprendeu a se virar bem em situações tensas e adquiriu a esperteza e agilidade corporal necessária para evitar ser pego de surpresa ou ser atingido por coisas no escuro, aumente o valor da Agilidade dele em +1 ponto, podendo ultrapassar o valor de 5. Essa vantagem não se acumula com \"Reflexos Velozes\". O personagem também ganha um bônus de +1 em testes de Percepção em ambientes escuros ou com baixa iluminação."
        ],
        "requisitos": "Raça El'zel"
    },
    {
        "nome": "Sedução",
        "pontos": "1",
        "descricao": [
            "Se há algo que os El'zels mantiveram de seus primos da superfície (os Elfos) é o vínculo carismático que possuem frente aos seus discursos e necessidades. Diferentemente de um carisma de beleza estética, os El'zels são capazes de seduzir muito mais facilmente e influenciar as emoções e percepção de um alvo desejado. Com isso, o personagem el'zel que adquirir essa vantagem ganha um bônus de +2 em rolagens que envolvam algum tipo de Sedução. Esse bônus não se aplica contra alvos que são elfos."
        ],
        "requisitos": "Raça El'zel"
    },
    {
        "nome": "Sono dos Rejeitados",
        "pontos": "1",
        "descricao": [
            "Diferentemente de seus primos da superfície (os elfos), os El'zels não são totalmente imunes aos efeitos do sono e de encantamentos com propriedades desse tipo. Por outro lado, eles ainda se diferenciam de outros seres vivos por possuírem um sono bem leve e sutil, permitindo que eles acordem quando bem desejarem e que ganhem um bônus de resistência igual à +1 em testes que envolvam tentar evitar ou resistir à encantamentos do sono."
        ],
        "requisitos": "Raça El'zel"
    },
    {
        "nome": "Conhecimento do Universo",
        "pontos": "2",
        "descricao": [
            "Tecnologia de ponta é uma característica muito marcante na sociedade dos Fayris e isso rapidamente se espalhou pra vários aparatos do dia-dia desses pequenos seres. Com isso, um personagem que comprar essa vantagem possui algum tipo de objeto, ou mesmo um informante / uma forma de conseguir informações sobre tudo em qualquer lugar e à qualquer hora. A maior parte das questões do personagem serão respondidas, mas não há garantia de que ele vá \tconseguir respostas sobre tudo. Em termos técnicos isso significa que para testes de conhecimento com uma dificuldade igual ou menor à 10 o personagem consegue um sucesso automático - valores acima disso representam conhecimentos muito secretos e específicos.  Essa vantagem não se acumula com outras de efeito similar."
        ],
        "requisitos": "Raça Fayri"
    },
    {
        "nome": "Diminuto",
        "pontos": "0",
        "descricao": [
            "Fayris são muito pequenos por natureza e isso permite que eles acessem lugares mais remotos e difíceis com maior facilidade. Dessa forma, o personagem ganha um bônus de +2 sempre que seu tamanho for relevante para entrar em locais apertados, pequenos ou estreitos. Esse bônus não se acumula com outros bônus de efeito similar."
        ],
        "requisitos": "Raça Fayri"
    },
    {
        "nome": "Eu tenho a coisa certa para isso",
        "pontos": "1",
        "descricao": [
            "Alguns membros dessa raça gostam de levar consigo diversos objetos e coisas em suas aventuras, imaginando o que pode ser útil e quando. Um personagem com essa vantagem geralmente tem \"tranqueiras\" para quase todas as situações, em geral são objetos simples que fazem algo objetivo, como pilhas, cordas, pás, cadernos, canetas, etc. Essa vantagem não funciona quando o personagem for privado de todos os seus pertences e também pode ser vetada temporariamente caso o jogador comece a abusar dela. Esse efeito não se acumula com outros bônus de efeito similar."
        ],
        "requisitos": "Raça Fayri"
    },
    {
        "nome": "Rápida Aprendizagem",
        "pontos": "1",
        "descricao": [
            "Acostumados a terem contato com muitas informações de diversas fontes, os Fayris conseguiram também desenvolver uma forma de rápida aprendizagem para os assuntos relevantes dos dia-dia. Com isso, um personagem com essa vantagem recebe 2 pontos extras de perícias para gastar na criação de personagem e 1 ponto extra de perícia a cada novo nível que atingir. Essa vantagem não se acumula com outras vantagens de efeito similar."
        ],
        "requisitos": "Raça Fayri"
    },
    {
        "nome": "Paciência de Pedra",
        "pontos": "0",
        "descricao": [
            "Devido a sua natureza calma e fria, a grande parte dos Golems são geralmente muito pacientes e conseguem permanecer sob controle em boa parte do tempo, sendo assim, calmos. O personagem com essa vantagem não sofre penalidades no atributo Força de Vontade frente à situações que o provocam ou tentam tirar do sério. Essa vantagem não se acumula com outras de efeitos similares."
        ],
        "requisitos": "Raça Golem"
    },
    {
        "nome": "Resistência Superior",
        "pontos": "2",
        "descricao": [
            "Um Golem é naturalmente mais resistente que outras raças feitas de carne e osso, e por isso ganham um bônus fixo de +2 no HP máximo, representando a dificuldade que é de se derrotar uma criatura dessa raça. Essa vantagem não se acumula com outras de efeitos similares."
        ],
        "requisitos": "Raça Golem"
    },
    {
        "nome": "Fisiologia de Golem",
        "pontos": "1",
        "descricao": [
            "Um Golem não precisa se alimentar nem beber para sobreviver, sua constituição feita de diversos minerais e rochas já lhe dão tudo o que ele precisa para sobreviver de forma auto-suficiente. Um personagem com essa vantagem não perde MP ou Stamina por falta de comida, água ou coisas do tipo."
        ],
        "requisitos": "Raça Golem"
    },
    {
        "nome": "Privilégio Humano",
        "pontos": "2",
        "descricao": [
            "O ambiente no qual você cresceu incentivava, e muito, o seu desenvolvimento em algum quesito. Escolha um atributo-teste e aumente ele em +1. Essa vantagem não pode ser comprada mais de uma vez e não pode mirar em um atributo que já foi alvo de outra vantagem que aumente seu nível."
        ],
        "requisitos": "Raça Humano"
    },
    {
        "nome": "Padrão Humano",
        "pontos": "0",
        "descricao": [
            "Como um humano, você encaixa perfeitamente nos padrões de beleza universais, geralmente definidos como “Quanto você parece um humano”. Sempre que lidando com uma raça que não pareça humana, seu atributo-secundário Aparência conta como, no mínimo 3."
        ],
        "requisitos": "Raça Humano"
    },
    {
        "nome": "Hábitos do Norte",
        "pontos": "0",
        "descricao": [
            "Um Jorn está acostumado aos efeitos do álcool e esse constante contato com a bebida acabou por alterar os genes da raça e deixando os membros mais novos \timunes ao efeito de uma bebedeira. Um personagem com essa vantagem nunca fica bêbado, mas isso não implica que seu comportamento não mude ou ele fique um pouco mais alegre, chato, triste ou as variantes do estado de embriaguez."
        ],
        "requisitos": "Raça Jorn"
    },
    {
        "nome": "Andarilho da Tundra",
        "pontos": "1",
        "descricao": [
            "Por conhecerem e estarem habituados à lugares gelados e com muita neve, um Jorn com essa vantagem dificilmente irá se perder nesse ambiente familiar. Para todos os efeitos, o personagem sempre encontra os caminhos mais seguros quando procurando intencionalmente pelas rotas certas e saberá dizer quando há algo de errado no ambiente, somente em planícies, tundras, ambientes com neve ou de clima glacial em geral. Adicional à isso, um personagem com essa vantagem não sofre penalidades por estar exposto à baixas temperaturas, a não ser que sejam extremas (além do que ele está acostumado) ou de origem sobrenatural."
        ],
        "requisitos": "Raça Jorn"
    },
    {
        "nome": "Conexão Animalesca",
        "pontos": "1",
        "descricao": [
            "A cultura dos Jorns exalta muitos animais da natureza e conta histórias épicas sobre como os espíritos deles guiaram essa civilização ao triunfo em inúmeros confrontos. Assim, um personagem Jorn com essa vantagem consegue entender melhor as motivações e comportamentos de animais em geral (não se aplica à Bestiais por razões óbvias), além de ser capaz de tentar estabelecer uma forma de comunicação ou controle sobre o animal em questão com um teste de Natureza, recebendo um bônus de +2 neste teste."
        ],
        "requisitos": "Raça Jorn"
    },
    {
        "nome": "Espírito Guia",
        "pontos": "1",
        "descricao": [
            "Escolha um animal para ser o seu guia espiritual em sua jornada, ele não aparecerá diretamente para você como um espírito mas poderá lhe dar dicas através de visões, sonhos ou sinais indiretos sobre algo. Você pode uma vez por dia ou sessão (o que acontecer primeiro) se concentrar e fazer uma oferenda, rezar, pedir um sinal ou meditar para o seu espírito escolhido e ele lhe atenderá com alguma resposta (à critério do Mestre). É necessário que o personagem esteja concentrado e não faça outras coisas além de tentar se comunicar com o espírito, para conseguir estabelecer uma conexão."
        ],
        "requisitos": "Raça Jorn"
    },
    {
        "nome": "Rápida Habituação",
        "pontos": "1",
        "descricao": [
            "Existem Kalkans por todos os lugares do mundo e em inúmeras sociedades diferentes que os aceitam ou meramente os suportam como membros integrantes. Dessa forma, essas pequenas criaturas aprenderam o que puderam pra sobreviver em diversos ambientes que muitas vezes não foram feitos para eles. Um personagem com essa vantagem ganha um bônus de +2 em testes de que envolvam a perícia Percepção ou sub-testes que tratem de algum tipo de Rastreamento  afim de encontrar atalhos e rotas alternativas para o Kalkan ou seu grupo."
        ],
        "requisitos": "Raça Kalkan"
    },
    {
        "nome": "Tamanho não é documento, mas pode ser útil",
        "pontos": "1",
        "descricao": [
            "Devido à baixa estatura que é algo natural dessa raça, os Kalkans conseguem usar isso ao seu favor mais facilmente em situações em que seu tamanho seja relevante. Um personagem com essa vantagem recebe um bônus de +2 em rolagens onde o tamanho dele seja relevante."
        ],
        "requisitos": "Raça Kalkan"
    },
    {
        "nome": "Desmoralizar",
        "pontos": "0",
        "descricao": [
            "A arte do insulto é para poucos - não se trata só de xingar com enormes palavrões de baixo nível que provoquem a mais profunda ira do inimigo. Um bom Kalkan sabe brincar com as palavras e desmoralizar seu oponente com xingamentos e nomes que o fazem parecer ridículo na frente dos outros, claro, somado ao contexto de seus argumentos. Assim, um personagem Kalkan que tentar fazer um teste com a perícia Intimidação quando envolver de forma criativa alguma forma de insulto afim de ridicularizar e desmoralizar o alvo, ganha um bônus de +1 na rolagem."
        ],
        "requisitos": "Raça Kalkan"
    },
    {
        "nome": "Coragem Kalkan",
        "pontos": "1",
        "descricao": [
            "Um Kalkan não sente medo facilmente, por mais assustadora que seja a situação e por mais que ela ameace sua própria vida - Kalkans tendem a ver isso como uma chance de se sentirem vivos e testar o que aconteceria se fizessem algo que as pessoas tendem a não fazer. Um personagem com essa vantagem recebe um bônus de +3 contra testes que envolvam sentir, resistir ou encarar o medo e insanidade."
        ],
        "requisitos": "Raça Kalkan"
    },
    {
        "nome": "Diplomacia Ogrekin",
        "pontos": "0",
        "descricao": [
            "Ogrekins possuem uma grande massa muscular e força física natural dentro de si, independente de suas preferências ou aptidões para armas. Por viverem numa sociedade feroz onde ter poder significa ser o melhor, eles aprenderam a ganhar respeito na base do que possuem de melhor - a força. Ao fazer uma demonstração de sua força (seja quebrando algo ou batendo em um inocente que não pode se defender), o personagem pode usar seu valor no atributo Força como modificador em testes com a perícia Intimidação, ao invés de usar Carisma."
        ],
        "requisitos": "Raça Ogrekin"
    },
    {
        "nome": "Corpo Superior",
        "pontos": "2",
        "descricao": [
            "As várias encarnações de um espírito que forma um Ogrekin carrega consigo algumas memórias e experiências de vidas passadas, e justamente por isso eventualmente esta velha alma pode reencarnar e trazer consigo parte dessas experiências e transferi-las para o ambiente biológico. Assim, um personagem com essa vantagem conseguiu uma reencarnação boa o suficiente para ampliar seus sentidos naturais, sendo capaz de ouvir claramente acontecimentos à 25 metros de distância dele, ouvir freqüências inaudíveis para pessoas normais, além de também possuir uma visão que vê 10x mais longe que um humano comum e ser capaz de possuir um olfato superior, identificando cheiros e fragrâncias impossíveis de um humano comum sentir."
        ],
        "requisitos": "Raça Ogrekin"
    },
    {
        "nome": "Awareness",
        "pontos": "1",
        "descricao": [
            "O perigo está à espreita em todos os lugares quando você menos espera, e os Ogrekins sabem muito bem disso e levam esse ensinamento para suas vidas. Dessa forma, um personagem com essa vantagem ganha um bônus de +4 em qualquer teste que envolva a perícia Percepção afim de perceber perigos ou emboscadas no ambiente onde está. Mesmo falhando no teste o personagem com essa vantagem ainda pode agir na rodada surpresa, sendo assim, o último na ordem de iniciativas."
        ],
        "requisitos": "Raça Ogrekin"
    },
    {
        "nome": "Imagem Sobrenatural",
        "pontos": "0",
        "descricao": [
            "Há algo de peculiar na existência dos Ogrekins; por mais que eles possuam um corpo físico e uma alma que já conheceu inúmeras outras existências, ainda há algo que fica de fora misteriosamente: a imagem dos mesmos. Isso pode soar sem sentido, mas estudos diversos tentam explicar o porque de muitos Ogrekins nunca saírem em fotos ou serem capturados por imagens de câmeras (mesmo as mais avançadas tecnologicamente), nenhum deles ainda obteve uma resposta. Assim, um personagem com essa vantagem não pode ter sua imagem capturada por nenhum aparato tecnológico, seja por foto ou vídeo."
        ],
        "requisitos": "Raça Ogrekin"
    },
    {
        "nome": "Alimentação Selvagem",
        "pontos": "0",
        "descricao": [
            "Orcs estão acostumados a comer vários tipos de coisas, talvez muitas que sejam consideradas até nojentas ou não-saudáveis para outras raças, como os humanos, por exemplo. Assim, um personagem com essa vantagem fica imune à efeitos de venenos, intoxicação, danos ou feitiços que sejam colocados sobre uma comida ou substância que o Orc acabe ingerindo por via oral."
        ],
        "requisitos": "Raça Orc"
    },
    {
        "nome": "Ferocidade dos Orc",
        "pontos": "2",
        "descricao": [
            "Uma vez por episódio ou por dia (o que acontecer primeiro) o personagem com essa vantagem pode canalizar suas forças mais primitivas e instintivas, fazendo com que seu sangue borbulhe de raiva e o coloque num modo implacável de confronto. O personagem não é nocauteado quando atinge 0 pontos de HP se passar num teste de Força de Vontade (dificuldade à critério do mestre) e pode continuar lutando normalmente até -10 HP, onde morre instantaneamente sem direito à testes de morte. Caso o personagem fique com o HP menor que 1 quando a batalha acabar, ele cai inconsciente e faz testes de morte normalmente."
        ],
        "requisitos": "Raça Orc"
    },
    {
        "nome": "Andarilho do Sol",
        "pontos": "0",
        "descricao": [
            "Acostumados a andar longas distâncias em vários ambientes diferentes, os Orcs aprenderam que a natureza não é sua inimiga; mas sim mais um desafio à ser vencido. Dessa forma, personagens com essa vantagem conseguem enxergar 10x mais longe que a visão normal humana durante o dia, tendo facilidade em detectar pequenos detalhes sob a luz do sol ou iluminação ambiente artificial."
        ],
        "requisitos": "Raça Orc"
    },
    {
        "nome": "Ameaça Natural",
        "pontos": "1",
        "descricao": [
            "Dificilmente um Orc não conseguirá intimidar seu alvo quando desejar, seja usando sua força, sua constituição ou seus argumentos (geralmente pouco) elaborados. Ainda assim, o que mais conta num Orc é geralmente sua aparência intimidadora, e assim, para testes da perícia Intimidação que o personagem com essa vantagem fizer, ganhe um bônus de +2."
        ],
        "requisitos": "Raça Orc"
    },
    {
        "nome": "Nascido na Água",
        "pontos": "0",
        "descricao": [
            "Acostumado com ambientes aquáticos, os Quellsir não possuem dificuldades em se adaptar ou viver nesse tipo de cenário. Dessa forma, um personagem com essa vantagem consegue respirar perfeitamente embaixo da água, além de ter seus sentidos melhorados enquanto imerso. Um personagem com essa vantagem também reduz a dificuldade de testes que envolvam Natação em uma categoria."
        ],
        "requisitos": "Raça Quellsir"
    },
    {
        "nome": "Jóia do Oceano",
        "pontos": "0",
        "descricao": [
            "A beleza herdada de seus primos distantes, os Elfos e os El'zels também floresceu por baixo da água e se adaptou com o tempo. Muitas lendas sobre sereias e tritões na verdade fazem referências à Quellsirs de tempos antigos que ainda estavam se desenvolvendo, mas a beleza deles sempre foi o traço mais marcante e encantador da raça. Um personagem com essa vantagem pode adicionar um bônus de +2 em testes de Carisma onde sua aparência seja relevante (em testes de Sedução ou outros que forem relevantes e o Mestre permitir)."
        ],
        "requisitos": "Raça Quellsir"
    },
    {
        "nome": "Artesanato Subaquático",
        "pontos": "1",
        "descricao": [
            "Existem incontáveis relíquias, artefatos e objetos com valores inestimáveis que possuem sua origem vinda dos profundos oceanos. Quellsirs possuem um talento natural para trabalhar com materiais incomuns como corais, pérolas rochas, algas e outros minérios e plantas provindas do mar. Assim, o trabalho dos mesmos é sempre muito bem reconhecido e apreciado (na maioria das sociedades), fazendo com que o personagem com essa vantagem ganhe um valor adicional de +25% moedas de ouro quando trabalhando com a perícia Emprego em referência à criação de algum objeto não-consumível."
        ],
        "requisitos": "Raça Quellsir"
    },
    {
        "nome": "Mente Forte",
        "pontos": "2",
        "descricao": [
            "Obrigados a sobreviver em diversas condições e situações tensas durante suas vidas na superfície ou em baixo da água, os Quellsirs desenvolveram uma mente resistente e são capazes de enfrentar aqueles que tendam eliminar suas forças mentais. Um personagem com essa vantagem ganha um bônus de vantagem de +3 em qualquer teste de resistência contra ataques mentais."
        ],
        "requisitos": "Raça Quellsir"
    },
    {
        "nome": "Fruto da Árvore mãe",
        "pontos": "0",
        "descricao": [
            "Membros dessa raça tendem a envelhecer mais devagar que outras raças, embora não sejam totalmente imortais e imunes aos efeitos do tempo. Dessa forma, um personagem Zahari com essa vantagem dificilmente terá algum traço de envelhecimento físico externo notável, e provavelmente morrerá com a aparência jovem quando sua hora chegar."
        ],
        "requisitos": "Raça Zahari"
    },
    {
        "nome": "Contato Natural",
        "pontos": "1",
        "descricao": [
            "Estar no meio de animais de diversos tipos, selvagens ou não, é algo natural para os Zaharis e isso na verdade é algo até esperado entre eles. Membros dessa raça com essa vantagem são capazes de se comunicar com animais e entender seus sentimentos ou motivações, mesmo que não seja através de uma comunicação verbal direta. Além disso, animais não atacarão o Zahari a não ser que ele os ataque primeiro. O personagem pode rolar um teste da perícia Natureza e adicionar um bônus de +2 sempre que esse teste envolver alguma tentativa de lidar com animais selvagens ou domá-los."
        ],
        "requisitos": "Raça Zahari"
    },
    {
        "nome": "Cuidado com os Espinhos",
        "pontos": "0",
        "descricao": [
            "O personagem Zahari nasceu ou desenvolveu através do seu processo de envelhecimento, algum tipo de defesa natural em seu corpo - geralmente, são espinhos de diversos tipos, tamanhos e cores. Um personagem com essa vantagem consegue repelir predadores e potenciais perigos que venham à entrar em contato direto com seu corpo de forma desprotegida. Assim, o personagem ganha +1 de Redução de Dano (RD) Específica contra o atributo Arte Marcial (AM), mesmo que o personagem não esteja usando armaduras ou algo do tipo. Essa proteção não se acumula com outros bônus similares de outras vantagens."
        ],
        "requisitos": "Raça Zahari"
    },
    {
        "nome": "Companheiro Natural",
        "pontos": "1",
        "descricao": [
            "Escolha um animal, de qualquer família ou de qualquer tipo (mas pense bem nos hábitos de vida desse animal e seu habitat preferencial): o personagem Zahari foi presenteado durante o seu nascimento, ou durante sua vida como um todo, com esse animal como uma espécie de companheiro para sua vida. Essa criatura é relativamente inteligente e é capaz de entender comandos e emoções do seu personagem e talvez até de outras pessoas. Escolha dois Atributos-Teste para seu companheiro, ele poderá realizar tarefas simples que usem esses atributos e terá sucesso automático em tais tarefas desde que as mesmas estejam dentro de suas capacidades e limitações. Ao mesmo tempo, o companheiro falha automaticamente em tarefas que sejam muito difíceis para ele.. Exemplo: usar Sabedoria para perceber algum tipo de perigo no ar ou rastros deixados em um ambiente, usar Força para empurrar objetos, etc."
        ],
        "requisitos": "Raça Zahari"
    },
    {
        "nome": "Discurso Esclarecedor",
        "pontos": "0",
        "descricao": [
            "A voz de muitos Yu'qun tende a ser mais calma e pacífica, ajudando-os a manter a posição neutra e de imparcialidade sobre situações diversas. Dessa forma, tanto a expressão quanto a forma de dizer são importantes para as pessoas que recebem tal discurso. Um \tpersonagem com essa vantagem pode usar o Atributo-Teste Inteligência no lugar de Carisma para testes com a perícia Diplomacia."
        ],
        "requisitos": "Raça Yuqun"
    },
    {
        "nome": "Predição de Eventos",
        "pontos": "2",
        "descricao": [
            "Por (geralmente) vir de uma época futura ou distante da realidade atual em que está inserido, o personagem Yu'qun em alguns momentos consegue ter visões ou lapsos de memória sobre o que vai acontecer ou poderia",
            "acontecer se um evento tomasse certo rumo. Dessa forma,  em momentos escolhidos pelo Mestre ou 1 vez por sessão / dia (se o mestre estiver de acordo previamente), o jogador com essa vantagem tem uma visão simples e breve de algum evento que irá acontecer ou poderá acontecer em determinada circunstância. Essa vantagem não pode coexistir com \"Oráculo\"."
        ],
        "requisitos": "Raça Yuqun"
    },
    {
        "nome": "Olhar Frio",
        "pontos": "1",
        "descricao": [
            "A sua neutralidade como Yu'qun é muito forte e presente em suas falas e pensamentos. Dessa forma, ganhe um bônus de +2 em testes que envolvam perícias ou atributos para sentir as motivações de um alvo ou identificar mentiras / falsos testemunhos (mesmo que você não tenha provas sólidas para acreditar nisso)."
        ],
        "requisitos": "Raça Yuqun"
    },
    {
        "nome": "Senso de Corrupção",
        "pontos": "1",
        "descricao": [
            "A elevada percepção de Yu'qun pode ser bem útil em casos de perigo; o personagem com essa vantagem é capaz de, através de um teste da perícia Percepção, notar em até 8 metros de distância qualquer tipo de corrupção anormal (de origem mágica ou algo do tipo) e estabelecer uma breve escala do quão perigoso isso é para ele ou para as pessoas à sua volta. O jogador pode assim, perguntar privadamente ao Mestre qual o grau de perigo frente ao que ele percebeu e o Mestre dizer numa escala de 1 à 5 o nível de perigo (sendo 5 o mais perigoso)."
        ],
        "requisitos": "Raça Yuqun"
    },
    {
        "nome": "Linguagem",
        "pontos": "0",
        "descricao": [
            "O personagem compreende e sabe falar uma outra língua."
        ],
        "requisitos" : "A língua falada e compreendida depende da Raça escolhida."
    },
    /* Vantagens de Arquétipo */
    {
        "nome": "Trabalho Duro",
        "pontos": "0",
        "descricao": [
            "Você possui aptidões naturais para trabalhar com Alquimia e componentes químicos, assim, esta vantagem concede um bônus de +2 em testes de criação de itens pelo Emprego: Alquimia."
        ],
        "requisitos": "Arquétipo Alquimista"
    },
    {
        "nome": "Apotecário",
        "pontos": "0",
        "descricao": [
            "Uma vez por sessão ou dia (o que demorar mais para acontecer) você pode puxar uma poção que possua um efeito narrativo relativamente simples voltado para um propósito único. Essa poção não pode ser usada em combate para fins de aumentar HP, MP ou coisas que o influenciem diretamente. Exemplos: um frasco que faz crescer uma densa vegetação entre o usuário e os inimigos, impossibilitando que eles o alcancem dali, permitindo que o grupo fuja, ou mesmo uma poção que cria um efeito ilusório de fogo intenso, assustando qualquer ameaça que tente se aproximar (sem saberem que é um fogo falso). O mestre pode vetar um efeito se achar que ele não corresponde às regras ou foge dos objetivos dessa vantagem."
        ],
        "requisitos": "Arquétipo Alquimista"
    },
    {
        "nome": "O Poder do Cinto",
        "pontos": "0",
        "descricao": [
            "O Arauto carrega consigo um artefato especial. O Arauto tem todos seus atributos de combate reduzidos em -1 (inclui Ataque e Defesa), para um mínimo de 0.  O jogador pode decidir reduzir seus atributos para 0 sem o artefato, se relevante. Ele deve ativar o seu artefato para poder utilizar seus atributos (como uma ação grátis que pode ser realizada na Fase de Preparação).  O jogador também pode decidir incluir alguns atributos-teste e/ou perícias nessa separação, se quiser. O artefato não precisa ser um cinto, esta é só a definição da vantagem."
        ],
        "requisitos": "Arquétipo Arauto da Profecia"
    },
    {
        "nome": "Ultimate Life Form",
        "pontos": "0",
        "descricao": [
            "Em um marco importante da história, você pode ter aprendido o segredo da sua forma final, junto do seu artefato. Ao ativar sua forma final, você pode transformar uma luta 1x1 em uma batalha cinemática (seguindo as regras apropriadas para essas lutas). Inimigos de nível igual ou superior ao seu são muito fortes para serem enfrentados dessa maneiraAlquimista. Você também pode incluir sua Forma Final em suas técnicas a partir desse ponto da história, mas isso não é obrigatório nem te dá bônus extras."
        ],
        "requisitos": "Arquétipo Arauto da Profecia"
    },
    {
        "nome": "Segredos Antigos",
        "pontos": "0",
        "descricao": [
            "O seu artefato possui muitos segredos místicos que você está apenas começando a despertar. A cada novo nível que você adquirir, você ganha 1 ponto de habilidade a mais do que o normal."
        ],
        "requisitos": "Arquétipo Arauto da Profecia"
    },
    {
        "nome": "Andarilho do Mundo",
        "pontos": "0",
        "descricao": [
			"Seu treinamento te deixou apto a agir com maior precisão, facilidade e sobrevivência em um tipo de terreno. Assim sendo, escolha um terreno que represente o seu treinamento: Neve, Desertos, Pântanos, Montanhas, Planícies, Cavernas, Florestas, Praias ou Urbano. Sempre que estiver no seu estilo de terreno escolhido, você pode declarar ao Mestre que irá tomar um tempo para se familiarizar com ele. Esse tempo pode ser de 5 à 30 minutos.",
 "Dependendo da quantidade de tempo gasta, você ganha os seguintes benefícios (a critério do mestre frente ao tempo usado) enquanto permanecer nesse tipo de terreno:",
"- Você e seu grupo não podem se perder de qualquer forma, a não ser que seja por influências mágicas;",
"- Você está sempre alerta ao perigo, não podendo ser surpreendido em combate e sabendo automaticamente quando alguma criatura ou alguém está na espreita;",
"- Você ignora qualquer penalidade que o terreno imponha contra você dentro e fora de combate;",
"- Você passa automaticamente em testes de Furtividade e os seus relacionados;",
"- Você é capaz de encontrar comida sem rolar qualquer teste. Em ambientes urbanos isso pode significar uma facilidade pra encontrar restaurantes ou locais com comida;",
"- Você passa automaticamente em testes relacionados à Rastreamento e identificação de pegadas, trilhas ou vida local;",
"Alternativamente, você pode não pegar alguma outra vantagem de arquétipo para comprar treinamento em um segundo tipo de terreno da sua escolha. Essa vantagem só pode ser pega no máximo duas vezes. Os terrenos escolhidos devem fazer sentido com a história e passado / presente do seu personagem."
		],
        "requisitos": "Arquétipo Artilheiro"
    },
    {
        "nome": "Concentração Atroz",
        "pontos": "0",
        "descricao": [
            "Após anos e anos de treinamento, os movimentos do artilheiro são extremamente precisos. Você é capaz de acertar o olho de um rato a muitos metros de distância, e torna testes menores de precisão irrelevantes."
        ],
        "requisitos": "Arquétipo Artilheiro"
    },
    {
        "nome": "Dedos Rápidos",
        "pontos": "0",
        "descricao": [
            "Sempre que você iniciar combate com alguém (você tomou a primeira ação), você não rola os dados de iniciativa: você é o primeiro a agir na rodada e pronto."
        ],
        "requisitos": "Arquétipo Artilheiro"
    },
    {
        "nome": "Débito de Sangue",
        "pontos": "0",
        "descricao": [
            "Enquanto existirem pelo menos duas pessoas no mundo, alguém vai querer alguém morto. O assassino sempre sabe como conseguir alvos e pode conseguir um sem a necessidade de testes, contanto que esteja em uma cidade/vilarejo. Um assassino não pode conseguir um alvo novo enquanto não tiver se livrado do último. Se livrar de um alvo dá uma quantia de dinheiro para o assassino apropriado ao seu nível. O nível do assassino também define a dificuldade do trabalho.",
			"Esse trabalho pode ser executado tanto dentro dos episódios de jogo como uma atividade em tempo livre (ver capítulo 11 do manual)."
		],
        "requisitos": "Arquétipo Assassino"
    },
    {
        "nome": "Informante Silencioso",
        "pontos": "0",
        "descricao": [
			"O trabalho de um assassino não é só matar um alvo em plena luz do dia, mas inclui também a coleta de pistas e informações para que o assassinato seja o grand finale, o ápice de tudo.",
			"Você desenvolveu uma aptidão natural em perceber detalhes e informações sociais das pessoas, principalmente sobre aquilo que te interessa: a vida pessoal delas. Uma vez por sessão ou dia (o que acontecer primeiro), você pode usar uma ação grátis de perguntar privadamente ao Mestre um número de questões bastante pessoais sobre um personagem que você pode ver e ouvir (naquele momento).",
			"O número de questões a serem feitas é sempre igual ao nível do personagem. As perguntas só podem ser feitas quando o personagem está vendo ou ouvindo o seu alvo, como dito anteriormente e não podem ser feitas em dois momentos diferentes da mesma sessão. Exemplos de perguntas:",
			"• \"Qual a profissão dele?\";",
			"• \"Qual tipo de música ele mais gosta?\";",
			"• \"Onde ele mora?\"",
			"O que o personagem vai fazer com essas informações, é de critério dele. O mestre pode negar responder perguntas que seriam inadequadas ou que favoreçam o metajogo intenso (ver capítulo 12 do manual básico para saber a definição de metajogo), como por exemplo: \"Quem é que contratou ele pra tentar matar o meu empregador?\". Esse tipo de pergunta até pode ser respondida, mas talvez de uma forma mais enigmática ou que instigue o jogador e seu personagem a irem atrás de maiores detalhes."
        ],
        "requisitos": "Arquétipo Assassino"
    },
    {
        "nome": "Implacável",
        "pontos": "0",
        "descricao": [
			"Caso você receba um dano que te jogue pra 0 de HP imediatamente enquanto estiver com a vida cheia, ou com o seu valor na metade, você entra num estado corporal e espiritual que transcendem a normalidade. Assim, caso seja reduzido para 0 de HP ou menos (a não ser que os danos te levem para -10 de HP imediatamente), você automaticamente passa nos dois primeiros testes de morte (seja de Força de Vontade ou Constituição). Esse efeito só ocorre uma vez por sessão ou dia, o que acontecer primeiro."
        ],
        "requisitos": "Arquétipo Bárbaro"
    },
    {
        "nome": "Fúria Renovada",
        "pontos": "0",
        "descricao": [
            "Uma vez por dia ou episódio (o que demorar mais para acontecer) você pode entrar num estado de fúria mediante à uma situação tensa ou que necessite de tal mobilização psíquica. Enquanto neste estado, você ignora qualquer dificuldade de terreno para se mover, não ganhando penalidades nisso. Adicionalmente, você também pode se mover com o dobro de velocidade normal, para cenas narrativas isso significa que você é quase um perseguidor implacável. Durante esse tempo você também não pode sofrer efeitos de dominação mental ou alteração de emoções, muito menos ser pego de surpresa em combate (portanto, se um combate iniciar e você estiver em modo de fúria previamente, você age primeiro que todos independente dos resultados). A fúria dura 1d4 rodadas ou 5 minutos."
        ],
        "requisitos": "Arquétipo Bárbaro"
    },
    {
        "nome": "Harmonia Improvisada",
        "pontos": "0",
        "descricao": [
            "Você começa a tocar uma música improvisada, a cantar algo ou mesmo a traçar uma performance na hora (caso seja uma música tocada, ela pode ter uma breve letra para acompanhar a canção, mas não precisa ser nenhuma obra de arte) e imediatamente todos os ouvintes do local começam a prestar atenção em você, num raio de até 10 metros. Os ouvintes suspendem todas as suas atividades atuais e passam a observá-lo até que sua canção acabe ou até que o efeito vá lentamente se dissipando. Isso não funciona em combate."
        ],
        "requisitos": "Arquétipo Bardo"
    },
    {
        "nome": "Bard's Song",
        "pontos": "0",
        "descricao": [
			"Você começa a tocar uma música improvisada, a cantar algo ou mesmo a traçar uma performance na hora (caso seja uma música tocada, ela pode ter uma breve letra para acompanhar a canção mas não precisa ser nenhuma obra de arte) e imediatamente direcionando-a para um alvo da sua escolha.",
			"Esse alvo precisa ser capaz de ouvir ou ver a sua performance para então ganhar um dado de harmonia. O dado de harmonia é 1d4 extra que pode ser rolado e somado como bônus num teste de Perícia ou de Atributo-Teste. O dado de harmonia fica ativo por 1 rodada ou 10 minutos num personagem e caso não seja usado, é perdido.",
			"O usuário pode decidir usar o dado depois que a rolagem de uma perícia ou atributo-teste for feita, mas nunca depois que o Mestre dizer a dificuldade do teste ou o que aconteceu. Depois de rolado, o dado de harmonia é perdido.",
			"Um alvo só pode ter um dado de harmonia ativo por vez. O bardo pode conceder uma quantidade de dados de harmonia igual ao seu nível atual, mas nunca mais de um dado de harmonia por vez pra um mesmo alvo.",
			"Essa performance pode atrapalhar em certas situações e narrativamente ser inadequada ou ter outras complicações (chamar a atenção, por exemplo). Exemplo de performance:“Minta, minta para o rei~! Faça ele de bobo e nos salve da lei~!”"
        ],
        "requisitos": "Arquétipo Bardo"
    },
    {
        "nome": "Líder do Bando",
        "pontos": "0",
        "descricao": [
            "Orgulho é o que separa o amador do profissional, e um caçador é movido pela sua vontade de superar qualquer obstáculo. Sempre que um caçador estiver realizando testes de uma forma competitiva com outro personagem ou criatura, ele recebe +1 Bônus de Arquétipo em testes de atributos-teste e +2 Bônus de Arquétipo em testes de perícia com atributo-teste. Estar realizando exatamente o mesmo teste que o resto do grupo e ao mesmo tempo conta como  atividade competitiva."
        ],
        "requisitos": "Arquétipo Caçador"
    },
    {
        "nome": "Combatente Alfa",
        "pontos": "0",
        "descricao": [
            "O caçador é um mestre de armas e está sempre pronto para um combate com sua presa. Todas as armas passam a funcionar para seu maior atributo de dano, independente de qual arma seja e qual o atributo de dano do caçador seja, ele faz funcionar. O caçador também pode utilizar qualquer arma improvisada como uma arma de nível 0 para seu atributo de dano principal."
        ],
        "requisitos": "Arquétipo Caçador"
    },
    {
        "nome": "Rei da Selva",
        "pontos": "0",
        "descricao": [
            "A mera presença de um caçador tão grandioso é o suficiente para amedrontar criaturas de todos os tipos. Animais de nível igual ou inferior ao do caçador não irão atacar nem atrapalhar o grupo na maior parte das vezes, mesmo que sejam treinados. Eles sabem muito bem que não teriam como vencer."
        ],
        "requisitos": "Arquétipo Caçador"
    },
    {
        "nome": "Energia Negativa",
        "pontos": "0",
        "descricao": [
			"A energia negativa é o principal recurso que Cavaleiros Negros dominam. Similarmente aos Necromantes, os Cavaleiros Negros dão um passo em frente aos vários tipos de energias caóticas da realidade, mas optam por dominar o que eles chamam de Energia Negativa, ao invés da Energia Caótica dos necromantes.",
            "A energia negativa influencia principalmente nas emoções, estado corporal e mente de um alvo, permitindo que os cavaleiros manipulem essas pessoas ou enfraqueçam-a da forma desejada.",
            "Com essa vantagem, você pode converter 18 pontos de MP em 2 pontos de energia negativa. Um personagem só pode ter 4 pontos máximos de energia negativa por vez.",
            "Essa energia não-usada se dissipa após 1 rodada, 10 minutos ou um curto tempo sem uso. A energia negativa pode ser usada da seguinte forma:",
            "• Ouvir os pensamentos de um único alvo por 1 minuto (Custa 2 pontos);",
            "• Causar inferioridade numa rolagem de Atributo-Teste de um alvo (Custa 2 pontos);",
            "• Proteger a sua mente de feitiços de dominação mental e leitura de pensamentos por 10 minutos ou 1 rodada (Custa 1 ponto);",
            "• Assumir uma forma negativa falsa - você copia a aparência de alguém, mas não a sua voz, mente e personalidade. Assim sendo, se você falar qualquer coisa ou levantar suspeitas de algo que o alvo copiado não faria, o efeito acaba. Receber danos de qualquer tipo acaba com esse efeito imediatamente também.",
            "A manutenção da sua aparência depende da sua energia negativa, e isso depende do quanto o alvo acredita que você é aquela pessoa pela qual está se passando. Esse efeito não pode ser usado em combate.",
            "Assumir uma forma negativa falsa dura 2 rodadas ou 20 minutos. Um personagem não pode assumir a mesma forma várias vezes em seguida e precisa de no mínimo 1 hora de descanso para usar esses efeitos novamente (Custa 4 pontos)."
        ],
        "requisitos": "Arquétipo Cavaleiro Negro"
    },
    {
        "nome": "Aura Profana",
        "pontos": "0",
        "descricao": [
			"Um grande fluxo de energia negativa se concentra na sua existência. Justamente por isso, outras formas de vida acabam sendo afetadas por consequência imediata. Você pode ativar a sua Aura Profana uma vez por episódio ou dia, o que acontecer primeiro.",
            "Ao ativar, você distorce sutilmente as emoções dos alvos próximos (incluindo seus aliados), fazendo com que eles ganhem inferioridade (veja o capítulo 5 para maiores detalhes) em testes de origem social até que a aura se dissipe.",
            "A aura dura 1 rodada ou 10 minutos dentro de uma cena. Paralelamente, enquanto esse efeito durar, você é capaz de identificar movimentações em volta de si e não pode ser pego de surpresa num combate."
        ],
        "requisitos": "Arquétipo Cavaleiro Negro"
    },
    {
        "nome": "Símbolos Sagrados",
        "pontos": "0",
        "descricao": [
			"Toda divindade, crença ou conceito geralmente é acompanhada por uma espécie de símbolo que o define ou o representa conceitualmente. Assim sendo, qualquer símbolo ou objeto feito em honra ao deus escolhido na criação do personagem se torna um símbolo sagrado.",
            "Um Clérigo pode ter um símbolo sagrado de graça nos seus equipamentos iniciais, e pode usá-lo para tentar clamar por uma intervenção divina, algo que a sua crença possa lhe ajudar ou guiar seu caminho. O clérigo pode rolar 1d100 enquanto gasta uma rodada ou 5 minutos evocando e se concentrando para pedir ajuda, onde:",
            "• Resultado entre 1 e 10: O seu chamado não foi forte o suficiente, e portanto, em vão;",
            "• Resultado entre 11 e 50: O seu chamado por ajuda foi atendido, de uma forma modesta e sutilmente útil;",
            "• Resultado entre 51 e 89: O seu chamado por ajuda foi atendido e a sua divindade / crença te garante uma ajuda adequada;",
            "• Resultado entre 90 e 100: O seu chamado por ajuda foi atendido e a sua divindade / crença te garante uma grande ajuda. Em alguns casos, talvez até um milagre inexplicável.",
            "Regras de uso: Um clérigo só pode evocar o seu símbolo sagrado uma vez por sessão e o tipo de ajuda dependendo do resultado é descrito e dado à critério do mestre. Um resultado \"modesto e sutilmente útil\" não deveria ser algo exatamente da forma que o personagem pediu, mas que ainda possa ser usado de alguma forma.",
            "Um resultado adequado seria um O Aventureiro transcende e continua o seu caminho, de combate, transformando-se no honroso Defensor. Essa figura representa o ápice do vigor e capacidade defensiva em proteger aqueles que amamos ou acreditamos - é a personificação do conceito de proteção, mesmo que essa proteção seja um ataque contra o próximo.",
            "A trilha da justiça e da honra o atendimento do que foi pedido, mas não perfeito. Um resultado de grande ajuda",
            "deve ser considerado algo extraordinário e que ajuda imensamente o clérigo e/ ou seu grupo. A intensidade da ajuda varia tanto com o resultado do dado quanto do nível do Clérigo em questão. Clérigos de nível 1 não deveriam ser capazes de elaborar milagres incríveis e extremamente fortes somente pelo resultado alto do dado.",
            "Após invocar a sua divindade através do símbolo sagrado, o Clérigo precisa ao menos passar 7 horas (tempo de uma noite de sono inteira) em devoção completa, medidando, rezando ou pagando algum tipo de tributo pela ajuda da divindade em questão. Caso a ajuda não tenha sido conseguida, ele não precisa fazer isso.",
            "Um personagem não pode invocar sua divindade sem um símbolo sagrado presente e caso o símbolo seja destruído durante uma invocação, a concentração do Clérigo é perdida e ele precisa recomeçar o processo (mas não fica ilegível para usar essa vantagem).",
            "Essa vantagem pode não ser usada em certas situações que o mestre desejar, para manter o controle sobre a história e os acontecimentos. Todavia, pede-se descrição e bom senso do mesmo para que essa habilidade não seja totalmente tirada de um jogador."
        ],
        "requisitos": "Arquétipo Clérigo"
    },
    {
        "nome": "Religioso",
        "pontos": "0",
        "descricao": [
            "Você deve seguir as regras da religião apropriada ao seu personagem. Você não ganha pontos por isso e não pode tomar a desvantagem religioso da forma normal. Essa desvantagem não é tão pesada quanto a normal, então você pode ir até o ponto em que estiver confortável ao definir as regras."
        ],
        "requisitos": "Arquétipo Clérigo"
    },
    {
        "nome": "Friends in High Places",
        "pontos": "0",
        "descricao": [
            "Você tem uma facilidade além do normal em identificar tensões no ar ou mudanças no ambiente que possam ser perigosas para você e seus aliados. Além disso, você é treinado para não deixar que o mal aconteça contra aqueles que protege. Dessa forma, se o Defensor montar um turno de guarda noturna, diurna ou o que for enquanto seus aliados dormem ou descansam, o grupo não pode ser emboscado e as criaturas na espreita ficam alerta da presença protetora do Defensor.",
            "Criaturas que ainda assim resolvam atacar ou ficar na espreita não podem iniciar um combate surpresa contra o Defensor e seus aliados protegidos, pois ele sempre os avisará (se plausível) da ameaça.",
            "Aliados protegidos não sofrem penalidades de perda ou má recuperação de Stamina quando tratando-se de um sono resguardado. Se o Defensor escolher usar essa vantagem, ele ficará relativamente cansado no dia seguinte quando seus aliados acordarem, mas não muito.",
            "Escolha um: perder 1 ponto de Stamina atual ou sofrer inferioridade (ver capítulo 5) em todas as rolagens de perícias e atributos-teste por conta do cansaço acumulado."
        ],
        "requisitos": "Arquétipo Defensor"
    },
    {
        "nome": "Patrono",
        "pontos": "0",
        "descricao": [
            "Uma grande organização, empresa, governo ou NPC poderoso ajuda você. Dentro de certos limites um Patrono pode fornecer transporte, equipamento e informação para você. Um Patrono também pode ajudar e enviar reforços quando você mais precisar. Ter um Patrono também significa que você precisa ser leal e seguir ordens. Muitas vezes vai precisar cumprir missões especiais para o seu Patrono.",
            "Essa vantagem é opcional."
        ],
        "requisitos": "Arquétipo Defensor"
    },
    {
        "nome": "Vanguarda",
        "pontos": "0",
        "descricao": [
            "Você pode não ser o melhor protetor de todos e pode nem sempre estar em todos os lugares, mas fará de tudo para proteger seus aliados mais estimados.",
            "Caso esteja na frente do grupo durante uma exploração, movimentação ou cena, você pode agir como uma força de aviso e alerta para o grupo, permitindo que eles ganhem superioridade (ver capítulo 5) na primeira rolagem executada a partir de então. Você não ganha esse bônus. Esse bônus só acontece novamente depois de um certo tempo (a critério do mestre)."
        ],
        "requisitos": "Arquétipo Defensor"
    },
    {
        "nome": "Como se fosse minha casa",
        "pontos": "0",
        "descricao": [
            "Qualquer teste para busca de alimentos em uma área selvagem que fosse exigir um teste possível de até dificuldade média (15) passa a ser sucesso automático, você conhece a natureza como a palma da sua mão. O mesmo vale para testes para não se perder ou encontrar alguém que passou por ali."
        ],
        "requisitos": "Arquétipo Druida"
    },
    {
        "nome": "O filho pródigo retorna",
        "pontos": "0",
        "descricao": [
            "Escolha um tipo de terreno para representar a sua origem: Neve, Desertos, Pântanos, Montanhas, Planícies, Cavernas, Florestas ou Praias. Quando em um desses terrenos ou suas variantes, você evita perigos e perigos evitam você. As árvores parecem guiar o seu caminho e os predadores se afastam.",
            "Criaturas mágicas desse local também podem te auxiliar, a depender do misticismo do local. Escolha também um traço físico na aparência do seu personagem que represente de onde ele veio. Podem ser coisas como um atributo animal, exemplo: manchas de leopardo na pele, olhos parecidos com o de um tigre, chifres de cervo, ou algo mais geral: cabelo como se fossem folhas secas, pele branca como a neve ou vermelha como o deserto. Isso é apenas um traço narrativo e de aparência e não deve conceder nenhum bônus prático ou mecânico."
        ],
        "requisitos": "Arquétipo Druida"
    },
    {
        "nome": "Metamorfose",
        "pontos": "0",
        "descricao": [
            "Você pode se transformar em qualquer animal natural do seu local de origem como uma ação grátis. Você pode se transformar até duas vezes por dia ou sessão (o que acontecer primeiro). O tipo de criatura que você irá assumir a forma depende do seu nível atual, onde:",
            "• Nível 1 e 2: Não são permitidas criaturas que voem ou nadem (como recurso primário);",
            "• Nível 3: Não são permitidas criaturas que voem (como recurso primário);",
            "• Nível 4: Qualquer animal conhecido ou estudado é permitido.",
            "Pontos importantes:",
            "• Os seus itens e possessões se transformam junto de você, transformando-se numa cópia perfeita desse animal.",
            "• Você ainda mantém seus atributos de combate como são, seus atributos-teste podem aumentar ou diminuir de acordo com o animal que assumir, e o quanto eles vão ser alterados é de critério do Mestre.",
            "Valores de Inteligência, Sabedoria e Carisma não devem mudar. É recomendado que o jogador e/ou o mestre anotem essas variações de atributos pra cada forma numa pequena lista para ficar fácil de ser lembrado. Recomenda-se que as variações sejam de +1 ou -1 nos atributos.",
            "• Ao assumir a forma animal, o druida ganha automaticamente as características naturais dessa criatura. Exemplo: capacidade de respirar em baixo d'água, voar, ter garras, penas, visão no escuro, etc.",
            "• O druida pode ter novas ações básicas nas suas formas animais, mas recomenda-se que isso seja discutido e decidido entre mestre e jogador. Um druida não pode usar suas técnicas ou habilidades mágicas enquanto transformado.",
            "• Um animal não pode ter técnicas e habilidades mágicas naturalmente, caso isso seja necessário, deverá ser estabelecida uma regra da casa entre mestre e jogador e decidido como será feito.",
            "• Um druida pode reverter a sua forma original como ação grátis à qualquer momento. A duração da transformação é igual a 1 hora.",
            "• Pede-se bom senso, descrição e fidelidade ao aspecto narrativo do mestre e do jogador ao lidarem com as formas e o combate. Um gato doméstico não deveria ser capaz de lutar contra um dragão, ou um cavalo não deveria ser capaz de derrotar um ogro meramente por conta dos seus atributos.",
            "• O druida pode gastar 10 minutos ou 1 rodada estudando um animal que ele possa ver, ouvir ou tocar (ou todas as opções) para então adicionar a forma do mesmo à sua lista de formas conhecidas.",
            "• O druida não pode falar ou fazer qualquer ação que tome como vantagem o uso de suas mãos ou habilidade motora se aquele animal não for capaz naturalmente disso. Isso inclui coisas como se transformar numa águia e tentar manipular com as patas uma faca da mesma forma que você manipularia da forma humana.",
            "• Um druida mantém suas vantagens e desvantagens quando se transformar, sejam elas de arquétipo, raça ou do personagem."
        ],
        "requisitos": "Arquétipo Druida"
    },
    {
        "nome": "Ascendência Elemental",
        "pontos": "0",
        "descricao": [
            "Ao criar o seu personagem, escolha um elemento. Você só poderá usar esse elemento até obter outras formas de manipular os que não detêm controle. Você pode usar esse elemento para qualquer coisa que desejar em questões interpretativas, como formar um cantil de gelo, um escudo temporário de pedra (para fins que não sejam de combate), uma corda de trovões para segurá-lo num penhasco ou mesmo um furacão de ar para prevenir que você e seus aliados recebam dano por queda numa situação especial.",
			"Esse efeito não pode ser usado em combate para causar dano direto, prevenir dano ou coisas do tipo. Esta vantagem só pode ser usada em, combate caso contribua com situações exclusivamente narrativas. O custo de MP ao usar essa vantagem fica a critério do Mestre."
        ],
        "requisitos": "Arquétipo Elementalista"
    },
    {
        "nome": "Espírito Elemental",
        "pontos": "0",
        "descricao": [
            "Esta vantagem usa o elemento escolhido pela vantagem anterior durante a criação do personagem (Fogo, Eletricidade, Ar, Gelo e Água, Bio ou Terra). Você pode ter um objeto que é sua posse inquestionável encantado para não poder ser utilizado por outras pessoas. Você pode definir as especificidades desse encantamento, mas como exemplos: uma espada encantada por água pode se desfazer e passar pelas mãos dos outros quando tentarem a segurar. Uma espada encantada por terra pode aumentar o próprio peso em várias toneladas. O fato é que se alguém que não for você tentar usar o item encantado, não vai poder.",
            "Os efeitos desse item devem ser mais narrativos do que qualquer outra coisa. Entretanto, caso o jogador queira unir esse artefato com alguma vantagem que permita a criação de um item, como \"Equipamento Lendário\" por exemplo, fica a seu critério."
			],
        "requisitos": "Arquétipo Elementalista"
    },
    {
        "nome": "Inventor",
        "pontos": "0",
        "descricao": [
            "Você pode criar uma invenção de tamanho pequeno / médio com  um único propósito objetivo e bem definido para justificar sua existência. Essa  invenção dura 1d4 horas ao seu lado e eventualmente para de funcionar, perdendo  seu funcionamento. A invenção não pode ser usada em combate e para  fins de testes sempre utilizam o atributo Inteligência, no valor sendo  igual ao do engenheiro que a criou. Sua resistência é baixa e qualquer  golpe simples a destrói facilmente. A invenção pode ter diversas funções  simples, como: iluminar uma área enquanto se move, funcionar como  um detector de metais, ser um sonar, servir café, aspirar pó, suportar  peso, etc. O engenheiro sempre tem pequenas peças desimportantes  em seus bolsos/mochila para criar uma invenção simples do tipo.",
            "O personagem pode fazer duas invenções pequenas e  simples por dia ou episódio (o que demorar mais para acontecer),  entretanto, elas não podem funcionar juntas ou serem criadas ao  mesmo tempo.",
            "O personagem pode sacrificar as duas invenções  e fazer uma invenção média no lugar, somente uma vez por dia ou episódio (o que demorar mais para acontecer). Uma invenção  média pode ter até duas funções que ficam ativas ao mesmo tempo e ela possui uma resistência maior, equivalendo à  5 pontos de HP e 1 RD geral, mas não pode ser usada em  combate como um integrante extra ou mesmo causar dano. Criar uma invenção leva certo tempo dependendo da função  dela e se é uma invenção simples ou média. Invenções médias levam mais tempo que as pequenas, e a quantia de tempo é estipulada pelo mestre, mas sempre deve ser superior à 20 minutos (ou 1 rodada dentro do jogo)."
        ],
        "requisitos": "Arquétipo Engenheiro"
    },
    {
        "nome": "Reação Improvisada",
        "pontos": "0",
        "descricao": [
            "Você quase nunca é pego de surpresa devido aos seus reflexos treinados. Quando alguém ou alguma criatura tentar te pegar ou te atingir de alguma forma, você ganha superioridade (veja o capítulo 5) na rolagem em questão.",
            "Adicionalmente, você também tem superioridade em testes com o atributo teste Agilidade sempre que envolver coisas como: reação ou reflexos."
        ],
        "requisitos": "Arquétipo Esgrimista"
    },
    {
        "nome": "Duelista",
        "pontos": "0",
        "descricao": [
            "Uma vez por sessão ou dia (o que demorar mais para acontecer) você pode desafiar um alvo específico para um duelo 1x1 onde ninguém mais poderá intervir. Esse duelo automaticamente passa de um combate clássico para um combate cinemático especial (ver regras e informações de C.E.C. no manual básico). Caso você ganhe o duelo, você recebe uma quantia bônus de experiência - a quantidade nesse bônus é critério do mestre."
        ],
        "requisitos": "Arquétipo Esgrimista"
    },
    {
        "nome": "O plano do estrategista",
        "pontos": "0",
        "descricao": [
            "O estrategista sabe muito bem o que faz e suas ordens são exatamente o que precisava ser feito. Sempre que personagens forem realizar passos de um plano que o estrategista definiu, eles recebem +1 em qualquer teste de Atributo-teste ou perícia."
        ],
        "requisitos": "Arquétipo Estrategista"
    },
    {
        "nome": "Ordens Superiores",
        "pontos": "0",
        "descricao": [
            "A presença física do estrategista não é necessária. Contanto que o estrategista tenha como saber o que está acontecendo e passar seus comandos, o estrategista pode participar de um combate. Dessa maneira, o estrategista não pode ser alvo de nenhum efeito e não pode realizar nenhuma ação que fosse exigir sua presença no local, mas pode continuar participando do combate como suporte."
        ],
        "requisitos": "Arquétipo Estrategista"
    },
    {
        "nome": "Gênio",
        "pontos": "0",
        "descricao": [
            "O estrategista não possui oponentes do seu próprio nível e nunca perde uma partida de jogos nos quais a estratégia seja decisiva, como Xadrez."
        ],
        "requisitos": "Arquétipo Estrategista"
    },
    {
        "nome": "Trabalhador",
        "pontos": "0",
        "descricao": [
            "Semanalmente o seu personagem pode dar o melhor de si para conseguir os melhores resultados para seu próprio trabalho. Em termos de jogo isso significa que toda vez que você fosse criar itens através do sistema de empregos (sistema opcional) você pode usar um \"efeito especial\" que permite ter um resultado otimizado e usar menos materiais que o normal. Esse efeito pode ser usado 4 vezes por semana e só vale para materiais do tipo: Madeira, Gemas e Minerais. Usar um efeito significa reduzir a quantia de materiais usados pela metade do que seriam usados normalmente."
        ],
        "requisitos": "Arquétipo Ferreiro"
    },
    {
        "nome": "A arte da criação",
        "pontos": "0",
        "descricao": [
            "Seus sentidos foram treinados além do normal quando o assunto é uma peça forjada seja por uma máquina ou a mão. Com isso, você ganha bônus de +4 em qualquer teste que envolver o reconhecimento de falsificações, origens de um objeto, saber sua função real ou possíveis habilidades escondidas e até mesmo a história do objeto (completa ou não, a critério do mestre)."
        ],
        "requisitos": "Arquétipo Ferreiro"
    },
    {
        "nome": "Reputação",
        "pontos": "0",
        "descricao": [
            "A vida de um gladiador é lutar, seja por algum ideal ou meramente por esporte e para provar-se forte. Com isso, a cada nível que o Gladiador ganhar, ele aumenta sua reputação base em +1. O Mestre pode dar pontos de reputação conforme desejar para esse personagem, como por exemplo, boa interpretação, não fugir de lutas, vencer lutas difíceis, etc. Um gladiador perde 1 ponto de reputação também quando o Mestre achar justo, como em derrotas em lutas importantes (ou qualquer luta), agir fora do personagem ou simplesmente fazer algo que afete sua reputação negativamente.",
            "Para cada ponto em sua reputação, o Gladiador se sente mais motivado, querido e capaz de fazer qualquer coisa, assim, ele reduz a dificuldade de testes de perícias e/ou atributos-teste num valor igual a metadte da reputação atual dele (arredondado para cima). Ter reputação não significa só ser conhecido pra um Gladiador, mas sim empenhar-se mais e treinar para corresponder as expectativas das histórias e canções sobre si. Quanto menor a reputação, menos motivado e concentrado um Gladiador está.",
            "Adicionalmente, um Gladiador pode conseguir descontos e redução de preço de itens em lojas ou vendedores em geral durante o jogo, de acordo com a sua reputação.",
            "A reputação máxima de um personagem deve ser 20, e a mínima 0. A forma que a reputação vai ser dada, retirada ou usada, depende muito da descrição do Mestre e também de um acordo prévio com o jogador. Essa vantagem fornece inúmeras possibilidades e ganchos interpretativos que podem enriquecer uma campanha e o desenvolvimento do próprio personagem."
        ],
        "requisitos": "Arquétipo Gladiador"
    },
    {
        "nome": "Mestre da Arena",
        "pontos": "0",
        "descricao": [
            "Você nunca está desprevenido num combate ou situação que exija uma ação drástica, você pode ir contra tudo e todos usando qualquer coisa ou qualquer tipo de arma. Em termos práticos, isso permite que o personagem ache / crie uma rápida arma simples e rústica para atender suas necessidades. A arma é sempre de nível 0 e usa o atributo apropriado / que mais fizer sentido."
        ],
        "requisitos": "Arquétipo Gladiador"
    },
    {
        "nome": "Lutador Natural",
        "pontos": "0",
        "descricao": [
			"Você luta da forma que pode, como pode, com quem pode e usando do que sabe. Um guerreiro é um lutador experiente que não precisa se ater em empregar só um tipo de tática ou uma arma, ele usará tudo ao seu dispor para vencer. O Guerreiro com essa vantagem começa com dois estilos de luta ao invés de um, em seu primeiro nível."
        ],
        "requisitos": "Arquétipo Guerreiro"
    },
    {
        "nome": "A Jornada do Herói",
        "pontos": "0",
        "descricao": [
            "Todo guerreiro tem um objetivo e morrer cedo não faz parte dos planos dele. Uma vez por sessão ou dia (o que acontecer primeiro), caso o Guerreiro caia para 30% do seu HP total, ele evoca todo o seu ser com o máximo de força de vontade que conseguir, recebendo superioridade (veja o capítulo 5 para maiores detalhes) nos dois próximos testes que fizer, seja em combate ou não.",
            "Esse efeito é cancelado caso o guerreiro seja curado para mais de 30% do seu HP antes de usar as rolagens. Ao mesmo tempo, caso o efeito se ative mas não seja usado parcial ou totalmente, ele é perdido."
        ],
        "requisitos": "Arquétipo Guerreiro"
    },
    {
        "nome": "Flagelo Vermelho",
        "pontos": "0",
        "descricao": [
            "Seus sentidos ficam extremamente mais apurados quando um alvo ou uma pessoa que está com ferimentos (e/ou sangrando) se localiza próxima ou numa distância considerável. Obedecendo a essas condições, você pode sentir o cheiro de tal alvo, saber a localização aproximada do mesmo e até saber dizer quão ferido ele (a) está e até onde poderia ir. Caso feche seus olhos, você abdica da sua visão geral, mas ganha uma forma de ver a silhueta do alvo com um tom vermelho vibrante e saber a direção onde ele está."
        ],
        "requisitos": "Arquétipo Hematologista"
    },
    {
        "nome": "Venábulo Carmesim",
        "pontos": "0",
        "descricao": [
            "Você consegue manipular o sangue como ninguém, e isso lhe permite moldá-lo em algum objeto desejado ou desenho / escritura qualquer. Adicionalmente, você pode usar quantias de sangue (sua ou de outra origem) como uma arma de nível 0 que utiliza o atributo Magia."
        ],
        "requisitos": "Arquétipo Hematologista"
    },
    {
        "nome": "Ás do Volante",
        "pontos": "0",
        "descricao": [
            "Seu foco é na sua armadura, mas um bom piloto é capaz de pilotar qualquer coisa. Quando utilizando Sistemas para pilotar qualquer máquina, receba +3 em quaisquer testes."
        ],
        "requisitos": "Arquétipo Homem de Lata"
    },
    {
        "nome": "Meu Melhor Amigo",
        "pontos": "0",
        "descricao": [
            "A armadura do Homem de Lata é seu bem mais precioso. Essa armadura é capaz de ter vários Acessórios e Equipamentos anexados a ela, se tornando parte dela e sendo facilmente acessíveis para o piloto. Efetivamente, a armadura funciona como uma mochila, com a exceção de que tudo está pendurado nela. Se você precisa da outra arma, a armadura engole a atual e a outra arma sai de outro compartimento. Isso significa que é igual à uma mochila sem limites, mas que só carrega itens do tipo Acessórios e Equipamentos (itens consumíveis, destrutivos, e outros não são incluídos). O personagem ainda tem sua própria mochila, fora de sua armadura."
        ],
        "requisitos": "Arquétipo Homem de Lata"
    },
    {
        "nome": "Fumaça e Espelhos",
        "pontos": "0",
        "descricao": [
            "“O que” você faz é menos importante do que o “Como” você faz. Por manter as pessoas em volta de si entretidas, o Ilusionista é capaz de realizar ações sem revelar suas intenções. Isso efetivamente permite que o Ilusionista consiga sucessos automáticos em testes de Ladinagem enquanto mantiver a atenção da audiência em outro lugar. Testes muito difíceis de Ladinagem têm a dificuldade levemente reduzida, ao invés de serem sucessos automáticos."
        ],
        "requisitos": "Arquétipo Ilusionista"
    },
    {
        "nome": "O Maior Truque",
        "pontos": "0",
        "descricao": [
            "Se os outros membros do grupo te ajudarem a montar um plano especial, você é capaz de participar de um combate tendo todos seus atributos de combate aumentados em +10. Exceto que você não pode causar danos ou efeitos de verdade em nenhum lugar! É tudo ilusão! Mas os inimigos não precisam saber disso, não é?"
        ],
        "requisitos": "Arquétipo Ilusionista"
    },
    {
        "nome": "Quando ninguém estava olhando",
        "pontos": "0",
        "descricao": [
            "No meio da confusão, é normal que as pessoas se esqueçam das coisas realmente importantes. Mas não o Ilusionista. A falta de atenção dos outros é justamente o que o Ilusionista usa. Assim sendo, o Ilusionista pode se aproveitar desses momentos para pegar algo “emprestado”. Durante uma sessão, caso o grupo se esqueça de algo, o Ilusionista pode realizar um teste de Ladinagem retroativo para ter pego essa coisa durante a última oportunidade, mesmo que o jogador do Mágico também tivesse se esquecido."
        ],
        "requisitos": "Arquétipo Ilusionista"
    },
    {
        "nome": "Ordem dos Inquisidores",
        "pontos": "0",
        "descricao": [
            "Você faz parte da milenar ordem dos Inquisidores. Precisar de ajuda é uma fraqueza vergonhosa, mas pedidos de ajuda em geral serão respondidos. Dependendo das circunstâncias, você também pode receber missões.",
            "Essa vantagem é opcional."
        ],
        "requisitos": "Arquétipo Inquisidor"
    },
    {
        "nome": "Fervor",
        "pontos": "0",
        "descricao": [
            "Você é capaz de manifestar um pequeno efeito sobrenatural garantido pela sua divindade, uma demonstração da sua força e treinamento como Inquisidor. Você pode evocar os seguintes efeitos:",
            "• Abrir ou fechar uma porta ou janela destrancada de forma violenta e instantânea;",
            "• Sua voz fica três vezes mais alta e forte que o normal por alguns 2 minutos;",
            "• Você pode fazer com que as luzes e chamas de um local fiquem piscantes, mais fracas, mais intensas ou mudem de cor por 1 minuto;",
            "• Você pode criar um som instantâneo em um ponto desejado da sua escolha, desde que você possa vê-lo. Exemplo: uma voz desconhecida, o barulho do vento, etc;",
            "• Você pode criar tremores inofensivos por 1 minuto;",
            "• Você pode parecer mais forte e intimidador do que realmente parece, por 1 minuto."
        ],
        "requisitos": "Arquétipo Inquisidor"
    },
    {
        "nome": "Intuição Divina",
        "pontos": "0",
        "descricao": [
            "Não existe \"escuro demais\" para você. Você enxerga perfeitamente bem em uma escuridão absoluta. Você possui um sexto sentido que não te deixa em paz enquanto magia negra estiver sendo realizada por perto. Sob a luz da sol, você pode enxergar um pentagrama na testa de uma pessoa que usou magia negra, mesmo que ela tenha feito isso apenas uma vez."
        ],
        "requisitos": "Arquétipo Inquisidor"
    },
    {
        "nome": "Humilhação inconsolável",
        "pontos": "0",
        "descricao": [
            "Se você falhar em destruir algum usuário de magia negra após tentar caçá-lo, a Fúria Divina te consumirá, pouco a pouco, com um ódio incontrolável. Quanto mais tempo você demorar para corrigir esse erro, pior fica. Eventualmente, você será incapaz de pensar em nada a não ser terminar o trabalho."
        ],
        "requisitos": "Arquétipo Inquisidor"
    },
    {
        "nome": "Convocação Extraplanar",
        "pontos": "0",
        "descricao": [
            "Você pode convocar uma criatura extraplanar / celestial / mágica / astral, e de outras categorias ao pagar um custo igual a 2 de MP.",
            "A criatura conjurada é tratada como se fosse uma arma de nível 1, sempre (portanto, essa criatura fica passível das escolhas de um único addon na lista de addons para equipamentos como um todo).",
            "A criatura também deve ter um atributo que a rege (dos atributos de combate);",
            "Uma criatura não tem o turno próprio, portanto ela é sempre comandada pelo Invocador Astral para fazer algo, no turno dele. E como é considerada uma arma pra termos técnicos do sistema, o Invocador pode \"usar\" a criatura conjurada em um ataque, mas perde os efeitos da atual arma equipada;",
            "Os addons dentro de uma criatura devem ser decididos na hora da criação do mesmos, exclusivamente.;",
            "Somente uma criatura pode estar ativa por vez;",
            "Invocar uma criatura é uma ação grátis durante o turno do Invocador, ou pode ser feita na fase de preparação de um combate;",
            "Novas criaturas podem ser adquiridas com o gasto de Pontos de Habilidade ou simplesmente usando uma técnica em branco para isso, com a escolha dos addons apropriados (Exemplo: Summon Ally, Sword of the Holy Titans, etc);",
            "O Invocador pode ter, no nível 1, somente uma criatura sob seu comando e essa deve ser especificada na ficha do personagem (o quê é, o que faz, se tem alguma história, e obviamente, o addon que usa);"
        ],
        "requisitos": "Arquétipo Invocador Astral"
    },
    {
        "nome": "Invocação Rápida",
        "pontos": "0",
        "descricao": [
            "Com o gasto de 2 de MP, o Invocador pode, por alguns segundos, conjurar uma criatura celestial / mágica / astral / extraplanar e de outras categorias para auxiliá-lo em uma tarefa ou causar algum efeito que tenha a ver com o conceito de tal besta. A criatura é conjurada e executa uma ação, depois sumindo quando completar o propósito pelo qual foi chamada.",
            "Exemplo: a conjuração de um leão mágico com asas poderia ser para carregar o grupo voando em direção de uma torre de magia distante, para depois desaparecer.",
            "Uma criatura nunca pode executar uma ação ou auxiliar de uma forma que ela naturalmente não seria capaz.",
            "Somente uma criatura pode ser conjurada por vez e caso o mestre decida vetar o uso da invocação ou de uma propriedade da besta, ele pode (desde que isso danifique o progresso da aventura ou quebre demais o jogo, facilitando muito)."
        ],
        "requisitos": "Arquétipo Invocador Astral"
    },
    {
        "nome": "O monstro acorda",
        "pontos": "0",
        "descricao": [
            "Dentro do personagem, vive um monstro incontrolável. Certas emoções fortes (definidas na criação do personagem) acordam esse monstro, transformando o personagem e alterando sua personalidade. Para a maioria das transformações, o personagem ainda exercerá um certo controle sobre o monstro, mas o mestre pode decidir que a emoção que transformou o personagem foi simplesmente forte demais e que, com isso, o monstro obtém controle completo, transformando o personagem em uma arma de destruição em massa sem mira.",
            "A descrição, personalidade e forma de agir desse monstro devem ser descritas na história do personagem. Enquanto transformado o personagem não é mais aquele de antes e agora pensa diferente, age diferente e acima de tudo: tem sede de destruição. Escolha uma opção abaixo:",
            "• Você ganha superioridade (ver capítulo 5) em testes de Agilidade e perícias relacionadas na primeira transformação do dia ou episódio (o que demorar mais pra acontecer);",
            "• Você ganha superioridade em testes de Força e perícias relacionadas na primeira transformação do dia ou episódio (o que demorar mais pra acontecer);",
            "• Você causa medo e insegurança para aqueles proximos de você, que recebem inferioridade (ver capítulo 5) no primeiro teste que fizerem contra o seu personagem, independente do que for. Não se aplica em combate;",
            "• Pode usar pontos de Stamina para se curar normalmente dentro do seu turno. Consome o turno. Só pode ser usada na primeira transformação do dia ou episódio (o que demorar mais pra acontecer);",
            "O monstro costuma dormir quando o que o acordou não existe mais, mas em situações mais intensas a transformação pode durar mais tempo. O jogador tem controle sobre quando \"O monstro acorda\", sendo quem julga se uma situação é boa o suficiente ou não. Caso o jogador queira, o personagem pode ter seus atributos de combate reduzidos a 0 enquanto o monstro estiver dormente."
        ],
        "requisitos": "Arquétipo Juggernaut, não ter escolhido \"Fúria é minha escolha, não uma doença\""
    },
    {
        "nome": "Fúria é minha escolha, não uma doença",
        "pontos": "0",
        "descricao": [
            "O personagem enfrentou o monstro e venceu, ou talvez tenha perdido e sido consumido por ele. Sua transformação passa a ser eterna e irreversível. A força e violência do personagem são claras para todos os que o vêem. O personagem passa a receber -2 em testes para convencer outros de que não é uma ameaça, mas +2 em testes de Intimidação onde usa sua natureza como ameaça. O monstro também pode escolher uma das vantagens a seguir:",
            "• O Maior Desafio: O personagem já enfrentou o que tem de pior no mundo. O personagem não sente mais medo nem é capaz de ter sua mente dominada ou encantada.",
            "• Indomável: Uma vez por sessão ou dia (o que demorar mais a acontecer), o personagem pode invocar os poderes do seu monstro interior para se liberar de qualquer coisa que o esteja prendendo através de força bruta física e de espírito."
        ],
        "requisitos": "Arquétipo Juggernaut, não ter escolhido \"O monstro acorda\""
    },
     {
        "nome": "Informantes",
        "pontos": "0",
        "descricao": [
            "Você sempre escuta o que lhe convém, podendo uma vez por sessão ou semana (o que demorar mais para acontecer) requisitar uma informação especial de sua escolha diretamente para o mestre.",
            "Essa informação pode chegar aos seus ouvidos por meio de conversas aleatórias de pessoas nas ruas ou mesmo pequenos informantes que podem vir a te conhecer / possuem um débito contigo."
        ],
        "requisitos": "Arquétipo Ladrão"
    },
    {
        "nome": "Malícia",
        "pontos": "0",
        "descricao": [
            "A sua carreira como Ladrão te ensinou muitas coisas, inclusive como salvar a sua própria pele de maneiras diferentes, enquanto mantém as riquezas debaixo da manga. Escolha somente um desses efeitos:",
            "• Experiente em Armadilhas: Você é capaz de analisar o ambiente e dizer se existem armadilhas ali. Pessoas normais acham isso impossível de ser feito, mas você não... Afinal, detectar armadilhas é o que te separa de ir pra cadeia, fugir ou perder uma mão. Quando você gastar 10 minutos ou 1 rodada observando uma área intensivamente (você precisa declarar isso ao mestre), role 1d10 + Sabedoria + Percepção, onde:",
            "• Resultado entre 1 e 5: Pergunte uma das questões abaixo ao mestre.",
            "• Resultado entre 6 e 14: Pergunte duas questões.",
            "• Resultado de 15+: Pergunte três questões.",
            "O mestre deve responder essas perguntas em particular para o Ladrão. Se o mestre desejar, ele não precisa responder exatamente com clareza, mas deve ser o suficiente para sanar o óbvio da pergunta. Perguntas:",
            "- Existem armadilhas por aqui?",
            "- O que a ativa?",
            "- É possível desativá-la?",
            "- Existe algo mais por aqui?",
            "- Existem portas escondidas?",
            "- Há alguém nos observando?",
            "• Língua Afiada: Uma vez por sessão ou dia (o que demorar mais pra acontecer), você pode mentir para um alvo desejado e fazer com que ele acredite em suas palavras. Você deve avisar o mestre que está usando essa vantagem para dar respaldo à sua fala. Mentiras muito absurdas falham automaticamente e não podem ser usadas nessa vantagem, então pede-se bom senso e criatividade do jogador em questão.",
            "Essa mentira pode ser revelada pela vantagem \"Vingador Sagrado\" de Paladino, tendo prioridade sobre a mentira.",
            "• Príncipe dos Ladrões: Você sempre está prevenido para as coisas ruins que podem vir a acontecer numa aventura. Com isso, ignore qualquer necessidade de ferramentas especiais para destrancar uma porta, baú, container ou armadilha; você sempre tem o que precisa para trabalhar. Adicionalmente, ganhe um bônus de +2 em testes de Prestidigitação."
        ],
        "requisitos": "Arquétipo Ladrão"
    },
    {
        "nome": "Passe de Mágica",
        "pontos": "0",
        "descricao": [
            "Todos os magos sabem alguns truques simples o suficiente para impressionar as pessoas quando necessário ou somente para ajudá-los a terem uma vida mais confortável durante o dia-dia. Você pode conjurar os seguinte efeitos abaixo:",
            "• Apagar ou acender instantaneamente uma vela, lanterna, tocha ou uma pequena fogueira;",
            "• Você pode aquecer, esfriar ou adicionar sabor à um objeto não-vivo de até 1 metro cúbico;",
            "• Você pode fazer uma marca, cor ou símbolo aparecerem na superfície de um objeto por 1 hora;",
            "• Você pode criar uma imagem ilusória do tamanho da sua mão por 5 minutos;",
            "• Você pode criar um efeito sensorial inofensivo, como o som de chuva e trovões, faíscas dançantes no ar, um cheiro esquisito ou uma corrente de vento inexistente.",
            "A quantidade de MP que cada efeito desses usa deve ser baixa ao ponto de serem quase insignificantes. Ainda assim, caso o Mestre queira taxar essas habilidades, ele poderia comprar algo em torno de 2 ou 3 pontos de MP.",
            "O personagem pode cortar o efeito de uma evocação quando desejar e pode usá-las em sequência se desejar e se for permitido."
        ],
        "requisitos": "Arquétipo Mago"
    },
    {
        "nome": "Olho Arcano",
        "pontos": "0",
        "descricao": [
            "Uma vez por episódio você consegue usar esse efeito e ver passagens secretas, armadilhas escondidas, pisos falsos, perigos naturais, objetos e criaturas invisíveis que são denunciadas por um acúmulo de energia arcana roxa. Adicionalmente, também é possível ver locais que tenham traços de magia ou uso de magia recente (de qualquer origem). Somente o personagem vê essas revelações. O efeito fica ativo por 5 minutos e não pode ser usado em combate."
        ],
        "requisitos": "Arquétipo Mago"
    },
    {
        "nome": "Puro",
        "pontos": "0",
        "descricao": [
            "Você recebe +3 em testes relacionados a convencer outras pessoas de que você não é uma ameaça ou não lhes deseja mal. Doenças, independente da origem, tem 50% de chance (1d100 <= 50) de não te afetarem, mesmo, ou até principalmente, se forem mágicas."
        ],
        "requisitos": "Arquétipo Mago Branco"
    },
    {
        "nome": "Fé Intensa",
        "pontos": "0",
        "descricao": [
            "Você possui uma fé muito forte dentro de si, seja em uma entidade específica ou em traços humanos abstratos (como força de vontade), e por isso a cada fim de episódio ganha +2 ponto de fé.  Um personagem começa a história com 3 pontos de fé e ganha mais 3 a cada término de sessão. Podendo acumular eles até qualquer quantidade. Pontos de fé podem ser acumulados e usados para fins específicos:",
            "- 1 Ponto: Escolha uma rolagem de Perícia e/ou Atributo-Teste. O resultado aumenta em +1. Se usando em uma rolagem sua, você deve usar a Fé antes de rolar o dado. Se usando em aliados, não tem problema usar depois da rolagem, entretanto, a rolagem do aliado ganha um bônus de +2 ao invés de +1. Não é possível gastar vários pontos de Fé para adicionar bônus ao mesmo teste. Só +1 e só uma vez.",
            "- 3 Pontos: Escolha um alvo (podendo ser você mesmo). Esse alvo é curado para 100% HP e 100% MP. Não pode ser usada em combate e não gasta Stamina."
        ],
        "requisitos": "Arquétipo Mago Branco"
    },
    {
        "nome": "Eu tenho a coisa certa",
        "pontos": "0",
        "descricao": [
            "Uma vez por episódio ou sessão (o que demorar mais para acontecer), você por acaso tem um pedaço de algum equipamento, item mudano ou mesmo consegue criar algo útil provindo do ambiente ou de uma criatura derrotada / morta. Criar ou ter esse objeto é um sucesso automático e uma ação grátis."
        ],
        "requisitos": "Arquétipo Mercante Príncipe"
    },
    {
        "nome": "Influência",
        "pontos": "0",
        "descricao": [
            "Você possui certa influência por incorporar o arquétipo do Mercante Príncipe, isso lhe permite vender ou comprar um item em qualquer lugar com um bônus de 20% de desconto/lucro sobre o preço de venda/compra."
        ],
        "requisitos": "Arquétipo Mercante Príncipe"
    },
    {
        "nome": "Corpo como um templo",
        "pontos": "0",
        "descricao": [
            "Runas espalhadas por todo o corpo do personagem, como tatuagens mágicas, o protegem de todo o mal que tenta invadir. O personagem recebe +3 em testes de resistência contra efeitos mágicos que tentem corromper seu corpo ou sua mente diretamente. O personagem não pode ter sua mente nem emoções lidas por efeitos mágicos. As runas entram na sua carne profundamente, mas se forem arrancadas de alguma forma esses efeitos são perdidos."
        ],
        "requisitos": "Arquétipo Mestre das Runas"
    },
    {
        "nome": "Preço do conhecimento",
        "pontos": "0",
        "descricao": [
            "O traumatizante processo de colocar as runas no corpo do personagem o alterou para sempre. Como um sobrevivente de uma tortura que mataria muitos guerreiros altamente treinados, o personagem nunca mais será o mesmo. Personagens que tentam ler as emoções do mestre das runas por meios não mágicos recebem -3 em seus testes, pois a verdade é que o mestre das runas já não possui muitas. Isso deve ser tratado como uma desvantagem para o mestre das runas e o narrador pode decidir aplicar um redutor de até -3 em todos os testes sociais nos quais isso seja relevante."
        ],
        "requisitos": "Arquétipo Mestre das Runas"
    },
    {
        "nome": "Mais uma proteção",
        "pontos": "0",
        "descricao": [
            "O mestre das runas pode aplicar suas runas a algum objeto, protegendo contra algum tipo de corrupção mágica específica. Essas runas são mais simples, não duram tanto e são destruídas já na primeira vez que lidarem com a maldição de que protegem, mas essa primeira maldição também será bloqueada completamente.",
            "Se aplicado a uma armadura, elas vão proteger o usuário da armadura. Quando aplicadas a outros itens, devem ser tratadas de forma apropriada, considerando-se que as runas atuam como um pára-raios. Tipos de corrupção mágica que podem ser escolhidas: veneno, invasão de mente. Em geral, qualquer coisa que fosse ser incluída em \"Corpo como um templo\" pode ser escolhida por \"Mais uma proteção\"."
        ],
        "requisitos": "Arquétipo Mestre das Runas"
    },
    {
        "nome": "Hamon",
        "pontos": "0",
        "descricao": [
            "Você consegue controlar uma energia sobrenatural presente em todos os seres vivos tendo como a respiração como canalizador principal. Por meditar fora de combate por 1 hora e gastar 1 ponto de Stamina você recupera seu HP e MP ao máximo. É necessário que o monge não seja perturbado durante esse tempo e que ele seja capaz de manter sua concentração durante 1 hora ininterrupta."
        ],
        "requisitos": "Arquétipo Monge"
    },
    {
        "nome": "Discplina do Punho de Ferro",
        "pontos": "0",
        "descricao": [
            "Quando não estiver com nenhuma arma equipada, os punhos do monge contam como duas armas de Nível 0 de uma mão que usam 1d6 como dano (+1 de dano cada)."
        ],
        "requisitos": "Arquétipo Monge"
    },
    {
        "nome": "Transcender - Andarilho dos Planos",
        "pontos": "0",
        "descricao": [
            "Uma vez por episódio ou dia (o que demorar mais para acontecer) você pode meditar durante alguns minutos e elevar seu estado de espírito para fora de seu corpo. Enquanto estiver assim, você pode caminhar livremente pelo plano astral / espiritual e procurar por algo que deseje, sejam isso uma resposta ou encontrar com alguém que já se foi. Além disso, seu corpo fica inerte num estado de sono profundo enquanto não estiver com o espírito nele, portanto, caso ele seja danificado de alguma forma, você não poderá se defender (e pode até morrer dependendo do caso). Caso seu corpo desfaleça enquanto estiver fora, seu espírito ficará preso pra toda a eternidade no plano astral."
        ],
        "requisitos": "Arquétipo Monge"
    },
    {
        "nome": "Transcender - Karma Espiritual",
        "pontos": "0",
        "descricao": [
            "Adicionalmente ao transcender original, você pode optar por não ir ao plano espiritual, mas sim trocar de corpo com um aliado ou alvo próximo (que esteja na sua linha de visão). Quando trocar de corpo, a alma do alvo vai para o seu corpo e a sua para o dele durante 10 minutos ou 1d4 rodadas. Caso seu corpo seja danificado ao ponto de não suportar mais conter vida dentro dele, você fica preso pra sempre no corpo atual em que estiver e a alma que estiver no seu, ficará perdida, vagando então como um espírito vingativo contra você pelo resto de sua vida também. Esse efeito não pode ser usado em combate e um alvo precisa ser susceptível espiritualmente para tal troca (critério do mestre). Este efeito não requer muita meditação (e talvez até nenhuma se for de acordo do jogador e mestre) e pode ser usado sem restrições de uso por episódio ou dias. Quando estiver no corpo de um alvo, você ganha as habilidades e potencialidades dele, mas não saberá o que ele pode fazer ou não (pois não retém as memórias e trejeitos do mesmo), mas poderá descobrir acidentalmente (ou não)."
        ],
        "requisitos": "Arquétipo Monge"
    },
    {
        "nome": "Copycat",
        "pontos": "0",
        "descricao": [
            "Você é um exímio observador frente às demonstrações de poder e força que acontecem próximas de você. O mímico pode improvisar em suas técnicas qualquer atributo de dano, mesmo que o atributo usado não tenha muito haver com a técnica em questão. (Exemplo: Utilizar uma técnica que claramente usa Arma como atributo de dano, baseado no guerreiro do grupo, mas usando seu atributo Tecnologia.)",
            "Além disso, o mímico pode ativar Estilos de Luta de aliados como se fossem seus. Quando copiando um estilo de luta, o Mímico copia todas as suas condições, áreas afetadas e efeitos."
        ],
        "requisitos": "Arquétipo Mímico"
    },
    {
        "nome": "Som Fantasma",
        "pontos": "0",
        "descricao": [
            "Você consegue reproduzir um som que você já tenha ouvido com extrema precisão com sua voz (pode ser uma voz de outra pessoa, som animal, ruído, assovio, etc)."
        ],
        "requisitos": "Arquétipo Mímico"
    },
    {
        "nome": "Pacto",
        "pontos": "0",
        "descricao": [
            "Você pode selar acordos com criaturas do tipo demônio, com as especificidades mudando caso à caso. Com um acordo selado, o demônio irá te ajudar em combates até o acordo terminar ou ser quebrado.",
            "Gaste 2 de MP e invoque uma criatura do caos, demônio, morto-vivo, fantasma ou algo do tipo.",
            "A criatura funciona exatamente como se fosse uma arma de nível 1, portanto, é passível de escolhas de addons para este tipo de equipamento em sua criação (somente na criação). A criatura também deve ter um atributo que a rege (dos atributos de combate);",
            "Uma criatura não tem o turno próprio, portanto ela é sempre comandada pelo Necromante para fazer algo, no turno dele, e como é considerada uma arma pra termos técnicos do sistema, o Necromante pode \"usar\" a criatura conjurada em um ataque, mas perde os efeitos da atual arma equipada;",
            "Um Necromante pode ter, no nível 1, somente um pacto feito com uma criatura e essa deve ser especificada na ficha do personagem (o quê é, o que faz, se tem alguma história, e obviamente, o addon que usa); Novos contratos podem ser feitos com o gasto de Pontos de Habilidade ou simplesmente usando uma técnica em branco para isso, com a escolha dos addons apropriados  (Exemplo: Summon Ally, Sword of the Holy Titans, etc);",
            "Somente uma criatura pode estar ativa por vez;",
            "Invocar uma criatura é uma ação grátis durante o turno do Necromante, ou pode ser feita na fase de preparação de um combate."
        ],
        "requisitos": "Arquétipo Necromante"
    },
    {
        "nome": "Ritual dos Mortos",
        "pontos": "0",
        "descricao": [
            "Você consegue montar e executar um ritual especial que leva cerca de 40 minutos para ficar pronto e necessita de materiais equivalentes a 100 Moedas de ouro x o Nível do personagem/NPC morto. Se o altar que você vai criar for destruído, o espírito desaparece. Esse ritual permite que você evoque uma figura específica já morta, seja um personagem, NPC importante ou qualquer outro que esteja morto. Para evocar o espírito é obrigatório que você use um osso ou objeto pessoal do morto em questão  além dos ingredientes básicos. O espírito convocado só pode ficar ativo por 3 minutos e possui uma forma de comunicação limitada, além de não poder se mover para qualquer lugar além das redondezas do local do ritual. Um espírito convocado não pode ser destruído de forma alguma e nem pode causar mal a qualquer um a sua volta (exceto em situações especiais)."
        ],
        "requisitos": "Arquétipo Necromante"
    },
    {
        "nome": "Acrobata Natural",
        "pontos": "0",
        "descricao": [
            "Uma vez por episódio você pode jogar novamente uma rolagem do atributoteste Agilidade ou qualquer perícia que use-a como atributo base e então, usar o resultado que mais lhe agradar."
        ],
        "requisitos": "Arquétipo Ninja"
    },
    {
        "nome": "Bomba de Fumaça",
        "pontos": "0",
        "descricao": [
            "Você possui sempre três bombas de fumaça pra usar por dia ou por sessão (o que demorar para acontecer mais) e no dia seguinte você refaz o estoque delas para essa quantidade máxima  com alguns momentos de preparo breve. Uma bomba de fumaça pode ser usada em combate e fora dela, e quando usada cria uma enorme cortina de fumaça cinzenta/branca que oculta totalmente quem estiver lá dentro (incluindo você). Portanto devido ao seu treinamento nessas situações, você ganha um bônus de +4 em todos os testes de Furtividade enquanto a bomba de fumaça durar (uma ação após o uso). Esses bônus só se aplicam a você e não são válidos em situações que não sejam oportunas, como por exemplo, usar a bomba se alguém já estiver te vendo ou conseguir te achar facilmente. Usar a bomba não consome seu turno."
        ],
        "requisitos": "Arquétipo Ninja"
    },
    {
        "nome": "Ordem dos Paladinos",
        "pontos": "0",
        "descricao": [
            "Você faz parte da milenar ordem dos Paladinos. Se você precisar de ajuda, eles responderão com outros guardiões, mas você também pode ser chamado. ",
			"Você pode seguiras regras de divindades conforme apresentado no arquétipo Clérigo, para então dar maiores detalhes e definições sobre a sua ordem e quedivindade ou conceito eles seguem.",
            "Essa vantagem é opcional. "
        ],
        "requisitos": "Arquétipo Paladino"
    },
    {
        "nome": "Vingador Sagrado",
        "pontos": "0",
        "descricao": [
            "Durante o dia, criaturas e personagens malignos são claramente visíveis para você, não importa onde estejam escondidas. Sempre que outro personagem tentar mentir para você sob a luz do Sol, você obtém sucesso automático para perceber a mentira e seu sexto sentido te faz saber quando há maldade na espreita. Injustos não podem se esconder da sua ira."
        ],
        "requisitos": "Arquétipo Paladino"
    },
    {
        "nome": "Penitência",
        "pontos": "0",
        "descricao": [
            "Qualquer Paladino que se corrompa ou se torne maligno perde todos os seus poderes e só pode recuperá-los se fizer penitência. Se fizer parte da Ordem, também será caçado."
        ],
        "requisitos": "Arquétipo Paladino"
    },
    {
        "nome": "Poder Resoluto",
        "pontos": "0",
        "descricao": [
            "Uma vez por episódio e com o custo de 50% de seu MP total, você pode usar seu poder máximo e queimar sua essência na sua totalidade por um breve momento de força interna, aumentando todos os atributos de teste em +2 pontos e concedendo um bônus de +2 em todas as perícias enquanto esse efeito limitado durar."
        ],
        "requisitos": "Arquétipo Paladino"
    },
    {
        "nome": "Presença Intimidadora",
        "pontos": "0",
        "descricao": [
            "Você é um combatente impiedoso por natureza (geralmente) e isso faz com que as pessoas temam sua reputação. Você ganha leves descontos em estabelecimentos e vendedores que sejam coagidos por um teste de intimidação bem sucedido. Eles também podem providenciar informações extras que você busque com maior facilidade."
        ],
        "requisitos": "Arquétipo Pirata"
    },
    {
        "nome": "Vida de Corsário",
        "pontos": "0",
        "descricao": [
            "Por ser um aventureiro de espírito livre e boêmio por natureza, você gosta muito de bares, tavernas e lugares do tipo onde pode comer e beber bem. Você sempre tem alguma amizade ou conexão nesses lugares, fazendo com que a estadia, o consumo de bebidas e comidas para si e seus aliados seja totalmente gratuita ou de preço muito reduzido do normal (à critério do mestre). Adicionalmente, ganhe +1 stamina toda vez que passar uma noite ou descansar completamente nesses lugares. Essa vantagem não implica numa conexão ou fama por que você é extrovertido ou algo do tipo, meramente significa que é conhecido / frequentador de tal lugar e por isso é bem-vindo."
        ],
        "requisitos": "Arquétipo Pirata"
    },
    {
        "nome": "Porta Dimensional",
        "pontos": "0",
        "descricao": [
            "Uma vez por  episódio você tem a possibilidade de desenhar uma porta em qualquer superfície que permita desenhos, através de um giz branco ou algo do tipo. Ao desenhar uma segunda porta em outro lugar, você cria uma conexão entre os dois lugares com os desenhos, permitindo assim abri-las e viajar através de uma fenda temporal que conecta os locais. Embora tenha um longo alcance, o mestre dirá se ambos os locais foram conectado com sucesso ou não (locais muito distantes um dos outros tendem a ter conexões mais fracas). Qualquer pessoa pode usar esse mecanismo, entretanto, somente você pode abrir e destruir as portas (a não ser que o local onde ela fora desenhada, seja destruído também)."
        ],
        "requisitos": "Arquétipo Sabotador"
    },
    {
        "nome": "Sorvedouro Fantasma",
        "pontos": "0",
        "descricao": [
            "Uma vez por episódio você pode gastar metade do seu MP total e causar uma intensa desestabilização nas suas proximidades, desativando todos e qualquer aparato tecnológico, mágico e negando certos encantamentos ativos (não funciona dentro de combate). Embora possua uma grande força, esse efeito nem sempre pode funcionar com todos os tipos de máquinas ou energias mágicas."
        ],
        "requisitos": "Arquétipo Sabotador"
    },
    {
        "nome": "Postura Rígida",
        "pontos": "0",
        "descricao": [
            "Você possui a habilidade de reagir ao perigo antes mesmo dos seus sentidos normalmente permitirem. Com isso, sempre que você fosse ser pego de surpresa,  você é tratado como setivesse em uma categoria abaixo para testes relacionados à surpresa ou a reagir contra algo que acabou  de aparecer ou acontecer. Em termos práticos, isso significa que para você, os testes relacionados aos eventos citados acima, são mais fáceis em uma categoria (da lista de dificuldades sugeridas, que pode ser encontrada no manual básico)."
        ],
        "requisitos": "Arquétipo Samurai"
    },
    {
        "nome": "Corte de Alta Frequência",
        "pontos": "0",
        "descricao": [
            "Quando você realizar um teste para quebrar ou cortar algum objeto usando sua arma, adicione +4 à rolagem. Esse corte, diferentemente dos cortes normais, atravessa e abre caminho em metais ou materiais de extrema resistência que não poderiam ser cortados normalmente.", 
            "Não pode ser usado em combate."
        ],
        "requisitos": "Arquétipo Samurai"
    },
    {
        "nome": "Domar Bestas",
        "pontos": "0",
        "descricao": [
            "Você pode domar um animal com um teste bem sucedido de Natureza. Animais hostis precisam ser acalmados antes de serem domados.",
            "O animal é como uma Arma de nível 1, sempre;",
            "Você pode começar a história com um Animal de Nível 1 ao seu lado;",
            "Você também pode utilizar as vantagens Equipamento de Valor Emocional e Equipamento Lendário no seu animal;",
            "Animais sempre acompanham o Senhor das Bestas, e ao contrário de Necromantes e Invocadores Astrais, não requerem gasto de MP para serem usadas."
        ],
        "requisitos": "Arquétipo Senhor das Bestas"
    },
    {
        "nome": "Empatia Natural",
        "pontos": "0",
        "descricao": [
            "Você consegue se comunicar com criaturas e animais, podendo compreender a linguagem delas, desde que tenham uma inteligência mínima. Os animais também geralmente compreendem seus sentimentos e motivos mais facilmente que outras pessoas."
        ],
        "requisitos": "Arquétipo Senhor das Bestas"
    },
    /* Vantagens Comuns */
    {
        "nome": "Alerta Constante",
        "pontos": "3",
        "descricao": [
            "Receba +4 em quaisquer testes de Percepção para perceber uma emboscada ou algum tipo de cilada.",
            "Mesmo que você falhe em perceber um ataque surpresa, você ainda pode agir na rodada de Surpresa, sendo o último a realizar ação durante ela."
        ]
    },
    {
        "nome": "Aliado",
        "pontos": "2",
        "descricao": [
            "Um aliado ou amigo que te ajuda (e pode pedir ajuda também). Você pode ter NPCs em sua história e tudo, mas ele não será necessariamente relevante para a história se você não comprar essa vantagem."
        ]
    },
    {
        "nome": "Aliados",
        "pontos": "3 ou 5",
        "descricao": [
            "O personagem possui uma quantia de aliados NPCs (personagens do mestre) que estarão à disposição dele para ajudá-lo. Os aliados não podem entrar em combate direto e acompanhar o grupo toda hora, mas podem ajudar de alguma forma que o mestre decida. Os aliados possuem suas próprias vidas e nem sempre poderão acompanhar o personagem também.",
            "O jogador deve explicar o motivo desses aliados se unirem a ele. Você pode ter outros aliados na sua história de personagem, mas eles só serão obrigatoriamente relevantes à história através dessa vantagem. Ao fazer parte do grupo ou organização que os aliados são provenientes, o personagem está susceptível às vantagens e desvantagens que eles podem causar.",
            "3 Pontos: Um grupo/organização de tamanho mediano.",
            "5 Pontos: Um grupo/organização bem grande, importante e influente."
        ]
    },
    {
        "nome": "Alma Pura",
        "pontos": "3",
        "descricao": [
            "Você é imune aos efeitos de maldições, venenos, seu sangue é venenoso como água benta aos vampiros e você ainda é capaz de sentir a aproximação de objetos ou seres malignos (não exatamente onde estão, apenas que estão por perto). Sua presença é o suficiente para aterrorizar criaturas das trevas.",
            "Caso você se corrompa precisará pagar uma penitência para recuperar essa vantagem, que vai depender da gravidade da corrupção."
        ]
    },
    {
        "nome": "Alta Resistência a Dor",
        "pontos": "2 ou 4",
        "descricao": [
            "O personagem é capaz de resistir melhor quando dor é utilizada como uma arma contra ele. Em testes para resistir enquanto está sendo machucado ou torturado, o personagem recebe superioridade em rolagens de Força de Vontade (FV). Pagando 4 pontos por essa vantagem, a vontade do personagem é inquebrável e o personagem nunca se rende à dor."
        ]
    },
	{
        "nome": "Analista",
        "pontos": "2",
        "descricao": [
            "Você é extremamente observador e detalhista sobre as pessoas e coisas a sua volta. Numa olhada rápida em alguém ou algo, você consegue descrever três detalhes marcantes do seu alvo ou três perícias na qual ele tenha mais pontos (se for alguém vivo).",
            "A quantidade de vezes que você pode usar essa vantagem depende do mestre, mas não deve levar muito tempo entre uma observação ou outra. Naturalmente, você precisa de um tempo entre observações."
        ]
    },	
    {
        "nome": "Anfíbio",
        "pontos": "1 ou 2 Pontos",
        "descricao": [
            "O personagem possui traços de criaturas aquáticas dentro de si (e não necessariamente na sua fisiologia externa).",
            "1 Ponto: Permite que o personagem ganhe superioridade em testes de atletismo quando tratando de natação.",
            "2 Pontos: Permite que o personagem respire debaixo d’água e ganhe superioridade em testes de atletismo quando tratando de natação."
        ]
    },
    {
        "nome": "Anti-machucados",
        "pontos": "1",
        "descricao": [
            "O personagem é muito vaidoso e treinou para não ganhar muitos ferimentos. Efetivamente, o personagem é capaz de evitar ataques até se cansar demais, e esses machucam muito mesmo. O personagem perde HP normalmente, mas na narrativa ele não é acertado em nenhum ataque que não entre em dois pontos: o ataque que o deixou com menos da metade do HP o terá acertado, e o ataque que o nocauteou o terá acertado.",
            "Essa vantagem é útil para histórias em que os machucados serão realistas, pois personagens irão se machucar seriamente com menos frequência e não passarão metade da história num hospital ou se recuperando. Independente do caso, o mestre pode considerar ataques que “erram” como raspões que causam machucados pequenos e irrelevantes, mas os golpes que “acertam” aos 50% e 0% HP devem ser maiores do que o normal, algo como um crítico."
        ]
    },
    {
        "nome": "Aparência",
        "pontos": "1 ou 3",
        "descricao": [
            "O personagem é belo e possui traços relativamente acima da média para a sua raça, encantando até aqueles que não simpatizam muito com determinada raça. Essa vantagem aumenta sua Carisma em 1 a 3 pontos quando considerando aparência. Isso significa que um personagem com Carisma 3 e Aparência 3 teria um valor de aparência final de 6.",
            "Esse bônus em carisma só é considerado em testes de Sedução, mas pode ser utilizado em outros lugares à escolha do mestre. Assuma que esse bônus não será adicionado em testes de Diplomacia, Manha ou Blefe quando Sedução não está sendo feita."
        ]
    },
    {
        "nome": "Atalho",
        "pontos": "2",
        "descricao": [
            "O personagem conhece atalhos diversos e mesmo que não seja familiarizado com o local em questão, consegue rastrear rotas alternativas com maior facilidade que os outros. Em testes de Percepção ou Rastreamento para encontrar um caminho alternativo ou atalho, adicione um bônus de +2 em suas rolagens."
        ]
    },
    {
        "nome": "Biblioteca",
        "pontos": "1 ou 3",
        "descricao": [
            "O personagem possui acesso a uma quantidade enorme de informação que quase sempre pode responder suas questões. Isso pode ser um lugar, uma coisa ou uma pessoa.",
            "1 Ponto: Sua biblioteca está em um lugar meio fixo, você só precisa ir até lá.",
            "3 Pontos: Sua biblioteca está sempre (ou quase sempre) ao seu lado.",
            "Utilizar a biblioteca é um Sucesso Automático para testes de conhecimento com dificuldade de até 10. A biblioteca é inútil para qualquer coisa além disso.",
            "Portanto, uma biblioteca tem muita informação até chegar ao ponto em que é uma informação secreta ou que realmente não está disponível para qualquer pessoa."
        ]
    },
    {
        "nome": "Boa Fama",
        "pontos": "2",
        "descricao": [
            "O personagem possui reconhecimento por onde passa seja por algum ato heróico ou um grande feito do passado que o envolva ou tenha presenciado. Você ganha reputação com NPCs mais facilmente. O jogador deve especificar o motivo da boa fama na história do personagem."
        ]
    },
    {
        "nome": "Bruto",
        "pontos": "1",
        "descricao": [
            "O personagem é naturalmente bruto, no sentido físico da coisa. Ao fazer uma demonstração qualquer de sua força (como esmagar um objeto, quebrar algo ou o que for), você pode usar sua Força (FOR) como modificador em testes para Intimidação, ao invés de Carisma (CAR)."
        ]
    },
    {
        "nome": "Bugigangas",
        "pontos": "5",
        "descricao": [
            "Até uma vez por sessão, você pode puxar uma pequena maquina que você fez/achou/conseguiu e utilizar ela para a situação. Obviamente, se você foi livrado de todas suas possessões, essa máquina não estaria disponível.",
            "Essa máquina deve fazer uma única coisa bem simples e só funciona uma vez, quebrando logo em seguida. Exemplos: uma pequena bomba capaz de derrubar paredes, um telefone especial capaz de ultrapassar quaisquer bloqueios, botas adesivas que o permitem andar pelo teto por um curto período."
        ]
    },
    {
        "nome": "Calmo",
        "pontos": "1",
        "descricao": [
            "O personagem quase nunca sai do controle, sempre permanece calmo. Isso o auxilia muito em situação de desespero, que levariam a penalidades. O personagem apenas não as sofre."
        ]
    },
    {
        "nome": "Caminhando nas Sombras",
        "pontos": "2",
        "descricao": [
            "O personagem é treinado em se esconder e usar as sombras ao seu favor. Quando rolando um teste de Furtividade pra se esconder ou camuflar-se em algum local com sombras, você passa automaticamente no teste desde que a dificuldade seja até 8. Caso você seja do Arquétipo Ladrão, Sabotador ou Assassino, reduza o custo dessa perícia para 1 ponto."
        ]
    },	
    {
        "nome": "Ciência da Informação",
        "pontos": "1",
        "descricao": [
            "Você trata contatos e informação como um produto, comprando e vendendo com cuidado. Arquivando, calculando e pensando em tudo como se fosse um pesquisador.",
            "Você pode utilizar Inteligência no lugar de Carisma para um teste de conseguir informações nas ruas, ouvir fofocas, boatos e rumores pelos locais onde visitar."
        ]
    },
    {
        "nome": "Conhecido Interessante",
        "pontos": "0",
        "descricao": [
            "Você tem ou teve contato de algum tipo com algum personagem importante de Arcos / campanhas anteriores e pode desenvolver isso de alguma forma na sua história.",
            "Envolver um personagem antigo em sua história muito provavelmente vai exigir aprovação do mestre e/ou do criador daquele personagem, dependendo de como você o incluiu - é importante garantir que o personagem não tome um rumo não desejado."
        ]
    },
    {
        "nome": "Contatos",
        "pontos": "2 ou 3",
        "descricao": [
            "O personagem possui um contato especial que está disposto a ajudá-lo de alguma forma em eventos esporádicos desde que também seja ajudado em certos momentos. O jogador deve especificar quem é o contato do personagem e porque esse contato o ajuda, assim como a natureza da ajuda prestada.",
            "2 pontos: 1 contato",
            "3 pontos: até 2 contatos"
        ]
    },
    {
        "nome": "Controle Emocional",
        "pontos": "3",
        "descricao": [
            "Por algum motivo, você pode controlar e inserir emoções em outras pessoas. Com um leve esforço, você pode deixar alguém realmente feliz ou realmente triste. Utilizar isso muda as variáveis e pode trazer certos testes sociais em seu favor... Ou ajudar uma situação desejada a acontecer.",
            "Você deve realizar um teste de 1d6 + 3 contra 4 + Força de Vontade do alvo. Uma falha significa que ele percebeu algo tentando mexer com a cabeça dele e conseguiu resistir. Depois de uma falha, tentativas novas não são possíveis."
        ]
    },
    {
        "nome": "Corajoso",
        "pontos": "1 ou 2 ou 3",
        "descricao": [
            "O personagem ganha um bônus de +1 nos testes de medo e insanidade. Se gastar mais pontos de vantagem, ganha +1 para cada ponto gasto, até um máximo de +3 (3 pontos)."
        ]
    },
	{
        "nome": "Curandeiro",
        "pontos": "2",
        "descricao": [
            "O personagem tem aptidão natural com a medicina e procedimentos de primeiros socorros. Quando utilizando bandagens ou alguma ferramenta que ajude um personagem ferido à se estabilizar, o personagem ganha superioridade nos testes de Socorro."
        ]
    },	
    {
        "nome": "Defesa Mental",
        "pontos": "1 ou 2 ou 3",
        "descricao": [
            "O personagem possui uma alta resistência mental contra certos ataques psíquicos ou mágicos. Isso funciona como um bônus adicionado a testes de Força de Vontade quando sendo atacado por algo assim e o tamanho do bônus varia de acordo com a quantidade de pontos gasta.",
            "1 ponto: Recebe um bônus de +1 no testes contra ataques mentais.",
            "2 pontos: Recebe um bônus de +2 no testes contra ataques mentais.",
            "3 pontos: Recebe um bônus de  +3 no testes contra ataques mentais."
        ]
    },
    {
        "nome": "Defesas Naturais",
        "pontos": "1",
        "descricao": [
            "Através de treinamento, tendo enfrentado usuários desse tipo de poder, algum poder mágico ou até mesmo algo que simplesmente faz parte do seu corpo, você possui uma defesa elevada contra certos tipos de ataque. Escolha um atributo de dano. O atributo de dano escolhido está sempre protegido, mesmo que você não esteja usando armaduras. Contra ataques de um atributo de dano protegido, você recebe +1 RD Específica para a sua defesa contra ele. Um atributo não pode ser protegido várias vezes. Defesas naturais pode ser comprada várias vezes, sempre para atributos de dano diferentes."
        ]
    },
    {
        "nome": "Deus Grego",
        "pontos": "1 ou 3",
        "descricao": [
            "O personagem possui um corpo perfeito, bem acima da média para sua raça.",
            "1 Ponto: Você pode usar Constituição no lugar de Carisma quando se tratando de Aparência. Isso também vale para testes de sedução.",
            "3 Pontos: Mesma coisa que o de cima, mas você usa (Constituição + 2) ao invés de Constituição. De novo, apenas para questões de aparência."
        ]
    },
    {
        "nome": "Direção Absoluta",
        "pontos": "2",
        "descricao": [
            "O personagem dificilmente se perde, como se tivesse uma bússola embutida no cérebro, sempre sabe onde é o norte, voltar pelo caminho que fez, etc. O personagem ganha sucesso automático em testes para encontrar o caminho ou direção de até dificuldade 10, recebendo um superioridade em testes com dificuldades maiores."        
		]
    },
    {
        "nome": "Disposofobia",
        "pontos": "2",
        "descricao": [
            "Você carrega um monte de tranqueiras aparentemente inúteis, mas que podem ajudar o grupo em alguma situação (lápis, caderno, pilhas, lanterna, pá, corda, sinos ou outros objetos que ninguém lembrou de pegar). Quando necessário, você pode puxar um desses itens. Essa vantagem não funciona se vilões limparam os personagens de seus pertences.",
            "O mestre pode restringir essa Vantagem caso o jogador tente abusar dela."
        ]
    },
    {
        "nome": "Duro de Matar",
        "pontos": "3",
        "descricao": [
            "Você é mais resistente ou tem uma força de vontade elevada que o faz continuar levantando quando outros já teriam desistido.",
            "Aumente seu HP Máximo em 2 pontos."
        ]
    },
    {
        "nome": "Empatia com Animais",
        "pontos": "3",
        "descricao": [
            "Animais selvagens não atacam o personagem a menos que ele os ataque primeiro e ele pode tentar controlar um animal selvagem com um teste de Natureza. O personagem recebe superioridade em testes que envolvam lidar com animais diversos."
			]
    },
	{
        "nome": "Engenheiro de Masmorras",
        "pontos": "3",
        "descricao": [
            "Você é um expert e conhecedor de masmorras, castelos, calabouços e afins quando se diz a respeito de armadilhas e passagens secretas. Ganhe superioridade em testes de Percepção e Inteligência para encontrar a presença de passagens secretas.",
            "Armadilhas que forem te causar dano ganham inferioridade nas rolagens de dano. Se o seu arquétipo for Ladrão, você pode comprar essa vantagem por 2 pontos."
        ]
    },
    {
        "nome": "Equipamento Épico",
        "pontos": "1 ou 2",
        "descricao": [
            "Você possui uma peça de equipamento poderosa para você e sua história, além de ter um significado grande para algum acontecimento ou para alguém. Esses equipamentos não mudam de nível, mas são sempre de nível 2 (portanto, possuem 2 slots de addons) e são criados por você. Esses equipamentos não mudam de nível. Você pode comprar Equipamento Épico várias vezes, mas ela não se acumula no mesmo equipamento.",
            "O custo dessa vantagem varia com o tipo do equipamento criado:",
            "1 Ponto: Arma Defensiva",
            "1 Ponto: Arma de uma mão",
            "2 Pontos: Arma de duas mãos",
            "2 Pontos: Armadura.",
            "Você pode pegar essa vantagem várias vezes, mas para equipamentos diferentes. Veja as “Regras para Equipamento Épico, Lendário, Natural, de Valor Sentimental e X” na página 236 para saber como proceder ao comprar essa vantagem."
	     ]
    },
    {
        "nome": "Equipamento Lendário",
        "pontos": "2 ou 4",
        "descricao": [
            "Você possui uma peça de equipamento incrivelmente rara e poderosa. Esse equipamento sempre será de nível 3 (portanto, possui 3 slots de addons)  e são criados por você. Esses equipamentos não mudam de nível. Você pode comprar Equipamento Lendário várias vezes, mas ela não se acumula no mesmo equipamento.",
            "O custo dessa vantagem varia com o tipo do equipamento criado:",
            "2 Ponto: Arma Defensiva",
            "2 Ponto: Arma de uma mão",
            "4 Pontos: Arma de Duas Mãos",
            "4 Pontos: Armadura",
            "Você pode pegar essa vantagem várias vezes, mas para equipamentos diferentes. Veja as “Regras para Equipamento Épico, Lendário, Natural, de Valor Sentimental e X” na página 236 para saber como proceder ao comprar essa vantagem."       
		 ]
    },
    {
        "nome": "Equipamento de Valor Emocional",
        "pontos": "1",
        "descricao": [
            "Você possui uma peça de equipamento muito importante para você e sua história. Ela pode não ser a melhor de todas, mas você vai se esforçar e fazer ela funcionar. Esses equipamentos não mudam de nível. Você pode comprar Equipamento de Valor Emocional várias vezes, mas os equipamentos ganhos ainda serão nível 1 (portanto, possui 1 slot de addons).",
            "O custo dessa vantagem varia com o tipo do equipamento criado:",
            "1 Ponto: Arma Defensiva + Arma de uma mão",
            "1 Ponto: Duas armas de uma mão",
            "1 Ponto: Arma de duas mãos",
            "1 Ponto: Armadura.",
            "Você pode pegar essa vantagem várias vezes, mas para equipamentos diferentes. Veja as “Regras para Equipamento Épico, Lendário, Natural, de Valor Sentimental e X” na página 236 para saber como proceder ao comprar essa vantagem."      
		  ]
    },
    {
        "nome": "Equipamento Natural",
        "pontos": "1",
        "descricao": [
            "Sua espécie (ou você em particular), o que precisa ser explicado, possui defesas naturais que te ajudam em combate. Para cada vez que comprar essa vantagem, o seu personagem ganha equipamentos que fazem parte do seu corpo, significando que só podem ser removidos ao ser desmembrado.",
            "Os equipamentos criados por essa vantagem são sempre de nível 1. Essa vantagem pode ser comprada várias vezes.  Equipamentos ganhos (apenas um):",
            "Uma arma de duas mãos",
            "Duas armas de uma mão",
            "Uma arma de uma mão e uma defensiva",
            "Uma armadura"
        ]
    },
    {
        "nome": "Equipamento X",
        "pontos": "1",
        "descricao": [
            "Você possui equipamentos que fazem parte do seu corpo (você pode fazer uma descrição para encaixar com isso). A vantagem se resume a nunca estar desarmado.",
            "Você pode escolher qualquer quantidade de equipamentos que você tenha na sua ficha no momento de criação dela, podendo ser equipamentos comprados na loja ou equipamentos criados com vantagem. Esses equipamentos passam a fazer parte do corpo de seu personagem e não podem ser desequipados sem desmembrá-lo.",
            "Você pode (e deve) alterar as descrições desses \"equipamentos\" para algo que encaixe com essa vantagem. Um personagem orgânico provavelmente teria armas naturais. Um personagem robô talvez simplesmente tivesse a arma encaixada ali. Fazer upgrades nessas armas durante a história pode ser algo muito traumático para o personagem caso o equipamento seja uma arma natural dele. É recomendável que mestres explorem uma situação assim.",
            "Exemplo: Cria-se uma arma de duas mãos para Magia com Equipamento de Valor Sentimental e usa-se Equipamento X para transformá-la em uma Antena que atira raios. O custo final das duas vantagens juntas é 2.",
            "Exemplo 2: Criam-se duas armas para o atributo Arma com Equipamento Lendário e usa-se Equipamento X para transformá-las em duas garras que saem dos punhos. O custo final das duas vantagens juntas é 5.",
            "Você pode pegar essa vantagem várias vezes, mas para equipamentos diferentes. Veja as “Regras para Equipamento Épico, Lendário, Natural, de Valor Sentimental e X” na página 236 para saber como proceder ao comprar essa vantagem."
			]
    },
    {
        "nome": "Espírito Inabalável",
        "pontos": "5",
        "descricao": [
            "Nada te põe para baixo! Aumente sua Força de Vontade em +1. Toda vez que você dormir, você começa o dia com +1 ponto de Stamina além do seu limite normal.",
            "Essa vantagem também aumenta a quantidade de Stamina que você tem disponível em PVP."
        ]
    },
    {
        "nome": "Estômago de Ferro",
        "pontos": "1",
        "descricao": [
            "Personagem é imune a venenos, a intoxicação ou qualquer tipo de dano via comida."
        ]
    },
    {
        "nome": "Estranho Misterioso",
        "pontos": "3",
        "descricao": [
            "O personagem é ajudado eventualmente por um misterioso estranho que nunca se revela. Essa ajuda pode ser de qualquer tipo e a qualquer hora. Diferentemente da vantagem \"aliado\", um estranho misterioso não pode ser consultado, achado ou revelado."
        ]
    },
    {
        "nome": "Estranho no Ninho",
        "pontos": "1",
        "descricao": [
            "Seu personagem cresceu no meio de uma cultura incomum para a sua raça. O personagem aprende a língua de uma outra raça (desde que essa tenha uma língua básica a ser aprendida - verifique na página de cada raça para ver qual língua cada raça possui acesso)."
        ]
    },
    {
        "nome": "Eterno Aprendiz",
        "pontos": "3",
        "descricao": [
            "Você entende a importância do aprendizado e presta mais atenção em tudo que você faz. Durante a criação da ficha, você ganha 2 pontos extras para distribuir em Perícias. Além disso, a cada nível você ganha 1 ponto extra para distribuir em Perícias."
        ]
    },
    {
        "nome": "Existência Kármica",
        "pontos": "2",
        "descricao": [
            "O personagem é regido pelo Karma com uma força muito maior do que o normal. Faça coisas boas e coisas boas acontecem para você, mas faça coisas ruins e o Karma vai acabar te matando."
        ]
    },
    {
        "nome": "Familiares",
        "pontos": "2",
        "descricao": [
            "O personagem possui uma pequena criatura (animal, espírito, capetinha, etc.) inteligente, que o segue para todos os lugares, entende comandos simples e pode levar mensagens por ele. Escolha até 2 atributos-teste. O familiar é capaz de realizar tarefas simples em relação a esses atributos.",
            "Coisas como \"Força\" permitindo que ele mova caixas e \"Agilidade\" que ele passe despercebido."
        ]
    },
    {
        "nome": "Flexibilidade",
        "pontos": "1",
        "descricao": [
            "O personagem ganha +2 nos testes para escapar de agarrões, entrar em locais estreitos, e fazer tarefas onde a flexibilidade conta."
        ]
    },
    {
        "nome": "Força Descomunal",
        "pontos": "3",
        "descricao": [
            "Você tem mais força do que o normal. Aumente sua força em +1, podendo ultrapassar o limite de 5 iniciais."
        ]
    },
    {
        "nome": "Formas Múltiplas",
        "pontos": "2",
        "descricao": [
            "O personagem possui várias formas diferentes que alteram totalmente como ele luta. Para cada vez que essa vantagem for comprada, crie uma segunda tabela de seus atributos de combate, podendo alterar todos os seus gastos de Experiência (EXP). Essa segunda ficha irá subir de nível e ganhar experiência junto da sua principal.",
            "Você deve dividir todas as suas técnicas entre as fichas criadas. Uma técnica só pode ser usada pela forma à qual foi entregue. Em todos os níveis pares, você não ganha Pontos de Habilidade. Ao invés disso, você ganha a nova técnica do nível uma vez para cada uma de suas formas. Essas técnicas devem ficar uma com cada forma obrigatoriamente.",
            "Trocar de forma consome 4 MP e é uma ação grátis que deve ser realizada durante o seu turno."
        ]
    },
    {
        "nome": "Hardcore",
        "pontos": "0",
        "descricao": [
            "O personagem adora combates 1 a 1 e também não interfere em combates 1 a 1 de seus aliados, quando possível. Em casos de inimigos muito, muito fortes ou com vários combatentes, uma luta em equipe é aceitável.",
            "Itens de cura e habilidades de cura não recuperam HP, apesar de ainda ajudarem com ferimentos. O personagem só recupera HP quando o mestre diz que ele recuperou. Personagens devem alternar quem enfrenta inimigos para conseguirem vencer os desafios sem morrer.",
            "No fim do episódio, você ganha +2 pontos extras de Experiência. Você não perde EXP alguma pelas lutas em que não participou.",
            "Essa vantagem só pode ser comprada se todos os outros jogadores também a comprarem."
        ]
    },
    {
        "nome": "Herdeiro",
        "pontos": "1 ou 3 ou 5",
        "descricao": [
            "Você é herdeiro de alguma fortuna de algum tipo ou origem. Isso te faz iniciar a história com um pouco mais de dinheiro do que o normal. Você só pode comprar Herdeiro uma vez. O motivo e origem da herança devem ser explicados na história do personagem.",
            "1 ponto: Comece a história com 750 moedas ao invés de 500.",
            "3 pontos: Comece a história com 1000 moedas ao invés de 500.",
            "5 pontos: Comece a história com 1500 moedas ao invés de 500."
        ]
    },
    {
        "nome": "Identidade Alternativa",
        "pontos": "2",
        "descricao": [
            "O personagem possui uma ou mais identidades alternativas, completamente legais."
        ]
    },
    {
        "nome": "Imortalidade Avançada",
        "pontos": "4",
        "descricao": [
            "Caso o personagem morra completamente, ele retorna à vida um tempo depois, regenerando completamente o seu corpo (mesmo se for destruído). Para um personagem ser imortal, o mestre e o jogador deverão definir qual é a única coisa que pode matar completamente o personagem, o poder imortalidade tem sempre que ter algum tipo de ponto fraco. Por exemplo, decapitação com Vampiros, balas de prata para Lobisomens, etc."
        ]
    },
    {
        "nome": "Imortalidade Simples",
        "pontos": "2",
        "descricao": [
            "O personagem não envelhece, nunca morrendo de causas naturais. O personagem ainda pode morrer de outras maneiras normais, ele é apenas imune aos efeitos do tempo. Se o personagem for da raça Elfo, El'zel ou Quellsir, ele pode comprar essa vantagem por 1 ponto."
	    ]
    },
    {
        "nome": "Imunidade à Doença",
        "pontos": "1",
        "descricao": [
            "O personagem é imune a qualquer tipo de doença, de nível de poder humano e sobre-humano."
        ]
    },
    {
        "nome": "Imunidade à Veneno",
        "pontos": "1",
        "descricao": [
            "O personagem é imune a qualquer tipo de veneno, de nível de poder humano e sobre-humano."
        ]
    },
    {
        "nome": "Imunidade Jurídica",
        "pontos": "2",
        "descricao": [
            "Por algum motivo o personagem não pode ser julgado criminalmente pela justiça comum."
        ]
    },
    {
        "nome": "Invisibilidade a Maquinas",
        "pontos": "2",
        "descricao": [
            "O personagem não pode ter sua imagem capturada por nenhum tipo de aparelho ou máquina, não aparece em vídeo nem em fotos."
        ]
    },
    {
        "nome": "Leitura Labial",
        "pontos": "2",
        "descricao": [
            "Seja por capacidade natural ou uma incrível paciência e treino, você possui a habilidade de entender o que outras pessoas falam mesmo sem ouví-los, apenas pelo fato de observar como seus lábios se movem à distância. Dessa forma, se você tiver em uma situação onde não pode ouvir o que alguma pessoa está dizendo em até 8 metros de distância de você, faça um teste de Percepção contra uma dificuldade colocada pelo mestre para entender sobre o quê essa pessoa está falando. Você ganha um bônus de superioridade nesse teste."
        ]
    },
    {
        "nome": "Língua de Prata",
        "pontos": "3",
        "descricao": [
            "O personagem tem um dom em situações sociais, sempre sabendo exatamente como se comportar e como falar. Aumente sua carisma em +1, podendo ultrapassar o limite inicial de 5."
        ]
    },
    {
        "nome": "Magia da Amizade",
        "pontos": "2",
        "descricao": [
            "Enquanto você for a última esperança de seus amigos, você não pode ser parado. Você não é nocauteado ao atingir 0 de HP, ao invés disso você continua de pé e lutando até alcançar -10 HP, momento no qual você morre, sem direito a testes.",
            "Se seu HP for menor do que 1 quando você completar seu objetivo, você despenca e faz os testes de morte normalmente. Não funciona em eventos de batalha pura onde a morte não significa nada."
        ]
    },
    {
        "nome": "Mais do Mesmo",
        "pontos": "1",
        "descricao": [
            "Testes de sedução executados por personagens do sexo oposto falham automaticamente contra você. Testes de sedução executados por personagens do mesmo sexo tem chances de sucesso comuns contra você."
        ]
    },
    {
        "nome": "Melhor de ambos os lados",
        "pontos": "4",
        "descricao": [
            "Escolha uma raça primária e uma raça secundária. Você é uma mistura das duas raças, contendo partes positivas da segunda raça em relação à primeira. Você recebe todos os bônus da primeira raça normalmente. Escolha um dos atributos raciais que a segunda raça fornecia: você passa a receber esse bônus. Além disso, você passa a poder comprar as Vantagens e Desvantagens Raciais oferecidas para a segunda raça. (Nota: Quando \"Humano\" é escolhido como raça secundária, você recebe +2 pontos de vantagem ao invés de um bônus em atributo-teste, efetivamente reduzindo o custo dessa vantagem para 2). Não é compatível com a desvantagem \"Pior de ambos os lados\" nem com a raça Changeling."
        ]
    },
    {
        "nome": "Mente Rápida",
        "pontos": "3",
        "descricao": [
            "Seu personagem sempre teve uma facilidade com pensamento lógico e com aprender e memorizar coisas importantes. Aumente sua Inteligência em +1, podendo ultrapassar o limite inicial de 5."
        ]
    },
    {
        "nome": "Mente Veloz",
        "pontos": "3",
        "descricao": [
            "Seu personagem é capaz de pensar muito mais rápido que outras pessoas, independente da sua inteligência. O efeito disso é que ele é capaz de tomar decisões complexas mesmo em pouco tempo sem afetar seu julgamento. Isso significa que você, o jogador, não precisa responder rapidamente à situação (como mestres realizando contagens de tempo) e você pode pensar um pouco para tomar a melhor decisão, sem tempo passar na história.",
            "Adicionalmente, ganhe um bônus permanente na sua Percepção Passiva igual à +3 pontos."
        ]
    },
    {
        "nome": "Mentor",
        "pontos": "2",
        "descricao": [
            "O personagem tem alguém que lhe dá conselhos. Alguém que ensinou a ele o que sabe, e pode ensinar mais. O jogador deve especificar quem é o mentor do personagem, como ele é e por que se tornou o mentor."
        ]
    },
    {
        "nome": "Mentor Especial",
        "pontos": "0",
        "descricao": [
            "Exatamente como a vantagem Mentor, mas seu mentor é um personagem importante de um dos arcos ou histórias anteriores.",
            "Envolver um personagem antigo em sua história muito provavelmente vai exigir aprovação do mestre e/ou do criador daquele personagem, dependendo de como você o incluiu - é importante garantir que o personagem não tome um rumo não desejado."
        ]
    },
    {
        "nome": "Memória Eidética",
        "pontos": "2",
        "descricao": [
            "O personagem possui uma memória fotográfica, e se lembra de tudo que conseguiu botar os olhos na vida. O personagem nunca esquece de nada e pode retornar mentalmente a algum lugar em que esteve para procurar mais informações. Exemplo: ao descobrir que o Rei era na verdade um vilão, o personagem retorna ao quarto do rei mentalmente e faz um teste de percepção procurando algo fora de lugar... E aí ele consegue se lembrar de algo que estava em cima da mesa e que na hora não tinha peso, mas agora muda tudo."
        ]
    },
    {
        "nome": "Muralha",
        "pontos": "3",
        "descricao": [
            "Você possui um corpo realmente forte e resistente. Aumente sua constituição em +1, podendo ultrapassar o limite inicial de 5."
        ]
    },
    {
        "nome": "Não comer / beber",
        "pontos": "1 ou 2 ou 3",
        "descricao": [
            "O personagem não necessita comer ou beber para sobreviver. Ele sustenta seu corpo por algum outro meio (luz solar, magia, tecnologia, etc.). Ele não perde MP por falta de comida (perda normal de 8 MP por dia, não recuperáveis a não ser com alimentação, por falta de comida e 16 MP por dia, não recuperáveis a não ser com água, por falta de água). O jogador deve especificar o porquê o personagem não precisa comer ou beber e dizer qual tipo de alimentação alternativa usa. Se você não precisa, mas pode comer, você pode ganhar os bônus normais de alimentação comendo.",
            "1 Ponto: Você não precisa se alimentar, não ganhando as vantagens de alimentação normais.",
            "2 Pontos: Você recebe +1 Stamina depois de uma noite de sono. Isso é equivalente a um personagem normal se alimentar e não acumula esses pontos.",
            "3 Pontos: Você recebe +2 Stamina depois de uma noite de sono. Isso é equivalente a um personagem normal se alimentar e não acumula esses pontos."
        ]
    },
    {
        "nome": "Não dorme",
        "pontos": "1",
        "descricao": [
            "O personagem não necessita dormir, recebe os efeitos de dormir depois de algumas horas de descanso ou meditando e não necessita realmente dormir."
        ]
    },
    {
        "nome": "Não precisa respirar",
        "pontos": "2",
        "descricao": [
            "O personagem não tem necessidade de oxigênio para viver, por algum motivo genético, cibernético, sobrenatural."
        ]
    },
    {
        "nome": "Oráculo",
        "pontos": "3",
        "descricao": [
            "Em certos momentos, escolhidos pelo Mestre, ele pode dizer que você teve uma rápida visão sobre uma situação. Você também podem tentar se concentrar com calma para ter essas visões (não necessariamente claras).",
            "Os testes para prever algo são feitos com 1d10 + Sabedoria + (1/2 Emprego [Vidente]), e a dificuldade varia de acordo com o que se está tentando prever"
        ]
    },
    {
        "nome": "Parrudo",
        "pontos": "1",
        "descricao": [
            "Seu personagem possui uma larga constituição física, acima do normal para a sua raça ou um pouco mais reforçada do que o normal. As pessoas tendem a se intimidar pela sua constituição e resistência geral, permitindo que você use sua Constituição (CON) como modificador em testes de Intimidação, ao invés de Carisma (CAR)."
        ]
    },
    {
        "nome": "Paz Interior",
        "pontos": "3",
        "descricao": [
            "Seu personagem alcançou níveis incomuns de autoconhecimento e se tornou muito sábio no processo. Aumente sua Sabedoria em +1, podendo ultrapassar o limite inicial de 5."
        ]
    },
    {
        "nome": "Pequeno",
        "pontos": "2",
        "descricao": [
            "Seu personagem é menor que os padrões de sua raça (defina nas informações da ficha o quanto), por isso, ele recebe superioridade em rolagens onde seu tamanho seja relevante para executar alguma ação" 
        ]
    },
    {
        "nome": "Princesa para sempre",
        "pontos": "1",
        "descricao": [
            "O universo conspira a seu favor e você nunca deixa de estar apresentável, não importa o que aconteça. Mesmo que você passe um mês vivendo no meio do pântano sem tomar banho, a sujeira vai se arrumar de um jeito que apenas te faz parecer mais forte, sem realmente afetar sua aparência. Machucados e outros também acabam funcionando assim, seu rosto não pode ficar completamente inchado."
        ]
    },
    {
        "nome": "Protegido Indefeso",
        "pontos": "2",
        "descricao": [
            "Seu personagem é o protegido indefeso de alguém mais forte. Isso significa que seu personagem não é realmente capaz de lutar. Essa vantagem conta como Aparência Inofensiva também.",
            "Seu personagem não participa de lutas e não possui nenhuma habilidade de luta. Ao invés disso, crie sua ficha de combate para alguma outra coisa (como um robô que luta por seu personagem, um animal ou até mesmo outra pessoa). Essa pessoa lutará por você. É até possível utilizar essa vantagem para ter uma forma alternativa para combate!",
            "Qualquer vantagem ou desvantagem que você compre que se ligue ao combate passará a valer para essa pessoa. O mesmo pode valer para seu arquétipo, se quiser. O que essa vantagem faz é criar um muro entre a ficha de combate e a ficha fora de combate."
        ]
    },
    {
        "nome": "Rede Mundial de X",
        "pontos": "2",
        "descricao": [
            "Escolha um ou dois atributos-teste e uma atividade relacionada a eles (como Rede Mundial de Detetives para Inteligência e Sabedoria). Seu personagem faz parte de um grupo altamente seletivo de especialistas nessa área.",
            "Seu personagem pode pedir ajuda ao grupo, mas dificilmente irá receber uma ajuda direta e em pessoa. O grupo pode ajudar com dicas, suporte à distância e, principalmente, abrir portas para você.",
            "Requerimentos: Caso apenas um atributo-teste seja escolhido, você deve possuir um nível de 4 ou mais nele par fazer parte da Rede. Caso dois sejam escolhidos, você precisa de 3 ou mais neles para fazer parte da rede."
        ]
    },
    {
        "nome": "Reflexos Velozes",
        "pontos": "3",
        "descricao": [
            "Seu personagem é capaz de reagir rápido e com precisão. Aumente sua Agilidade em +1, podendo ultrapassar o limite inicial de 5."
        ]
    },
    {
        "nome": "Reflexos em Combate",
        "pontos": "3",
        "descricao": [
            "Seu personagem está sempre atento e pronto para reagir para problemas.",
            "Aumente suas rolagens de iniciativa em +2."
        ]
    },
    {
        "nome": "Rico",
        "pontos": "2 ou 4",
        "descricao": [
            "Seu personagem tem acesso a uma quantidade enorme de dinheiro. Por questões de balanceamento, você não pode gastar esse dinheiro em Itens utilizáveis em combate nem para seus aliados. Esse dinheiro se torna abstrato e não é anotado na sua ficha (o Dinheiro da ficha você pode gastar normalmente).",
            "2 pontos: Você tem dinheiro o suficiente para pagar qualquer coisa de custo normal durante a história, como hotéis, comida, etc.",
            "4 Pontos: Você é realmente podre de rico. Pode ter casas em várias cidades e é capaz de suprir praticamente qualquer gasto que ocorra dentro da história sem precisar se esforçar muito."
        ]
    },
    {
        "nome": "Sangue Frio",
        "pontos": "1 ou 3",
        "descricao": [
            "O corpo do personagem não regula sua temperatura, então o personagem não se sente desconfortável em temperaturas \"ruins\" e também não precisa comer tanto.",
            "Por um ponto, o personagem é capaz de sobreviver a temperaturas baixas e temperaturas altas, contanto que não esteja frio a ponto de o congelar por dentro nem de ferver seus líquidos, casos nos quais ele morre. É importante perceber que você não possui defesas além disso: se estiver frio o suficiente para te matar e ninguém te esquentar, você não pode se esquentar independente de quantas blusas utilize, da mesma forma, se o ambiente for quente o suficiente para te cozinhar por dentro, você não tem como se proteger sem simplesmente sair daquele lugar.",
            "Entretanto, se as temperaturas estiverem dentro dos seus limites de sobrevivência, você obtém sucesso automático em testes para \"resistir\" elas. Você aguenta temperaturas maiores e mais baixas do que o normal, mas se passar do limite você falha automaticamente em testes para resistir. Por 3 pontos, o seu corpo resiste a temperaturas extremamente baixas ou excessivamente altas, efetivamente o dando sucesso automático em testes de resistir temperatura que sejam possíveis de se sobreviver.",
            "No caso, se alguém com Constituição 5 poderia resistir a alguma temperatura num resultado máximo, alguém com Sangue Frio 3 resiste com sucesso automático."
        ]
    },
    {
        "nome": "Segunda Chance",
        "pontos": "3",
        "descricao": [
            "Uma vez por sessão ou dia (o que demorar mais), o personagem pode realizar um teste de sorte em um rolamento com o qual não está satisfeito. Nesse caso, ele faz o mesmo teste novamente. O novo resultado deve ser usado e não pode ser refeito através de novos testes de sorte, mesmo que seja menor do que o primeiro resultado. Não pode ser utilizado em combate contra outros jogadores."
        ]
    },
    {
        "nome": "Segunda Raça - Morto Vivo",
        "pontos": "2",
        "descricao": [
            "O personagem se torna um temível morto-vivo. Claro, cada caso é um caso e como isso irá afetar o personagem e sua 'vida' pode variar muito. O jogador pode decidir não incluir qualquer uma (ou todas) das vantagens e desvantagens à seguir, alterando o custo final da vantagem Morto-Vivo. Some o custo/redutor de todas as vantagens/desvantagens escolhidas ao custo inicial da vantagem morto-vivo para encontrar o custo final. O custo final não pode ser inferior a 0.",
            "As desvantagens escolhidas não contam para o limite de 4 desvantagens por ficha. Tanto as vantagens quanto as desvantagens escolhidas passam a fazer parte de 'Segunda Raça - Morto-Vivo' e só existem dentro dela, por mais que possam funcionar exatamente como as normais.",
            "+0 - Não Comer/Beber: O morto-vivo não pode nem precisa se alimentar/beber. O personagem não é capaz de se alimentar de forma alguma e nunca recebe stamina bônus através de alimentação.",
            "+0 - Morto: Você já está morto. Seus órgãos internos já não funcionam e você não precisa se preocupar tanto com temperatura. Funciona como a vantagem \"Sangue Frio\", com a exceção que você não tem nenhuma defesa natural contra temperaturas. Se ficar frio demais, você congela e não consegue mais se mover. Se ficar quente demais você cozinha, o que deve ser bem desagradável.",
            "+1 - Não Dorme: O morto-vivo não precisa dormir.",
            "+1 - Não Respira: O morto-vivo não precisa respirar.",
            "+1 - Imortalidade Simples: O morto-vivo não é afetado pelo passar do tempo, nunca envelhecendo.",
            "+3 - Imortalidade Avançada: Funciona exatamente como a vantagem Imortalidade Avançada.",
            "+1 - Imunidade a veneno: Funciona exatamente como a vantagem Imunidade a Veneno.",
            "-2 - Alergia Sobrenatural: Funciona exatamente como a desvantagem de mesmo nome e o personagem não pode possuir essa desvantagem dentro de Morto-Vivo e por fora ao mesmo tempo.",
            "-1 - Aparência Hedionda: Funciona exatamente como a desvantagem de mesmo nome e o personagem não pode possuir essa desvantagem dentro de Morto-Vivo e por fora ao mesmo tempo.",
            "-2 - Corpo Alienígena: Funciona exatamente como a desvantagem de mesmo nome e o personagem não pode possuir essa desvantagem dentro de Morto-Vivo e por fora ao mesmo tempo.",
            "-1 - Dependente: Funciona exatamente como a desvantagem de mesmo nome e o personagem não pode possuir essa desvantagem dentro de Morto-Vivo e por fora ao mesmo tempo. A dependência do morto-vivo também pode ser a única fonte de alimento válida para ele, se conveniente.",
            "-2 - Fraqueza Sobrenatural: Funciona exatamente como a desvantagem de mesmo nome e o personagem não pode possuir essa desvantagem dentro de Morto-Vivo e por fora ao mesmo tempo.",
            "-2 - Morte pelo sol: Funciona exatamente como a desvantagem de mesmo nome e o personagem não pode possuir essa desvantagem dentro de Morto-Vivo e por fora ao mesmo tempo."
        ]
    },
	    {
        "nome": "Segunda Raça - Elemental",
        "pontos": "3",
        "descricao": [
            "Os ancestrais do personagem tiveram uma ligação bem próxima às forças primais da natureza. Um personagem não pode ter duas ou mais vantagens de \"Segunda Raça\".",
            "Escolha um tipo de elemental para ser a sua segunda raça:",
            "• Água: Você ganha superioridade em testes de Acrobacia.",
            "• Areia: Você ganha superioridade em testes de Prestidigitação.",
            "• Cristal: Seu valor de Aparência é aumentado em +2.",
            "• Escuridão: Você ganha superioridade em testes de Furtividade quando se escondendo no escuro e uma visão noturna.",
            "• Fogo: Ignore danos fora de batalha, efeitos temporais e obstáculos que sejam feitos de fogo.",
            "• Fumaça / Névoa: Você ganha superioridade em testes de Furtividade quando se camuflando.",
            "• Gelo: Ignore danos fora de batalha, efeitos temporais e obstáculos que sejam feitos de gelo.",
            "• Luz: Você pode intensificar seu corpo e irradiar luz própria num raio de 10 metros em volta de você.",
            "• Terra: Aumente sua constituição em +1. Você não pode ter outras vantagens que aumentem sua constituição funcionando junto dessa (elas não se acumulam).",
            "• Trovão: Ganhe +2 de iniciativa bônus. Esse efeito não se acumula com outras vantagens que aumentem sua iniciativa.",
            "• Madeira: Aumente seu HP máximo em +2. Esse efeito não se acumula com outras vantagens que aumentem seu HP máximo.",
            "• Metal: Reduza os três primeiros danos dano que receber fora de batalha num episódio ou dia (o que acontecer primeiro) em 1 ponto.",
            "• Vento: Você ganha superioridade em testes brutos de Agilidade e ignora danos por queda ou contusão."
        ]
    },
    {
        "nome": "Sono Leve",
        "pontos": "3",
        "descricao": [
            "O personagem tem sono leve nunca dorme pesado, sempre vai poder acordar quando quiser. Ele também ganha superioridade para resistir em qualquer situação de desmaio, ou sono induzido."        ]
    },
    {
        "nome": "Super Audição",
        "pontos": "1 ou 3",
        "descricao": [
            "• 1 ponto: Você é capaz de escutar claramente um alfinete caindo na sala ao lado. Você ganha superioridade em testes de percepção auditiva.",
            "• 3 pontos: Você pode ouvir claramente sussurros realizados longe (25m) de você. Também pode escutar frequências inaudíveis para ouvidos normais. Você passa automaticamente em testes de percepção auditiva com dificuldades iguais até um valor de 12 ou menos."
        ]
    },
    {
        "nome": "Super Sentidos",
        "pontos": "5",
        "descricao": [
            "O personagem possui Super Audição (equivalente a Super Audição de 3 pontos), Super Visão telescópica (aumenta 10x a visão normal e permite enxergar detalhes a distâncias gigantescas), Super Olfato (identifica cheiros impossíveis de serem sentidos por um ser humano).",
            "Não pode ser comprada junto das vantagens individuais de cada Sentido."
        ]
    },
    {
        "nome": "Super Visão",
        "pontos": "2",
        "descricao": [
            "Enxerga 10x a visão normal humana. Sucesso automático em testes para enxergar pequenos detalhes de longe."
        ]
    },
    {
        "nome": "Terreno Favorito",
        "pontos": "2",
        "descricao": [
			"Você conhece um tipo de terreno como a palma da sua mão, seja por treinamento ou por ter nascido nele como ambiente natural. Escolha um:",
            "• Aquático: Você consegue segurar a sua respiração em até 2x o tempo normal para um membro comum da sua raça;",
            "• Ártico: Ignore os efeitos do clima frio, mesmo que sejam bastante severos. Você não perde pontos de Stamina por hipotermia;",
            "• Deserto: Ignore os efeitos do clima desértico e do forte sol, mesmo que sejam bastante severos. Você não perde pontos de Stamina por falta de água ou comida;",
            "• Floresta: Ganhe superioridade em testes de Furtividade ou Agilidade quando tentando se camuflar nesse tipo de ambiente;",
            "• Interiores / Urbano: Ganhe superioridade em testes de Furtividade ou Agilidade quando tentando se mover silenciosamente nesse tipo de ambiente;",
            "• Pântanos: Ganhe imunidade à venenos e doenças originárias desse tipo de ambiente;",
            "• Planícies: Ganhe superioridade em testes de Percepção ou Sabedoria quando tentando procurar algo nesse ambiente;",
            "• Montanhas: Ganhe superioridade em testes de Atletismo ou Força quando escalando uma superfície desse tipo de ambiente;"
        ]
    },	
    {
        "nome": "Trabalhador Esforçado",
        "pontos": "2",
        "descricao": [
            "O personagem se esforça mais do que o normal quando está trabalhando. Aumente a quantia de moedas de ouro ganhas trabalhando com Emprego em 25%."
        ]
    },
    {
        "nome": "Treinamento Extra",
        "pontos": "2",
        "descricao": [
            "O personagem começa a história com uma técnica a mais. Essa técnica possui um slot de addon e não pode ser fundida com outras técnicas inicialmente. Em níveis seguintes, a técnica pode receber upgrades tanto por ser fundida com outras técnicas quanto por pontos de habilidade. A técnica também pode ser um Estilo de Luta.",
            "Treinamento Extra pode ser comprada múltiplas vezes."
        ]
    },
    {
        "nome": "Treinamento Pesado",
        "pontos": "3",
        "descricao": [
            "O treinamento difícil e cansativo realizado pelo personagem aumentou seus limites. O MP máximo do personagem aumenta em +5. Essa vantagem não pode ser comprada múltiplas vezes."
        ]
    },
    {
        "nome": "Treinamento Simples",
        "pontos": "1",
        "descricao": [
            "O personagem começa a história com uma técnica a mais. Essa técnica não possui nenhum slot de addon. Essa vantagem é obrigatória caso o personagem deseje ser capaz de atacar de formas especiais mesmo desarmado (como atirar hadoukens). A técnica sem slots passa a ser considerada uma técnica comum, podendo ser alterada por Pontos de Habilidade normalmente mais tarde e simplesmente possuindo 0 slots para addons."
        ]
    },
    {
        "nome": "Tolerância à Álcool",
        "pontos": "1",
        "descricao": [
            "Imune aos efeitos do álcool. O personagem pode beber e nunca ficará bêbado."
        ]
    },
    {
        "nome": "Visão de 360 Graus",
        "pontos": "1",
        "descricao": [
            "O personagem pode ver em um ângulo de 360º, devido a algum motivo (sobrenatural,racial,implante cibernético,magia, superpoder, etc.)."
        ]
    },
    {
        "nome": "Visão Noturna",
        "pontos": "1",
        "descricao": [
            "O personagem possui visão em ambientes com pouca ou quase nenhuma luz. É a famosa visão preto-e-branco de câmeras noturnas. Pode ser ofuscado por luminosidade normal quando estiver usando a visão noturna."
        ]
    },
    {
        "nome": "Voz Sábia",
        "pontos": "1",
        "descricao": [
            "Você fala com um tom calmo que passa o quanto você aprendeu sobre a vida. Você pode usar sua Sabedoria no lugar de Carisma para testes de Diplomacia."
        ]
    },
    {
        nome : 'Androgenia',
        pontos : '1',
        descricao : [
            'Algo na sua espécie, ou em você em particular, faz ser bem difícil identificar seu gênero.',
            'A sua situação específica acabou sendo um resultado muito bom e tudo encaixa muito bem.',
            'Vocẽ não ganha vantagens em interações sociais, mas você sempre pode agir como o gênero que fosse se beneficiar mais em certo momento.'
        ]
    }
].sort(function (a,b) {
    var na = a.nome.toUpperCase();
    var nb = b.nome.toUpperCase();
    if (na < nb) return -1;
    if (na > nb) return 1;
    return 0;
});

window.vantagensHash = {};
var nome;
for (var i = 0; i < window.vantagensArray.length; i++) {
    nome = window.vantagensArray[i].nome.toUpperCase().replace(/ *\([^)]*\) */, '').trim();
    if (window.vantagensHash[nome] !== undefined) {
        console.log("Vantagem repetido. Antigo: ");
        console.log(window.vantagensHash[nome]);
        console.log("Novo:");
        console.log(window.vantagensArray[i]);
    }
    window.vantagensHash[nome] = window.vantagensArray[i];
}

window.desvantagensArray = [
    /* Desvantagens Raciais */
    {
        "nome": "Tradição",
        "pontos": "5",
        "descricao": [
            "Não há nada mais que um anão goste do que uma boa luta (exceto bebidas alcoólicas e dinheiro) e um bom rival para poder disputar sua força. Está no sangue dessa raça e dificilmente mudará através dos tempos, seja ela uma disputa de força física ou de poderes clericais ou um duelo de robôs gigantes operados pelos mesmos. Um anão sempre vai querer testar sua força contra inimigos, especialmente se eles forem mais fortes que o próprio anão. Participar de um conflito sem entrar em combate direto, quebrar algumas cadeiras ou mesmo sangrar um pouco não faz parte dos planos dos anões, portanto ele sempre vai optar e querer participar de algo que envolva ação e disputa de poderes... Caso contrário, ele nem irá se interessar, provavelmente."
        ],
        "requisitos": "Raça anão"
    },
    {
        "nome": "Anão é Irmão",
        "pontos": "5",
        "descricao": [
            "Embora o grande estereótipo que circunda os anões é aquele clássico de que são carrancudos, fortes, com poucos amigos e loucos por uma cerveja, existe algo além disso - a fidelidade. Um anão que cria boas conexões e laços de amizade seja com membros de sua raça ou de outra, terá maior tendência a dar o seu melhor para protegê-los mesmo que isso custe sua vida. Além disso, um anão tentará (da sua forma e com a sua personalidade) fazer coisas para seus aliados, mesmo que eles não queiram que ele faça, fazendo-o parecer com daquele amigo inconveniente que às vezes empurra um amigo humano para uma Orc fêmea na tentativa de juntar os dois (isto é apenas um exemplo)."
        ],
        "requisitos": "Raça anão"
    },
    {
        "nome": "Temperamento Curto",
        "pontos": "2",
        "descricao": [
            "Além das belas armas, armaduras, artefatos, ouro e cervejas que os anões guardam em suas casas, também há um traço que os fazem ser definitivamente reconhecidos mundialmente: a impulsividade e o temperamento pavio-curto. Anões tendem a não controlar suas emoções, especialmente se for a raiva e agressividade frente à algo, explodindo prematuramente em situações sociais diversas."
        ],
        "requisitos": "Raça anão"
    },
    {
        "nome": "Motivo de Piada",
        "pontos": "4",
        "descricao": [
            "Nem todos os Bestiais possuem uma espécie que seja intimidadora em sua aparência, ou mesmo que demonstre respeito e coragem. Alguns Bestiais são freqüentemente motivo de piada por conta de sua aparência e por serem atrelados aos seus ancestrais animais, que muito provavelmente não possuem um destaque biológico como uma espécie forte e ameaçadora. Bestiais com isso falham automaticamente em testes sociais onde a aparência seja relevante para te levarem a sério (intimidação sem que o inimigo conheça sua real força, por exemplo) e o Mestre pode dar ao Bestial também falha automática em outros testes sociais que envolvam a aparência."
        ],
        "requisitos": "Raça Bestial"
    },
    {
        "nome": "Motivo de Repulsa",
        "pontos": "4",
        "descricao": [
            "Você pertence à uma espécie de bestiais que de alguma forma possui um histórico biológico de ser uma raça assustadora e que causa repulsa onde passa. Se não isso, algo em particular em você dentro da sua espécie, vai além do comum e te confere esse status. Um Bestial com essa desvantagem falha automaticamente em testes sociais relevantes onde sua aparência entre (como sedução, por exemplo). Além disso, o valor de Aparência do personagem fica igual à 1 permanentemente e não pode ser maior que isso."
        ],
        "requisitos": "Raça Bestial"
    },
    {
        "nome": "Motivo de Descrença",
        "pontos": "4",
        "descricao": [
            "Você pertence à uma espécie de bestiais que de alguma forma possui um histórico biológico de ser uma raça inofensiva e que não faz mal a ninguém.  Se não isso, algo em particular em você dentro da sua espécie, vai além do comum e te confere esse status.  Geralmente um Bestial com essa desvantagem não é considerado uma ameaça por ninguém e isso pode funcionar a seu favor às vezes, mas geralmente pessoas que não te conhecem não te levarão em consideração como alguém que pode trazer problemas."
        ],
        "requisitos": "Raça Bestial"
    },
    {
        "nome": "Filhos da Rejeição",
        "pontos": "3",
        "descricao": [
            "Dragões sempre foram criaturas que amedrontaram civilizações e passaram seu legado de terror através de histórias e lendas. Devido a conexão ao passado que essa raça possui, Draconianos tendem a ser rejeitados e marginalizados por outras raças e sociedades que não sejam as suas (exceto quando os mesmos já estabeleceram algum tipo de posição de respeito na mesma) por não representarem uma ameaça tão grande quanto um dragão propriamente dito, mas ainda assim, por serem ligados à eles."
        ],
        "requisitos": "Raça Draconiano"
    },
    {
        "nome": "Profecia",
        "pontos": "3",
        "descricao": [
            "A maior parte dos draconianos crê em dragões e não os vê necessariamente como algo ruim ou como criaturas de pura destruição e caos. Embora existam cultos e sociedades draconianas que veneram diferentes tipos de dragões, de diferentes cores, origens e personalidades, em uma coisa todos eles são unidos: um fanatismo, uma crença extrema e absoluta sobre a volta dos dragões como criaturas supremas e os reais libertadores de seu povo (os draconianos) em algum futuro não tão distante."
        ],
        "requisitos": "Raça Draconiano"
    },
    {
        "nome": "Sangue Quente",
        "pontos": "3",
        "descricao": [
            "Por serem constantemente provocados, marginalizados, rejeitados e rotulados como criaturas medonhas e tão ligados com criaturas poderosas como os Dragões, muitos draconianos tem dificuldades em conter suas emoções e impulsividade quando provocados. Justamente por isso, quando rolando testes de \"Força de Vontade\" em relação à algo que requer controle das emoções ou de seus instintos, os draconianos recebem penalidades (à critério do mestre)."
        ],
        "requisitos": "Raça Draconiano"
    },
    {
        "nome": "Bicho Papão",
        "pontos": "2",
        "descricao": [
            "Sonhos criam glamour... Mas pesadelos também. E com um gosto especial. Sua forma preferida de obter Glamour é por aterrorizar e torturar pessoas. Você utiliza seu Glamour e seu corpo para criar verdadeiras visões do inferno que destroem o alvo para sempre. Se o trauma for grande o suficiente, você pode passar anos colhendo o glamour de uma mesma vítima. Você precisa desse tipo de glamour. Os outros não servem mais para você."
        ],
        "requisitos": "Raça Changeling"
    },
    {
        "nome": "Dauntain",
        "pontos": "3",
        "descricao": [
            "Você é um dauntain. Um changeling que teve seus sonhos destruídos e se tornou incapaz de sonhar. Agora você utiliza a banalidade como uma arma, conseguindo até trazer efeitos sobrenaturais através dela. Sua banalidade é forte o suficiente para desfazer changelings para sempre e até sua presença traz tristeza e desespero para changelings a sua volta. Seres banais também se sentem desconfortáveis em volta de você, como se tivesse algo muito errado em você."
        ],
        "requisitos": "Raça Changeling"
    },
    {
        "nome": "Uma promessa",
        "pontos": "3",
        "descricao": [
            "Quebrar uma promessa é uma das coisas mais banais que podem ser feitas e o Sonhar vai se voltar contra um Changeling que quebre uma de suas promessas. Você fez uma promessa que ainda não completou, uma promessa realmente difícil e talvez desconfortável e agora você não pode escapar. Você precisa concluir essa missão o mais cedo possível ou coisas terríveis te acontecerão."
        ],
        "requisitos": "Raça Changeling"
    },
    {
        "nome": "Quase auto-suficiente",
        "pontos": "3",
        "descricao": [
            "Embora os Droids possam ser auto-suficiente em coisas como necessidades biológicas diversas, eles ainda precisam de algo para funcionar ou mantê-los em funcionamento constante. O jogador que escolher essa desvantagem deve definir algo na qual o seu personagem droid é dependente para sobreviver, seja uma recarga elétrica, solar, algum fluído especial, reparos constantes, enfim, o que ele desejar."
        ],
        "requisitos": "Raça Droid"
    },
    {
        "nome": "Vulnerabilidade",
        "pontos": "3",
        "descricao": [
            "Todos ser possui uma fraqueza, e isso não é diferente com os Droids. Escolha uma fraqueza para o personagem dessa raça e defina-a em sua história claramente. Quando exposto à essas condições ou afetado por essa fraqueza, o personagem recebe penalidades (à critério do mestre) em todos os testes que fizer enquanto afetado."
        ],
        "requisitos": "Raça Droid"
    },
    {
        "nome": "Língua sem Travas",
        "pontos": "5",
        "descricao": [
            "Muitos Droids não compreendem aspectos das emoções humanas ou até entendem-nas, mas de forma mais racional e lógica. Justamente por isso, alguns membros dessa raça tendem a ser honestos até demais para evitarem problemas, mas não compreendem que uma honestidade tão radical também pode trazer problemas. O personagem com essa desvantagem sempre fala a verdade e o que pensa de fato, independente da ocasião."
        ],
        "requisitos": "Raça Droid"
    },
    {
        "nome": "Orgulho Exagerado",
        "pontos": "3",
        "descricao": [
            "Alguns elfos acreditam ser melhores que outras raças e levam isso muito a sério em suas vidas e ações cotidianas. Assim, um personagem com essa desvantagem geralmente possui uma postura arrogante e incrédula frente à membros de outras raças por acreditar que somente elfos são seres de confiança. Isso traz inimizades e inimigos bem mais facilmente para o personagem."
        ],
        "requisitos": "Raça Elfo"
    },
    {
        "nome": "Incredulidade",
        "pontos": "2",
        "descricao": [
            "Membros dessa raça dificilmente acreditam em algo sem uma prova sólida ou uma demonstração que realmente comprove um fato duvidoso."
        ],
        "requisitos": "Raça Elfo"
    },
    {
        "nome": "Intolerância",
        "pontos": "3",
        "descricao": [
            "Por acreditarem numa supremacia élfica em termos de competência, cultura e sociedade, muitos membros dessa raça nascem e são acostumados com idéias preconceituosas frente as outras raças. Um elfo que escolher essa desvantagem tem alguma forma de intolerância ou preconceito geral seja com uma raça, várias raças, uma religião, um costume ou uma cultura em si do mundo relacionado à pessoas de fora do seu habitat natural. O preconceito exato deve ser clarificado na história do personagem."
        ],
        "requisitos": "Raça Elfo"
    },
    {
        "nome": "Supremacia dos Reinos Negros",
        "pontos": "2",
        "descricao": [
            "Acreditando que a cultura, sociedade e a própria raça dos El'zels é superior (mas pouco compreendida pelas raças da superfície), os membros que pertencem à essa raça tendem a impor seus costumes, gostos e acham que são melhores que os outros sem nem pensar duas vezes. El'zels tendem a humilhar membros de outras raças quando possível e ridicularizá-los justamente por esse sentimento de \"superioridade\" que possuem."
        ],
        "requisitos": "Raça El'zel"
    },
    {
        "nome": "Crueldade",
        "pontos": "2",
        "descricao": [
            "El'zels levam muito a sério as capacidades físicas e intelectuais dos membros de sua raça e de outras, e isso geralmente é um critério de decisão da vida e morte do ser em questão. Assim, El'zels não hesitam em matar ou aniquilar seja lá quem for que estiver em seus caminhos, dificilmente tendo piedade, compaixão ou algum tipo de pena frente ao indivíduo."
        ],
        "requisitos": "Raça El'zel"
    },
    {
        "nome": "Cegueira por Luz",
        "pontos": "3",
        "descricao": [
            "Por viverem a maior parte de suas vidas (se não toda ela) embaixo da terra em cidades subterrâneas e complexos de túneis diversos, El'zels tendem a ter uma alta sensibilidade à luz do dia ou grandes fontes de luz como um todo. Personagens dessa raça que forem expostos à uma grande quantidade de luz (seja mesmo um dia ensolarado comum) recebem penalidades em testes de perícias relacionados com o sentido da visão ou mesmo podem receber dano periódico em seu HP, se o mestre desejar."
        ],
        "requisitos": "Raça El'zel"
    },
    {
        "nome": "A curiosidade matou o Fairy",
        "pontos": "3",
        "descricao": [
            "Um traço marcante dos Fayris é que possuem uma extrema curiosidade que dificilmente é saciada tão facilmente. Assim, membros dessa raça que pegarem essa desvantagem sentirão sempre uma profunda curiosidade frente à assuntos relevantes e sem perceber poderão até mesmo sacrificar o seu bem estar (e o de companheiros) para saná-la."
        ],
        "requisitos": "Raça Fayri"
    },
    {
        "nome": "Problemas do Foco",
        "pontos": "4",
        "descricao": [
            "O mundo é um grande amontoado de informações esperando para serem descobertos e estudados! Ao menos, é assim que os Fayris pensam, e justamente por isso acabam se distraindo mais facilmente que outras pessoas. Um personagem dessa raça com problemas de foco não age em rodadas ou combates surpresa (na fase zero, principalmente) e recebe penalidades em testes que requerem algum tipo de reação rápida."
        ],
        "requisitos": "Raça Fayri"
    },
    {
        "nome": "Cérebro sofisticado, emoções simples",
        "pontos": "2",
        "descricao": [
            "Embora tenham um fácil e rápido acesso à inúmeros artigos científicos, informações, livros e uma infinidade de conhecimentos, os Fayris ainda possuem em sua estrutura biológica emoções e reações bem simplificadas e consideradas até infantis por outras raças. Assim, um personagem dessa raça com essa desvantagem acaba por agindo de tal forma e também é, de certo jeito, ingênuo demais."
        ],
        "requisitos": "Raça Fayri"
    },
    {
        "nome": "Morfologia de Golem",
        "pontos": "4",
        "descricao": [
            "A aparência física de um Golem muitas vezes é intimidadora para aqueles que não os conhecem profundamente, e isso tende a causar certo medo e repulsa por parte das pessoas, que ou tomam uma postura hostil contra os mesmos ou uma postura de hesitação. O personagem com essa desvantagem falha automaticamente em alguns testes sociais (como sedução, por exemplo)."
        ],
        "requisitos": "Raça Golem"
    },
    {
        "nome": "Servo",
        "pontos": "5",
        "descricao": [
            "Para os desafortunados Golems que não vivem em seus habitats naturais e em suas sociedades padrão, a vida não é tão fácil. Muitos Golems acabam sendo tratados como objetos, escravos e servos para indivíduos de outras raças e geralmente tem que obedecer à este mestre caso não queiram ser vendidos ou sacrificados. O jogador deve especificar porque ele é um servo e quem é seu mestre em sua história."
        ],
        "requisitos": "Raça Golem"
    },
    {
        "nome": "Rápido como uma pedra",
        "pontos": "4",
        "descricao": [
            "Agilidade não é o forte dessa raça e isso acaba afetando-os principalmente em situações que requerem velocidade e uma reação rápida. Um personagem com essa desvantagem recebe penalidades em testes de deslocamento, de velocidade e sempre fica por último na ordem de iniciativas de um combate. Além disso o atributo-teste de um personagem com essa desvantagem é reduzido à 1 e não pode ser maior que isso."
        ],
        "requisitos": "Raça Golem"
    },
    {
        "nome": "Humanista Radical",
        "pontos": "2 ou 3",
        "descricao": [
            "Você é incapaz de enxergar qualquer raça não-humana, por mais parecida que seja, como uma igual. Por dois pontos, o personagem não se sente mal deixando sua visão radical clara a todos à sua volta. Por três pontos, o personagem está tomando passos para garantir a posição privilegiada dos humanos enquanto as outras raças se tornam extintas."
        ],
        "requisitos": "Raça Humano"
    },
    {
        "nome": "Vizinhança Errada",
        "pontos": "2 ou 4",
        "descricao": [
            "O personagem enfrentou severas discriminações por se tratar de um humano, provavelmente em alguma região dominada por outras raças onde humanos eram minorias. Essa desvantagem pode ser comprada apenas para o passado do personagem por 2 pontos. Caso o mestre vá realizar a maior parte da história em uma dessas regiões, recomenda-se que todos os humanos recebam essa desvantagem com um ganho de 4 pontos, consulte o seu mestre antes, então."
        ],
        "requisitos": "Raça Humano"
    },
    {
        "nome": "Dificuldade Cibernética",
        "pontos": "3",
        "descricao": [
            "A sociedade Jorn não é muito acostumada com alta tecnologia e prefere viver mais próxima da natureza o possível, venerando os espíritos e confiando em sua força física e mental. Assim, um personagem Jorn com essa desvantagem não pode nem consegue usar equipamentos modernos e que tenham muita tecnologia, fazendo com que ele seja incapaz de usar Armas de Fogo e outros itens que não sejam de uso intuitivo e natural. O personagem também falha automaticamente em testes da perícia Sistemas."
        ],
        "requisitos": "Raça Jorn"
    },
    {
        "nome": "Honra dos Ancestrais",
        "pontos": "3",
        "descricao": [
            "Um Jorn leva muito a sério suas próprias noções de honra e condutas gerais do que é certo e do que não é certo, independente se ele possui uma visão de mundo mais \"maléfica\" ou \"benéfica. Com isso, o jogador deve especificar na história do personagem uma espécie de código de honra que o personagem sempre segue e que jamais irá quebrá-lo. Se o personagem quebrar esse código de honra, ele recebe inúmeras penalidades em diversos testes (à critério do Mestre)."
        ],
        "requisitos": "Raça Jorn"
    },
    {
        "nome": "Lealdade Extrema",
        "pontos": "5",
        "descricao": [
            "Um valor estimado na sociedade Jorn é o da lealdade. Juntamente com o conceito de honra, a lealdade cria as bases desses indivíduos e os orienta para a vida e como agirem em suas aventuras frente aos perigos e com seus aliados estimados, independente da raça deles. O personagem com essa desvantagem é capaz de dar sua própria vida por seus amigos e freqüentemente se mostrará leal em situações, mesmo que isso possa complicar ele mesmo."
        ],
        "requisitos": "Raça Jorn"
    },
    {
        "nome": "Mãos Leves",
        "pontos": "4",
        "descricao": [
            "Qualquer um que não conheça um Kalkan deve ter cuidado com seus pertences mais valiosos, ainda mais se o Kalkan em questão demonstrou interesse em algum objeto. Embora não façam isso por maldade, os Kalkans tendem a \"achar\" alguns artefatos, objetos ou coisas do tipo que outras pessoas \"deixaram cair\" (lê-se, roubam sem intenção de fazer mal). Assim, um personagem com essa desvantagem irá roubar um objeto pelo qual se interessou, mesmo que minimamente, sempre que houver uma oportunidade."
        ],
        "requisitos": "Raça Kalkan"
    },
    {
        "nome": "Inocência",
        "pontos": "3",
        "descricao": [
            "Kalkans são quase 100% inocentes e permanecem dessa forma através dos anos de suas vidas. Isso ajuda a acrescentar a ausência de medo que eles sentem, o que é outro traço marcante, embora ainda possam sentir medo por outras pessoas (como o medo de perder um aliado estimado). Dessa forma, um Kalkan tende a agir de forma extremamente inocente, despreocupada e muitas vezes sem cuidados frente à situações perigosas ou ameaçadoras."
        ],
        "requisitos": "Raça Kalkan"
    },
    {
        "nome": "Facilmente Enganado",
        "pontos": "4",
        "descricao": [
            "Devido à alta inocência que os Kalkans possuem, eles acabam sendo muitas vezes enganados por outras pessoas mais maliciosas ou mal intencionadas. Assim, um Kalkan com essa desvantagem tende à acreditar em praticamente tudo que lhe dizem e recebe uma penalidade igual à -5 em testes que envolvam a perícia Percepção afim de detectar mentiras que outras pessoas contam. Adicional a isso, todo que envolva alguma forma de Blefe para cima do Kalkan possuem sua dificuldade reduzida em duas categorias."
        ],
        "requisitos": "Raça Kalkan"
    },
    {
        "nome": "Favor Demoníaco",
        "pontos": "2",
        "descricao": [
            "Um Ogrekin raramente tem compaixão, piedade ou dó de alguém por quem ele não se importa de fato. Assim, um personagem com essa desvantagem tende a ser excessivamente cruel, maldoso e sanguinário (na maior parte do tempo), dificilmente conhecendo o significado de \"empatia\"."
        ],
        "requisitos": "Raça Ogrekin"
    },
    {
        "nome": "Auto-controle Desregulado",
        "pontos": "3",
        "descricao": [
            "Demonstrações de poder e lutas são apenas uma forma dos Ogrekins mostrarem do que são capazes - e muitas vezes, eles até preferem isso do que resoluções diplomáticas. Um personagem Ogrekin com essa desvantagem tem dificuldade em se controlar e não consegue segurar bem sua raiva quando provocado ou intimidado por qualquer motivo que for. Sempre que houverem testes que envolvam o atributo Força de Vontade o personagem receberá redutores (à critério do mestre) para tentar."
        ],
        "requisitos": "Raça Ogrekin"
    },
    {
        "nome": "Rei do Mundo",
        "pontos": "3",
        "descricao": [
            "Poder, fama, reconhecimento, dominação de terras e povos por todo o mundo - esse é o objetivo último de um Ogrekin (fora das suas ambições pessoais). Um personagem com essa desvantagem tem planos de ascensão mundial e quer a todo custo se tornar o ser mais poderoso, influente, conquistar riquezas inimagináveis e não medirá esforços para chegar nisso. Isso inclui a eliminação de qualquer pessoa em seu caminho, aliados, inimigos e até inocentes."
        ],
        "requisitos": "Raça Ogrekin"
    },
    {
        "nome": "Fedorento",
        "pontos": "3",
        "descricao": [
            "Poderia ser preconceito, poderia ser apenas um estereótipo, mas na verdade trata-se de um aspecto da fisiologia dos Orcs que está realmente presente: seu cheiro. Orcs possuem um cheiro mais forte que geralmente pode ser sentido à quase 8 metros de distância de onde estão, assim, testes de percepção para encontrar um personagem com essa desvantagem ganham a dificuldade reduzida em uma categoria e também faz com que o personagem ganhe penalidades em testes sociais devido ao seu cheiro (à critério do mestre)."
        ],
        "requisitos": "Raça Orc"
    },
    {
        "nome": "Uma vez Orc, sempre Orc",
        "pontos": "2",
        "descricao": [
            "Orcs possuem um hábito ruim (do ponto de vista de outras pessoas) de constantemente irritar, humilhar ou meramente atrapalhar a vida de outras pessoas com uma ação aqui e ali por parte deles. Dessa forma, um personagem com essa desvantagem geralmente gera inimizades mais facilmente e tende a ser considerado como alguém desagradável."
        ],
        "requisitos": "Raça Orc"
    },
    {
        "nome": "Rejeitado",
        "pontos": "3",
        "descricao": [
            "Por carregarem uma herança cultural e histórica carregada de guerras, sangue, morte, desolação e perdas para muitas pessoas, os Orcs acabaram sendo vinculados à uma figura de vilões do planeta por muitas culturas e sociedades. Além disso, para várias pessoas eles são motivo de ódio por seus ancestrais mais primais terem dizimado linhagens de sangue por inteiro. Assim, os Orcs são geralmente rejeitados, hostilizados e evitados em diversas sociedades pelo mundo, gerando complicações para os mesmos e perda de oportunidades."
        ],
        "requisitos": "Raça Orc"
    },
    {
        "nome": "Incompatibilidade Cibernética",
        "pontos": "3",
        "descricao": [
            "Quellsirs estão acostumados a viver em seus reinos subaquáticos, cercados por sua própria cultura, costumes, armas, construções e hábitos. Algo que nunca se encaixou bem na sociedade dessa raça foi o uso de eletrônicos e equipamentos muito modernos. Para os Quellsirs, a tecnologia destrói a natureza e ocupa seu lugar de forma maldosa... Justamente por isso, personagens com essa desvantagem tem dificuldade em lidar com aparelhos eletrônicos ou de qualquer complexidade tecnológica, além de serem incapazes de usar qualquer equipamento que use o atributo Tecnologia como principal fonte de dano."
        ],
        "requisitos": "Raça Quellsir"
    },
    {
        "nome": "O mundo da superfície não é minha casa",
        "pontos": "4",
        "descricao": [
            "Por nascerem e crescerem nas águas de mares, rios e lagos, os Quellsirs estão mais acostumados com ambientes úmidos / aquáticos do que viver na superfície em si, e por isso, acabam precisando de cuidados especiais com seu corpo. Um personagem com essa desvantagem precisa se hidratar constantemente e também ter sua pele umedecida para que não fique desidratado e perca sua força. A frequência que isso deve ocorrer é variável de cenário pra cenário, de mestre pra mestre e de jogador pra jogador, mas recomenda-se que o personagem tenha acesso à água ou algum líquido que não seja danoso à sua saúde à cada 2 horas fora da água."
        ],
        "requisitos": "Raça Quellsir"
    },
    {
        "nome": "Adicção Arcana",
        "pontos": "4",
        "descricao": [
            "A história de um povo não mente, e na verdade conta muito sobre o que eles foram e pra onde vão. Os Quellsir possuem uma imensa ligação com energias arcanas e elementais, mas o fascínio por estudar a arte do arcanismo é algo que sempre os moveu, afim de fazê-los cada vez mais poderosos e capazes de dobrar a força da natureza para o que desejavam. Dessa forma, um personagem com essa desvantagem possui um certo vício em estar em contato ou de usar energias arcanas, e deve saciar isso pelo menos uma vez por dia / episódio, o que acontecer primeiro. A forma como o personagem pode saciar isso deve ser escrita no perfil do personagem."
        ],
        "requisitos": "Raça Quellsir"
    },
    {
        "nome": "Chamado dos Indefesos",
        "pontos": "3",
        "descricao": [
            "Alguns Zaharis possuem um coração bom e uma boa conduta por natureza, não por quererem algo em troca, mas por acreditarem que uma regra da natureza é ajudar aqueles que não podem ter auto-suficiência ou capacidade de ajudarem à si mesmos no momento. Dessa forma, um Zahari dificilmente negará um pedido de ajuda e terá como prioridade, ajudar qualquer pessoa ou animal indefeso em uma condição em que seu status esteja inferiorizado por outra criatura ou situação. O Zahari tentará o seu melhor para deixar a situação justa para ambos os lados, sendo assim, um mediador da ordem."
        ],
        "requisitos": "Raça Zahari"
    },
    {
        "nome": "Curiosamente Inconveniente",
        "pontos": "3",
        "descricao": [
            "Os Zaharis costumam ter interesse por assuntos diversos - não precisa ser algo complexo nem algo muito exótico, as vezes, uma comida ou um costume de uma sociedade diferente da deles é o suficiente para ativar uma imensa curiosidade e sede de saber mais. Dessa forma, um Zahari com essa desvantagem não irá conseguir se concentrar em fazer qualquer outra coisa até descobrir tudo sobre aquele assunto ou se dar por satisfeito com uma larga quantidade de informações à respeito. Isso inclui o personagem não ser capaz de se importar com batalhas, situações sociais ou mesmo outras coisas de peso maior que a própria curiosidade."
        ],
        "requisitos": "Raça Zahari"
    },
    {
        "nome": "Piedade",
        "pontos": "2",
        "descricao": [
            "O personagem Zahari com essa desvantagem é extremamente pacifista e leva ao pé da letra os ensinamentos de que seres inteligentes não devem batalhar por algo, mas sim, chegar através do diálogo e resoluções diplomáticas, à uma solução. Assim, o personagem evita o máximo à entrar em combates e jamais irá ter coragem pra matar alguém, independente de quem for."
        ],
        "requisitos": "Raça Zahari"
    },
    {
        "nome": "Origem Real",
        "pontos": "4",
        "descricao": [
            "Todo mundo tem uma terra natal, intenções reais e uma identidade concreta. Isso não é diferente com os Yu'qun, entretanto, a identidade real dos mesmos é sempre um mistério e isso pode incluir de onde vieram, como vieram ou quais são seus objetivos verdadeiros. Por serem reservados, Yu'qun tendem a esconder isso por razões pessoais e dificilmente revelarão para alguém. Caso exposto ou caso a verdade venha à tona, o personagem sofrerá graves transtornos ou trará sofrimento para si ou para seus aliados. O jogador deve explicitar na história do personagem qual é essa origem, identidade ou objetivo."
        ],
        "requisitos": "Raça Yuqun"
    },
    {
        "nome": "Expressão de Mármore",
        "pontos": "3",
        "descricao": [
            "O traço mais marcante de um Yu'qun é a ausência de emoções e capacidade de se expressar frente as mesmas. Assim, o personagem com essa desvantagem não consegue se expressar emocionalmente e não sabe diferenciar quando está sentindo o que, dificilmente reconhecendo assim, o real valor ou significado das emoções (tanto próprias quanto dos outros)."
        ],
        "requisitos": "Raça Yuqun"
    },
    {
        "nome": "Crença de outro tempo",
        "pontos": "2",
        "descricao": [
            "Vindo de uma linha temporal diferente ou simplesmente de outra época (muito avançada ou muito retrógrada), o personagem Yu'qun com essa desvantagem acredita e segue religiões, ideais ou simbolismos que geram",
            "estranheza para outras pessoas. Isso gera penalidades em testes sociais toda vez em que ele bota suas crenças amostra ou outras pessoas questionam-na."
        ],
        "requisitos": "Raça Yuqun"
    },
    /* Desvantagens Comuns */
    {
        "nome": "Alergia",
        "pontos": "2",
        "descricao": [
            "O personagem tem alergia a alguma substância que ele deve definir e isso o afeta em todos os momentos em que a substância estiver em contato. Os efeitos negativos variam de acordo com o nível de exposição à substância."
        ]
    },
    {
        "nome": "Alergia Sobrenatural",
        "pontos": "4",
        "descricao": [
            "O personagem tem alergia a alguma substância que ele deve definir e isso o afeta em todos os momentos em que a substância estiver em contato com ele ou presente no ambiente próximo a ele. O personagem sofre redutores de 1 em todos os seus atributos de combate e redutores de 2 em atributos-teste enquanto estiver próximo a essa substância."
        ]
    },
    {
        "nome": "Amaldiçoado",
        "pontos": "2",
        "descricao": [
            "O personagem é amaldiçoado de alguma forma, desde ser perseguido por uma entidade sobrenatural, ter uma má sorte impressionante ou estar marcado para morrer por um fantasma (o jogador define na criação baseado em sua história)."
        ]
    },
    {
        "nome": "Amnésia",
        "pontos": "1",
        "descricao": [
            "O personagem não se recorda de sua verdadeira identidade, ou perdeu a memória recente (algumas semanas atrás ou meses). O jogador deve definir na história o motivo e como isso aconteceu."
        ]
    },
    {
        "nome": "Amor Perdido",
        "pontos": "2",
        "descricao": [
            "Você conheceu o amor verdadeiro, e agora ele se foi. Você fica melancólico sempre que te lembram do que você perdeu, recebendo -1 em testes de Atributo-Teste ou perícias até conseguir se recuperar."
        ]
    },
    {
        "nome": "Anacrônico",
        "pontos": "2",
        "descricao": [
            "O personagem não consegue usar equipamentos modernos, tem muita dificuldade de se adaptar à tecnologia. Isso faz com que o personagem não possa usar Equipamentos Tecnológicos ou usar qualquer tipo de equipamento que não seja básico e razoavelmente intuitivo para um ser vivo. O personagem também não pode colocar pontos na perícia \"Sistemas\" e falha automaticamente sempre que lidar com máquinas modernas."
        ]
    },
    {
        "nome": "Analfabetismo",
        "pontos": "1",
        "descricao": [
            "O Personagem não sabe ler ou escrever. Ele não pode investir pontos na perícia \"Linguagem\" e não pode ter nenhuma outra língua conhecida que não seja \"Comum\" e a natural da sua raça."
        ]
    },
    {
        "nome": "Aparência Engraçada",
        "pontos": "3",
        "descricao": [
            "A aparência do personagem é motivo de piada, causando penalidades em tratos sociais. As pessoas simplesmente não te levam a sério. Você falha automaticamente em qualquer teste social no qual a sua aparência acabe dominando muito (intimidação contra alguém que não conhece sua força) e mestres podem decidir te dar falhas automáticas em testes sociais quando apropriado."
        ]
    },
    {
        "nome": "Aparência Hedionda",
        "pontos": "3",
        "descricao": [
            "O personagem possui uma aparência monstruosa, que causa outras pessoas a serem mais hostis em relação a ele. Você falha automaticamente em alguns testes sociais relevantes (como sedução). Além disso, sua Aparência é reduzida para um valor igual à 1 e não pode ser maior do que isso."
        ]
    },
    {
        "nome": "Aparência Inofensiva",
        "pontos": "1",
        "descricao": [
            "Você simplesmente não parece uma ameaça. Isso pode acabar funcionando a seu favor às vezes, mas ninguém que não te conheça não vai pensar que você pode trazer problemas ou reagir de qualquer maneira."
        ]
    },
    {
        "nome": "Arrogante",
        "pontos": "2",
        "descricao": [
            "O personagem acredita ser o melhor, e tende a humilhar os demais. Isso pode causar inimizades e inimigos facilmente para o personagem."
        ]
    },
    {
        "nome": "Ascético",
        "pontos": "2",
        "descricao": [
            "Você não se importa com bens, riqueza ou poder temporário, glória ou com sua aparência. O mundo é apenas algo curto que está entre você e a próxima existência, e você não se prende a ele. Você tem só o que precisa e nada mais. Qualquer dinheiro que sobrar durante a criação da ficha é reduzido a 0 e seu personagem deve passar a história sem obter dinheiro ou itens que não precise de verdade (por exemplo, dormir no chão é tão bom quanto dormir num hotel)."
        ]
    },
    {
        "nome": "Assombrado",
        "pontos": "1 ou 3",
        "descricao": [
            "O personagem é perseguido por um fantasma, um espírito ou uma entidade etérea em busca de vingança, ou de solução para seus dramas pessoais. O jogador deve explicar os motivos e objetivos da assombração em sua história. A assombração pode aparecer frequentemente ou não. Caso o jogador queira que ela seja frequente, a desvantagem concede 3 pontos. Caso ele queira que ela seja esporádica, o custo é de 1 ponto."
        ]
    },
    {
        "nome": "Avareza",
        "pontos": "2",
        "descricao": [
            "O personagem jamais divide o que tem com ninguém, e tem com principal motivação acumular dinheiro. O custo aumenta para 3 caso o personagem seja do arquétipo Mercante Príncipe."
        ]
    },
    {
        "nome": "Azarado",
        "pontos": "1 ou 2",
        "descricao": [
            "1 Ponto: O personagem tem muita má sorte e sempre sofre contratempos em cenas importantes da aventura. O mestre determina como irá funcionar a má sorte do personagem. Quando você obtém uma falha critica, o efeito é aumentado 10 vezes.",
            "2 Pontos: Você é como um pára-raios para azar (ganhe todos os efeitos de 1 ponto dessa desvantagem e os extras dessa). Coisas ruins e desastrosas tendem a acontecer com você, sendo elas mortais ou não. Sempre que algo ruim for acontecer ao grupo, acontece com você primeiro. Caso o Mestre prefira, você pode simplesmente atrair coisas ruins e se ferrar bastante, não necessariamente levando o grupo consigo."
        ]
    },
    {
        "nome": "Baixa resistência à dor",
        "pontos": "2",
        "descricao": [
            "O personagem não lida bem com dor nem ameaças de dor. Se sendo machucado ou torturado de alguma forma, testes de Força de Vontade (FV) se tornam muito mais difíceis. O aumento de dificuldade deve ser de pelo menos uma categoria, mas o mestre pode decidir aumentar mais."
        ]
    },
    {
        "nome": "Bully",
        "pontos": "1",
        "descricao": [
            "O personagem adora irritar e humilhar aqueles que considera serem mais fracos. Essa desvantagem pode gerar inimigos futuros."
        ]
    },
    {
        "nome": "Carnívoro",
        "pontos": "2",
        "descricao": [
            "Sua espécie (ou você em particular), o que precisa ser explicado na sua história, é incapaz de processar alimentos que não sejam carnes. O que não for carne pode te encher e te matar a fome, mas não vai realmente te alimentar. Comer o que não é carne também não é saudável para você."
        ]
    },
    {
        "nome": "Casamento de encomenda",
        "pontos": "3",
        "descricao": [
            "Seu personagem está noivo. Infelizmente, o casamento não está destinado a o deixar feliz. Talvez ele esteja para se casar com algum inimigo, ou talvez esteja para se casar com alguém realmente ignorante ou irritante. Independente do caso, a família do personagem deseja que ele obedeça e se case. O casamento deve acontecer em menos de um ano e você não deseja que ele aconteça. O pior é que a pessoa com quem seu personagem deve se casar também não está nada feliz com isso. No melhor dos casos, você está destinado a viver em uma casa fria e triste, preso a um casamento político. No pior dos casos, pode estar se casando com um espião ou o casamento pode ser uma trama para destruir sua família por dentro."
        ]
    },
    {
        "nome": "Cauteloso",
        "pontos": "2",
        "descricao": [
            "O personagem evita entrar em perigo e planeja excessivamente suas ações."
        ]
    },
    {
        "nome": "Cego",
        "pontos": "3",
        "descricao": [
            "O personagem perdeu completamente sua visão por algum motivo. O personagem treinou muito e ainda é capaz de operar em combate através dos outros sentidos, mas falha automaticamente em qualquer teste que dependa exclusivamente de visão. Além disso, recebe -4 em todos os outros testes de Percepção quando visão é um fator importante. Em combate, você não sofre penalidades quando enfrenta inimigos invisíveis ou outras táticas similares."
        ]
    },
    {
        "nome": "Cético",
        "pontos": "1",
        "descricao": [
            "O personagem tem dificuldades em acreditar em histórias sem evidência."
        ]
    },
    {
        "nome": "Chantagem",
        "pontos": "4",
        "descricao": [
            "Alguém em algum lugar sabe um segredo obscuro seu ou algum terrível feito do passado que você tenha cometido em algum momento de fraqueza. O que é pior: essa (ou essas) pessoa(s) tem como objetivo fazer você pagar por isso. A pessoa que te chantageia sempre sabe onde você está de alguma forma, e periodicamente faz certas exigências de você em troca de não contar o seu segredo. Você é obrigado a cumprir essas exigências sempre que aparecerem ou então seu segredo virá à tona e você sofrerá as consequências disso (psicológica e socialmente). O jogador deve definir na história quem é que sabe do segredo do personagem, como essa pessoa é (em termos de personalidade) e qual é esse segredo temível."
        ]
    },
    {
        "nome": "Chiclete de Monstro",
        "pontos": "5",
        "descricao": [
            "O personagem é sempre o primeiro a ser atacado por inimigos ou é geralmente a escolha preferida dos mesmos. Em combate isso significa que ele sempre será o primeiro a ser atacado pelos inimigos, fora de combate isso significa que ele será o alvo preferido por inimigos que estejam atrás do grupo."
        ]
    },
    {
        "nome": "Ciúme Doentio",
        "pontos": "2",
        "descricao": [
            "O personagem possui um interesse amoroso por quem sente ciúmes doentios, que o leva a ações insanas."
        ]
    },
    {
        "nome": "Claustrofobia",
        "pontos": "4",
        "descricao": [
            "O personagem sofre penalidade nos testes de medo quando entra em ambientes muito pequenos. Esses são testes de força de vontade que começam com dificuldade 6 e acontecem toda vez que o mestre estiver com vontade de os fazer (mas pelo menos 1 por cena apropriada). O teste vai ficando cada vez mais difícil, ao falhar seu personagem entra em pânico e PRECISA sair dali."
        ]
    },
    {
        "nome": "Cleptomania",
        "pontos": "3",
        "descricao": [
            "O personagem não consegue evitar roubar, quando surge uma oportunidade. Caso o personagem seja do arquétipo: Ladrão, esta desvantagem concede 1 ponto ao invés de três."
        ]
    },
    {
        "nome": "Código de conduta rígido",
        "pontos": "2",
        "descricao": [
            "O personagem segue um código de conduta rígido e jamais o quebra. Se quebrar ganha muitas penalidades. É interessante o jogador explicar como seria esse código e em quais condições aconteceria em sua história."
        ]
    },
    {
        "nome": "Colecionador Compulsivo",
        "pontos": "2",
        "descricao": [
            "O personagem possui uma obsessão de colecionar um determinado tipo de objeto, item ou coisa em específico. O jogador deve explicitar qual tipo de objeto é na história do personagem."
        ]
    },
    {
        "nome": "Complexo de Inferioridade",
        "pontos": "2",
        "descricao": [
            "O personagem possui baixa autoestima e está sempre se desculpando por suas imaginárias limitações. Testes de intimidação ou convencimento contra você tem suas dificuldades reduzidas em uma categoria."
        ]
    },
    {
        "nome": "Confiança Cega",
        "pontos": "4",
        "descricao": [
            "O personagem tem excesso de confiança em si mesmo, ao ponto de cometer atos insanos. Você nunca pode desistir de um confronto. Além disso, o personagem sempre assume que obteve sucesso, mesmo quando falhou claramente. Como um exemplo: Se você falha em um teste de disfarce e alguém percebe, você simplesmente não desiste do plano original até que a escolha seja retirada de suas mãos, a ideia de ter cometido um erro é algo que nem passa pela sua cabeça."
        ]
    },
    {
        "nome": "Corcunda",
        "pontos": "3",
        "descricao": [
            "O personagem tem uma corcunda que causa grande penalidade em testes sociais e de agilidade. Você recebe -2 em testes sociais e sua Agilidade é reduzida permanentemente em 1 ponto."
        ]
    },
    {
        "nome": "Corpo Alienígina",
        "pontos": "3",
        "descricao": [
            "Possui uma forma e uma fisiologia completamente diferente do normal, afetando testes sociais e testes de cura. O personagem ainda pode escolher uma raça, mas seu corpo e sua aparência possuirão altas diferenças do padrão. Equipamentos normais não servem para você e você precisa gastar 50% mais dinheiro em qualquer equipamento comprado, além de só poder fazer por encomenda (equipamentos precisam ser feitos especialmente para você). Quando interagindo com um personagem da sua raça original, você recebe -2 em quaisquer testes sociais."
        ]
    },
    {
        "nome": "Corrupção Moral Crônica",
        "pontos": "1",
        "descricao": [
            "O personagem está progressivamente se tornando mal ou corrupto em direção a algum objetivo ou coisa que queira muito."
        ]
    },
    {
        "nome": "Covarde",
        "pontos": "2",
        "descricao": [
            "Você é muito cuidadoso e evita situações que fossem te pôr em perigo sério. Quando for participar de algo perigoso, o mestre pode decidir realizar testes de Força de Vontade. Uma falha significa que o personagem não consegue se controlar e vai fazer o que precisar fazer para sair dessa situação, evitando apenas se colocar em uma situação mais perigosa ainda. Testes sociais podem se tornar mais difícil quando o outro personagem sabe que você é um covarde."
        ]
    },
    {
        "nome": "Credulidade",
        "pontos": "3",
        "descricao": [
            "O personagem acredita em praticamente tudo que lhe dizem. Testes de blefe contra você tem sua dificuldade reduzida em duas categorias e você recebe um redutor de -5 em testes de percepção para detectar mentiras. Isso não significa que você precisa acreditar em histórias implausíveis."
        ]
    },
    {
        "nome": "Criança",
        "pontos": "5",
        "descricao": [
            "O personagem é equivalente a uma criança humana, fisicamente. Sua Força (FOR) e Constituição (CON) possuem um valor igual à 1 e não podem ser maiores do que isso. Sua Agilidade (AGI) não pode ser maior do que 3. Essa desvantagem não pode ser comprada junto de outras desvantagens que reduzam Força ou Constituição."
        ]
    },
    {
        "nome": "Crença não-convencional",
        "pontos": "1",
        "descricao": [
            "O personagem segue algum tipo de religião pagã ou estranha, diferente das socialmente aceitas. Isso causa penalidades nos testes sociais."
        ]
    },
    {
        "nome": "Curioso",
        "pontos": "2",
        "descricao": [
            "O personagem não consegue evitar saciar sua curiosidade, mesmo em detrimento do seu bem estar e de outros."
        ]
    },
    {
        "nome": "Daltônico",
        "pontos": "1",
        "descricao": [
            "O personagem tem dificuldades de diferenciar ou enxergar cores."
        ]
    },
    {
        "nome": "Deficiência Auditiva",
        "pontos": "2",
        "descricao": [
            "O personagem não consegue escutar bem ou é completamente surdo. O personagem aprendeu a lidar com isso em combate, mas isso causa falha automática em testes de percepção quando audição é um fator importante."
        ]
    },
    {
        "nome": "Decepado",
        "pontos": "4",
        "descricao": [
            "O personagem não possui um membro do corpo por algum motivo que deve ser explicado na história do personagem, seja por uma catástrofe ou condições adversas do nascimento do mesmo. O personagem fica incapaz de realizar ações que necessitem exclusivamente daquele membro ou então recebe uma penalidade de -4 em testes que envolvam o membro decepado (no caso de ter uma das pernas perdidas, o personagem ainda poderia tentar correr, mas teria grandes dificuldades)."
        ]
    },
    {
        "nome": "Delirante",
        "pontos": "2",
        "descricao": [
            "O  personagem sofre com delírios aleatórios ou específicos referente a algum evento traumático de seu passado. Caso seja relacionado com um evento o jogador deve explicar o motivo dos delírios na história do personagem."
        ]
    },
    {
        "nome": "Dependente",
        "pontos": "2",
        "descricao": [
            "O personagem é dependente de alguém ou alguma coisa para sua sobrevivência. O jogador deve especificar quem é essa pessoa ou coisa de que o personagem depende em sua história."
        ]
    },
    {
        "nome": "Depressivo",
        "pontos": "2",
        "descricao": [
            "O personagem sofre de depressão profunda e tem pensamentos suicidas, principalmente em momentos de estresse. Dentro de combate isso pode fazer com que eventualmente o personagem perca a vez enquanto sofre uma recaída."
        ]
    },
    {
        "nome": "Desatento",
        "pontos": "3",
        "descricao": [
            "O personagem se distrai muito fácil, portanto, não reage a eventos tão rapidamente como seus demais companheiros. Como resultado disso, ele pode acabar não conseguindo reagir em certas situações e acontecimentos que requerem uma ação rápida, e em combate, isso faz com que o personagem não seja capaz de agir durante rodadas ou combate surpresas (na fase de preparação, exclusivamente)."
        ]
    },
    {
        "nome": "Destino Cruel",
        "pontos": "5",
        "descricao": [
            "Existe um destino de extrema significância esperando por você, e infelizmente não é algo feliz. Seu personagem está fadado à morrer ou ficar completamente inútil de alguma forma onde não possa mais ser ele mesmo em algum ponto da história e isso acontecerá independente dos esforços do personagem. Antes de sua morte, você irá lançar uma profunda escuridão no mundo de alguma forma. Talvez você permitirá que a receita do poder total caia nas mãos dos seus inimigos, talvez você permitirá com a sua falha que um reino inteiro seja destruído e milhares de vidas serão perdidas. Uma vez por sessão, sempre que você for ferido ao ponto de morrer ou falhar em testes que levariam à sua morte, você então apenas fica inconsciente ou fora de perigo (mas inutilizado momentaneamente). Essa desvantagem não pode ser comprada em conjunto com vantagens que tenham a ver com a longevidade do personagem (como imortalidade, por exemplo)."
        ]
    },
    {
        "nome": "Dislexia",
        "pontos": "1",
        "descricao": [
            "O personagem tem grande dificuldade de leitura, recebendo inferioridade em testes relacionados."
        ]
    },
    {
        "nome": "Distraído",
        "pontos": "2",
        "descricao": [
            "O personagem sofre inferioridade em testes de Percepção e tem dificuldade de se concentrar em uma tarefa."
        ]
    },
    {
        "nome": "Dívida",
        "pontos": "2 ou 4",
        "descricao": [
            "Você tem uma dívida com alguém e algum dia eles virão cobrar. Por 2 pontos é alguma dívida pequena e a cobrança vai te trazer alguma inconveniência, sem realmente te ameaçar. Por 4 pontos é uma dívida bem grande e a cobrança, igualmente, exigirá riscos grandes."
        ]
    },
    {
        "nome": "Doente Terminal",
        "pontos": "2",
        "descricao": [
            "O personagem sofre de uma doença terminal e tem penalidades em testes que envolvam força física, constituição, agilidade, etc. Eventualmente este personagem está fadado a morrer e pode vir a falecer mais cedo do que o normal."
        ]
    },
    {
        "nome": "Dupla Personalidade",
        "pontos": "3",
        "descricao": [
            "O personagem possui duas personalidades diferentes, sendo uma necessariamente a dominante que está presente na maior parte do tempo. É necessário que o jogador descreva como são as duas personalidades e se necessário, quando as alterações de personalidade podem se manifestar (alguma situação tensa, efeito traumático, memórias, etc)."
        ]
    },
    {
        "nome": "Egoísta",
        "pontos": "1",
        "descricao": [
            "O personagem só se preocupa com si mesmo e pode deixar seus aliados de fora de seus planos frequentemente."
        ]
    },
    {
        "nome": "Empatia Médium",
        "pontos": "1",
        "descricao": [
            "Você sempre é capaz de dizer quando alguém está com algum sentimento forte e você sabe exatamente qual. Isso acontece por você copiar, involuntariamente, qualquer sentimento forte perto de você. Se alguém estiver depressivo a ponto de suicídio, você ficaria igual. Da mesma forma, se alguém estiver muito feliz, você também ficará!"
        ]
    },
    {
        "nome": "Enxaqueca",
        "pontos": "2",
        "descricao": [
            "O personagem sofre periodicamente de enxaquecas fortíssima que criam dificuldades para ele durante esse período. Enquanto sofrendo da enxaqueca, o personagem sofre de inferioridade em todos os testes."
        ]
    },
    {
        "nome": "Epilepsia",
        "pontos": "4",
        "descricao": [
            "O personagem sofre periodicamente com crises epilépticas, que o deixam completamente incapacitado. Em combate, isso se traduz em uma chance de 5% (1d100 = 5) no inicio de todos os seus turnos. O mestre pode te pedir outros testes durante a sessão, obtendo o mesmo resultado."
        ]
    },
    {
        "nome": "Escravo",
        "pontos": "4",
        "descricao": [
            "O personagem é escravo de algum mestre, e pode ser vendido para outro mestre ou sacrificado, se o mestre assim o desejar. O jogador deve especificar quem é o mestre e por que o personagem é um escravo em sua história."
        ]
    },
    {
        "nome": "Estigma Social",
        "pontos": "2",
        "descricao": [
            "Por algum motivo, o personagem é estigmatizado socialmente e rejeitado por aonde vai. O jogador deve explicar por que o personagem sofre disso em sua história."
        ]
    },
    {
        "nome": "Eterna Fraqueza",
        "pontos": "3",
        "descricao": [
            "O personagem não conseguiu desenvolver seus músculos e algo o impede de o fazer no futuro, resultando em um personagem tão fraco quanto uma criança. A Força (FOR) do personagem é reduzida a 1 e não pode ser maior do que isso."
        ]
    },
    {
        "nome": "Extremamente Alto",
        "pontos": "2",
        "descricao": [
            "Sua altura é muito maior que a média, as pessoas o tratam quase como um monstro. Você tem dificuldades de andar em ônibus, de se mover em espaços pequenos, lugares com teto baixo, etc. O personagem sofre penalidades ou inferioridade (o mestre escolhe dependendo da situação) em testes de esquivas, movimento e defesas onde sua altura possa o prejudicar."
        ]
    },
    {
        "nome": "Extremamente Preguiçoso",
        "pontos": "1",
        "descricao": [
            "O personagem tem muita dificuldade de encontrar motivação para o que quer que seja fazendo com que seja afetado de variadas formas dentro e fora de combate (principalmente). Ele pode receber inferioridade em rolagens que necessitem que ele saia da sua zona de conforto ou faça algo que não quer."
        ]
    },
    {
        "nome": "Falta de Confiança",
        "pontos": "3",
        "descricao": [
            "O seu personagem pode ser realmente bom em algo, mas ele simplesmente não confia na sua própria habilidade. Ele treina e treina, mas ainda não é excelente. O conhecimento está lá, mas a dúvida também. Escolha uma perícia na qual você tem pelo menos nível 3. Sempre que você rolar um sucesso naquela perícia, role o teste novamente. Você só obtém sucessos com aquela perícia quando rola dois sucessos."
        ]
    },
    {
        "nome": "Fanático",
        "pontos": "2",
        "descricao": [
            "O personagem tem uma crença fanática em uma religião, ideologia ou até um ídolo. Causa penalidade em testes sociais."
        ]
    },
    {
        "nome": "Feio de Doer",
        "pontos": "2",
        "descricao": [
            "O personagem é muito feio. Seu atributo secundário Aparência, originalmente igual à sua Carisma, é reduzido para um valor igual à 1 e não pode ser maior do que isso. Aparência é usada no lugar de Carisma para testes de sedução."
        ]
    },
    {
        "nome": "Ferida Permanente",
        "pontos": "2",
        "descricao": [
            "O personagem possui algum machucado de origem sobrenatural que nunca poderá ser curado. Por causa disso, o HP atual do personagem nunca alcança seu HP máximo, ficando, no máximo, um ponto abaixo dele."
        ]
    },
    {
        "nome": "Fiel",
        "pontos": "4",
        "descricao": [
            "O personagem é capaz de dar a própria vida por seus amigos, sem pensar duas vezes. Às vezes o excesso de fidelidade faz com que o personagem faça coisas que os seus aliados não queriam que fizesse."
        ]
    },
    {
        "nome": "Fobia",
        "pontos": "1",
        "descricao": [
            "O personagem possui um medo irracional de alguma coisa, criatura, pessoal, situação, etc. A fobia deve ser especificada na história do personagem."
        ]
    },
    {
        "nome": "Frágil",
        "pontos": "3",
        "descricao": [
            "O personagem não aguenta muito dano em combate e se machuca muito mais facilmente do que deveria, independente do caso. Reduza sua RD Geral em -1, sempre."
        ]
    },
    {
        "nome": "Fraqueza Especial",
        "pontos": "2",
        "descricao": [
            "O personagem tem algum tipo de fraqueza, pela qual sofre penalidades. Tal fraqueza deve ser explicitada na história do personagem. Quando a fraqueza estiver ativa, o personagem pode sofrer inferioridade em todas as suas rolagens ou outras penalidades que o mestre desejar."
        ]
    },
    {
        "nome": "Fraqueza Sobrenatural",
        "pontos": "4",
        "descricao": [
            "O personagem possui algum tipo de ponto fraco, que causa o dobro de dano ou pode levá-lo à morte instantaneamente. Tal fraqueza deve ser explicitada na história do personagem. Com 3 pontos a fraqueza faz com que o personagem receba o dobro de dano enquanto ela estiver ativa. Com 5 pontos o personagem morre instantaneamente quando a fraqueza ficar ativa por muito tempo."
        ]
    },
    {
        "nome": "Galinha",
        "pontos": "1 ou 2",
        "descricao": [
            "1 Ponto: Seu personagem tem o hábito de paquerar um membro do sexo oposto (ou do mesmo sexo) sempre que possível. Isso pode trazer complicações sociais para o personagem e raramente traz alguma sorte pro mesmo, uma vez que ele acaba sendo mal visto pelo personagem paquerado.",
            "2 Pontos: O personagem é extremamente paquerador e nunca perderá uma chance de dar em cima de um alvo desejado, sendo muito inconveniente e as vezes tornando-se um admirador obsessivo e incansável."
        ]
    },
    {
        "nome": "Gagueira",
        "pontos": "2",
        "descricao": [
            "O personagem é gago, sofrendo assim, penalidades em testes sociais devido a dificuldade para passar informações. O personagem sofre penalidades ou inferioridade em todos os testes de Diplomacia, Intimidação e Atuação onde a sua voz for relevante."
        ]
    },
    {
        "nome": "Generosidade Exagerada",
        "pontos": "2",
        "descricao": [
            "O personagem é incapaz de ficar com algo para si, quer sempre compartilhar tudo que tem. Isso pode variar desde informações quanto espólios de um combate ou mesmo objetos próprios."
        ]
    },
    {
        "nome": "Hábitos Pessoais Odiosos",
        "pontos": "2",
        "descricao": [
            "O personagem possui hábitos odiosos, que causam repulsa social."
        ]
    },
    {
        "nome": "Herbívoro",
        "pontos": "2",
        "descricao": [
            "Sua espécie (ou você em particular), o que precisa ser explicado na sua história, é incapaz de processar alimentos que não sejam plantas. O que não for plantas pode te encher e te matar a fome, mas não vai realmente te alimentar. Comer o que não é planta também não é saudável para você."
        ]
    },
    {
        "nome": "Heróico",
        "pontos": "4",
        "descricao": [
            "O personagem nunca recusa um pedido de ajuda, mesmo que isso custe sua própria vida."
        ]
    },
    {
        "nome": "Honestidade Radical",
        "pontos": "4",
        "descricao": [
            "O personagem sempre fala a verdade, não importando a ocasião."
        ]
    },
    {
        "nome": "Identidade Errada",
        "pontos": "3",
        "descricao": [
            "O personagem possui uma semelhança impressionante com um importante e famoso criminoso ou vilão. O jogador deve explicitar com quem ele geralmente é confundido na sua história."
        ]
    },
    {
        "nome": "Identidade Secreta",
        "pontos": "3",
        "descricao": [
            "O personagem possui uma identidade secreta que, se revelada, causará transtornos e sofrimento para os seus conhecidos e para si próprio. O jogador deve explicitar porque essa identidade secreta é importante."
        ]
    },
    {
        "nome": "Idoso",
        "pontos": "2",
        "descricao": [
            "O personagem possui uma idade avançada para a sua raça, sofrendo assim penalidades generalizadas em todos os atributos em certas ações ou inferioridade em ações físicas e mentais (a critério do mestre)."
        ]
    },
    {
        "nome": "Imbecil",
        "pontos": "3",
        "descricao": [
            "O personagem é burro como uma porta. Ele possui penalidades e/ou inferioridade em qualquer tipo de teste de conhecimento e pode eventualmente falar besteiras absurdas. Sua Inteligência (INT) é reduzida para um valor igual à 1 e não pode ser maior do que isso."
        ]
    },
    {
        "nome": "Impulsividade",
        "pontos": "1",
        "descricao": [
            "Personagem não consegue controlar suas emoções, irrita-se facilmente e fala o que der na telha."
        ]
    },
    {
        "nome": "Imunidade Baixa",
        "pontos": "3",
        "descricao": [
            "O corpo do personagem é fraco. Ele fica doente com facilidade e não resiste muito bem a nenhuma ameaça, como venenos, calor intenso, frio intenso, feridas e machucados de todos os tipos, etc... Seus ossos também se quebram facilmente. A Constituição (CON) do personagem é reduzida a 1 e não pode ser maior do que isso."
        ]
    },
    {
        "nome": "Incompatibilidade com Eletrônicos",
        "pontos": "1",
        "descricao": [
            "O personagem causa avaria e problemas ao usar um dispositivo eletrônico, não consegue usar nada de alta tecnologia sem causar dano ou estragá-los."
        ]
    },
    {
        "nome": "Incompetência",
        "pontos": "2",
        "descricao": [
            "O personagem tem penalidade em todos os testes que envolvam perícias ou habilidades profissionais. Essa desvantagem afeta diretamente qualquer ofício que o personagem tenha, causando uma penalidade fixa de -2 em qualquer teste envolvendo alguma perícia Emprego e também é adicionada quando o personagem fizer qualquer coisa relacionada a trabalho."
        ]
    },
    {
        "nome": "Inexperiente",
        "pontos": "2",
        "descricao": [
            "O personagem começa com 3 pontos de perícia a menos. Também escolha três perícias: essas perícias começam no nível -2, exigindo 7 pontos para atingirem o nível 5."
        ]
    },
    {
        "nome": "Infantil",
        "pontos": "1",
        "descricao": [
            "O personagem age como se fosse uma criança, possuem emoções simples e impulsividade, ciúmes etc. Ele também é muito ingênuo."
        ]
    },
    {
        "nome": "Inimigo Pessoal",
        "pontos": "3 ou 5",
        "descricao": [
            "O personagem possui um inimigo pessoal, que o persegue durante as aventuras. O inimigo sempre tem nível superior ao seu e pode ser bem poderoso, influente e ter capangas. Essa desvantagem concede 3 pontos para um inimigo de nível equivalente ao seu e 5 pontos para um inimigo de nível superior ao seu."
        ]
    },
    {
        "nome": "Inimigos",
        "pontos": "5",
        "descricao": [
            "O personagem possui inimigos múltiplos, organizações, gangues, máfias que estão ao seu encalço."
        ]
    },
    {
        "nome": "Insônia",
        "pontos": "4",
        "descricao": [
            "O personagem tem dificuldades de dormir, e na maior parte do tempo realmente não consegue dormir e descansar apropriadamente. Isso causa diversas penalidades na vida do personagem, como fadiga, inferioridade / penalidades em atributosteste (dependendo de quantos dias o personagem não dormiu) e quando o personagem dormir ele sempre recupera um ponto de Stamina a menos, nunca ficando com sua Stamina no máximo através desse método. Essa desvantagem não pode coexistir com a vantagem \"Não Dorme\"."
        ]
    },
    {
        "nome": "Jogo Compulsivo",
        "pontos": "2",
        "descricao": [
            "O personagem tem o vício de jogar compulsivamente, não consegue parar de gastar todo o seu dinheiro ou pertences em apostas."
        ]
    },
    {
        "nome": "Lento",
        "pontos": "3",
        "descricao": [
            "O personagem é muito mais lento do que o normal tem penalidade no deslocamento e sempre fica por último nos testes de iniciativa. Sua Agilidade (AGI) é reduzida para um valor igual à 1 e não pode ser maior do que isso."
        ]
    },
    {
        "nome": "Língua Solta",
        "pontos": "2",
        "descricao": [
            "O personagem é incapaz de guardar segredos e tem que fazer testes de Força de Vontade para se controlar. Ele recebe inferioridade nesses testes onde se controlar é importante. Quebrar a confiança de alguém é a forma mais rápida de se perder um amigo para sempre."
        ]
    },
    {
        "nome": "Línguagem Focada",
        "pontos": "2",
        "descricao": [
            "O personagem nunca aprendeu a linguagem Comum e portanto, não pode se comunicar da maneira mais usual conhecida. Se você não souber nenhuma outra língua, você não sabe se comunicar com outras pessoas. Linguagem Focada não é recomendável caso o personagem não saiba falar nenhuma língua que algum outro personagem do grupo fale."
        ]
    },
    {
        "nome": "Loucura",
        "pontos": "2",
        "descricao": [
            "O personagem tem algum tipo de distúrbio psiquiátrico, esquizofrenia, mania, paranóia, delírios e isso eventualmente a afeta nas horas mais inoportunas. As penalidades ou inferioridade oriunda das crises de loucura são definidas pelo Mestre."
        ]
    },
    {
        "nome": "Má Reputação",
        "pontos": "2",
        "descricao": [
            "O personagem tem um passado sombrio, que o persegue por todos os lugares. Pode ser um ex-criminoso, acusado de um crime que não cometera ou relacionado com algum passado obscuro. O jogador deve explicitar o motivo da má reputação na história do personagem."
        ]
    },
    {
        "nome": "Manco",
        "pontos": "2",
        "descricao": [
            "O personagem possui uma penalidade no deslocamento e em qualquer outro tipo de teste que envolva correr ou andar. A iniciativa do personagem é sempre reduzida pela metade também."
        ]
    },
    {
        "nome": "Máquina de Guerra",
        "pontos": "4",
        "descricao": [
            "Seu personagem é incapaz de não testar sua força contra inimigos poderosos. Quanto mais forte o inimigo, mais vontade ele tem de tentar, mesmo que vá perder ou até acabar morto. Seu personagem gosta tanto de lutar ou se testar que simplesmente não pode se controlar.",
            "Da mesma forma, seu personagem não irá participar de nenhum plano para se livrar de uma ameaça grande se isso for resultar em não poder lutar contra a ameaça diretamente. Se é orgulho, vontade de aprender ou o que for você que decide. Seu personagem não precisa querer matar essas pessoas, pode só querer lutas amigáveis."
        ]
    },
    {
        "nome": "Medroso",
        "pontos": "1",
        "descricao": [
            "O personagem não tem nenhuma coragem e busca sempre não se envolver em combates ou eventos perigosos. Ele pode receber inferioridade em testes onde precisa fazer algo que não tem coragem natural para fazer."
        ]
    },
    {
        "nome": "Megalomania",
        "pontos": "2",
        "descricao": [
            "O personagem tem planos mirabolantes de ascensão à fama internacional, riquezas incomensuráveis ou de conquista mundial."
        ]
    },
    {
        "nome": "Mente Fraca",
        "pontos": "3",
        "descricao": [
            "O personagem é facilmente manipulado por outros, habilidades que tenham efeito de dominação mental ou feitiços que alteram o comportamento / obediência do personagem acertam automaticamente. Fora de combate, o personagem acredita facilmente em tudo o que lhe dizem e não procura investigar muito o porquê das coisas. Sua Força de Vontade (FV) é reduzida para um valor igual à 1 e não pode ser maior do que isso."
        ]
    },
    {
        "nome": "Mentira Compulsiva",
        "pontos": "2",
        "descricao": [
            "O personagem mente compulsivamente, inventa histórias fictícias sobre si e seus companheiros para ganhar vantagens. Alvos que tentarem Discernir a verdade do personagem mentiroso, ganham superioridade."
        ]
    },
    {
        "nome": "Morte pelo Sol",
        "pontos": "3",
        "descricao": [
            "O personagem morre se exposto ao sol. Ele pode explodir, queimar totalmente, virar pó, etc. Isso pode ser resolvido se o personagem estiver protegido por armaduras, jóias especiais, mantos longos e coisas do tipo...Contato direto com a pele do personagem causa sérios danos."
        ]
    },
    {
        "nome": "Mudo",
        "pontos": "2",
        "descricao": [
            "O personagem é incapaz de se comunicar verbalmente."
        ]
    },
    {
        "nome": "Necessidades respiratórias especiais",
        "pontos": "3",
        "descricao": [
            "O personagem respira apenas uma atmosfera ou gás totalmente diferente do normal. Oxigênio é como um veneno para ele, portanto o jogador deve explicar o porquê disso na história do personagem. Essa desvantagem inclui eventuais aparelhos que suprem a necessidade especial do personagem. Um oponente pode tentar atacar seu equipamento ao receber -4 no teste de Ataque. Caso ele acerte ele não causa dano, mas seu equipamento é destruído e você morrerá se não houver um substituto disponível."
        ]
    },
    {
        "nome": "Nervos à flor da pele",
        "pontos": "2",
        "descricao": [
            "O personagem tem baixa força de vontade e não consegue se controlar, estourando de raiva por qualquer motivo. O personagem recebe penalidades ou inferioridade em teste do atributo Força Vontade (FV)."
        ]
    },
    {
        "nome": "Obcecado",
        "pontos": "2",
        "descricao": [
            "O personagem possui uma obsessão severa com algo, e tal obsessão atrapalha totalmente sua vida, dando penalidades nos testes sociais, por exemplo."
        ]
    },
    {
        "nome": "Obeso",
        "pontos": "1",
        "descricao": [
            "O personagem está muito acima do seu peso normal, tem penalidades em todos os testes que envolvam exercício físico e movimentação. O personagem se adaptou a esse problema em relação a combate e não recebe penalidades lá."
        ]
    },
    {
        "nome": "Objeto de valor sentimental",
        "pontos": "2",
        "descricao": [
            "Seu personagem possui algum item com um valor fora do normal para ele...",
            "Escolha algum objeto que faz parte da história do seu personagem (pode ser qualquer tipo de item e até equipamentos comprados ou criados por alguma vantagem). Ele é MUITO importante para seu personagem e seu personagem daria a própria vida para evitar que esse objeto fosse perdido."
        ]
    },
    {
        "nome": "Olhos deficientes",
        "pontos": "2",
        "descricao": [
            "O personagem não consegue ver bem, possui algum tipo de deficiência visual, seja uma miopia fortíssima ou outro problema. O problema pode ser consertado por meio de lentes ou óculos. O personagem tem penalidade ou inferioridade em testes de Percepção e pode eventualmente receber penalidades em testes de mira / precisão."
        ]
    },
    {
        "nome": "Ovelha Negra",
        "pontos": "3",
        "descricao": [
            "Seja lá qual for a razão, você é a ovelha negra da sua família e eles frequentemente se sentem enojados e desprezam suas ações. Você pode escolher se foi mandado para fora da sua família ou se é só mal visto mesmo, e deve explicar porque o contexto da sua família te torna tão diferente. Sempre que fizer algum teste social ou alguma cena que envolva sua família, dificilmente alguém te dará crédito ou vai querer te levar em consideração."
        ]
    },
    {
        "nome": "Pacifista",
        "pontos": "1",
        "descricao": [
            "O personagem evita o combate de todas as formas e jamais irá matar alguém. Ele odeia entrar em combates, mesmo que disso dependa sua vida."
        ]
    },
    {
        "nome": "Paranóico",
        "pontos": "2",
        "descricao": [
            "O personagem acha que está sendo perseguido e não consegue confiar em ninguém muito profundamente."
        ]
    },
    {
        "nome": "Passado Negro",
        "pontos": "2",
        "descricao": [
            "O personagem possui um segredo em seu passado, pode ser um crime, uma maldição, um trauma horrendo, e isso atrapalha seus relacionamentos e sua sanidade. Pessoas não ficam felizes quando descobrem esse passado negro."
        ]
    },
    {
        "nome": "Pequena Maldição",
        "pontos": "1",
        "descricao": [
            "Seu personagem foi alvo de alguma maldição bem simples (e boba) ou simplesmente nasceu com o universo conspirando contra ele de alguma forma menor.",
            "Inclui coisas como sempre sair em fotos de olhos fechados ou um cabelo que se recusa a ficar arrumado não importa o que aconteça. Defina como ele ganhou essa maldição e qual ela é na história do mesmo."
        ]
    },
    {
        "nome": "Pesadelos Constantes",
        "pontos": "2",
        "descricao": [
            "O personagem tem pesadelos quase todas as noites, que lhe dão penalidades em tratos sociais e em sua sanidade."
        ]
    },
    {
        "nome": "Pior de ambos os lados",
        "pontos": "4",
        "descricao": [
            "Escolha uma raça primária e uma raça secundária. Você é uma mistura das duas raças, contendo as partes negativas de ambas. Escolha um dos atributos-teste que uma das raças forneceria um bônus de +1 (+2 pontos de vantagens é uma opção caso Humano seja escolhido). Você não recebe outros bônus raciais, apenas o que escolheu. Você não ganha acesso às vantagens raciais de nenhuma das raças, mas ganha acesso à todas as desvantagens raciais de ambas. Não é compatível com a vantagem \"Melhor de ambos os lados\" nem com a raça Changeling."
        ]
    },
    {
        "nome": "Pobreza",
        "pontos": "3",
        "descricao": [
            "O personagem é completamente pobre, e excluído socialmente. Penalidade em relações sociais. Reduza sua quantidade inicial de dinheiro para 300."
        ]
    },
    {
        "nome": "Preconceituoso",
        "pontos": "2",
        "descricao": [
            "Seu personagem tem várias crenças bem marretadas dentro da sua cabeça e não as muda facilmente. Isso pode ir desde preconceitos que o fazem desprezar outros quanto preconceitos que o fazem esperar mais de outros. Raça, status social, local onde nasceu, emprego... Tudo é algo que seu personagem usa para rotular pessoas e reduzir elas a algum padrão."
        ]
    },
    {
        "nome": "Procurado pelas autoridades",
        "pontos": "3",
        "descricao": [
            "O personagem está fugindo de autoridades específicas ou gerais por algum motivo. O jogador deve explicar o motivo na história do personagem."
        ]
    },
    {
        "nome": "Protegido Indefeso",
        "pontos": "3",
        "descricao": [
            "O personagem possui alguma pessoa indefesa sobre seus cuidados e simplesmente precisa proteger essa pessoa. Essa pessoa tem uma certa tendência a arranjar encrenca."
        ]
    },
    {
        "nome": "Quirk",
        "pontos": "1",
        "descricao": [
            "Seu personagem tem algum hábito constante que pode ser usado para identificá-lo. Personagens que conhecem o seu personagem tem mais chance de reconhecê-lo através de disfarces, assim como percebem esse hábito como algo errado caso você se disfarce como um conhecido.",
            "Sempre que tentando enganar alguém que te conhece ou se disfarçando como alguma pessoa específica, você recebe um redutor de -4 em suas rolagens relacionadas ao disfarce. Inclui tentativas de passar despercebido por alguém que te conhece. Você deve definir qual é esse hábito."
        ]
    },	
    {
        "nome": "Rejeição Cibernética",
        "pontos": "2",
        "descricao": [
            "O organismo do personagem rejeita completamente implantes cibernéticos. Caso o personagem use um implante cibernético, ele poderá morrer em poucos dias."
        ]
    },
    {
        "nome": "Renegado",
        "pontos": "2",
        "descricao": [
            "O personagem não se encaixa de maneira nenhuma na sociedade, sendo rejeitado em todas as situações. O jogador deve dar um motivo pelo qual o personagem geralmente é rejeitado."
        ]
    },
    {
        "nome": "Rival",
        "pontos": "2",
        "descricao": [
            "Você possui um relacionamento competitivo com alguém e um se esforça muito para superar o outro. Isso pode fazer com que se tratem como inimigos às vezes, mas não é obrigatório que se odeiem.",
            "Seu rival pode ser algum outro personagem de jogador do seu grupo, contanto que ambos concordem com isso."
        ]
    },
    {
        "nome": "Rival Especial",
        "pontos": "3",
        "descricao": [
            "Alguma coisa aconteceu entre você e algum personagem importante de arcos anteriores, e agora você quer superar esse personagem mais do que tudo. Talvez você tenha visto ele em uma luta ou simplesmente falado com ele, mas seu sonho e/ou objetivo é superá-lo.",
            "Envolver um personagem antigo em sua história muito provavelmente vai exigir aprovação do mestre e/ou do criador daquele personagem, dependendo de como você o incluiu - é importante garantir que o personagem não tome um rumo não desejado."
        ]
    },
    {
        "nome": "Rosto de Mentiroso",
        "pontos": "2",
        "descricao": [
            "O rosto do personagem não inspira confiança, causando penalidades ou inferioridade em testes sociais onde convencer alguém de que fala a verdade é relevante."        ]
    },
    {
        "nome": "Saco sem fundo",
        "pontos": "1",
        "descricao": [
            "Você precisa se alimentar muito mais do que uma pessoa normal para ficar cheio e pode até estar quase constantemente com fome. Você só ganha as vantagens de alimentação ao comer o equivalente a 3 porções. Comer menos do que isso também significa que continuará com fome."
        ]
    },
    {
        "nome": "Sadismo",
        "pontos": "1",
        "descricao": [
            "O personagem tem prazer em causar dor nos demais, pode vir a corromper-se completamente e ficar insano."
        ]
    },
    {
        "nome": "Sanguinário",
        "pontos": "1",
        "descricao": [
            "O personagem é excessivamente cruel e sanguinário, raramente tendo piedade ou compaixão com os outros."
        ]
    },
    {
        "nome": "Sensível à luz",
        "pontos": "2",
        "descricao": [
            "O personagem sofre grandes penalidades quando exposto à luz, seja de dano direto ou redutores em atributos e perícias."
        ]
    },
    {
        "nome": "Sexista",
        "pontos": "2",
        "descricao": [
            "Você não consegue suportar pessoas do sexo oposto e sente uma terrível repulsa por elas. Isso inclui pessoas de outras raças diferentes."
        ]
    },
    {
        "nome": "Sexy",
        "pontos": "3",
        "descricao": [
            "O personagem é relativamente atraente, mas de um jeito bem específico que costuma trazer mais problemas do que vale. A aparência do personagem é aumentada para 3 se fosse menor do que isso e essa desvantagem não pode ser comprada junto de desvantagens que alterassem sua aparência (vantagens podem). A aparência do personagem SEMPRE vai atrair a atenção de quem ele não queria atrair a atenção e quem o viu dificilmente irá esquecer quando alguém o estiver procurando. O personagem também é atraente para membros de ambos os sexos de qualquer espécie, incluindo criaturas não-inteligentes."
        ]
    },
    {
        "nome": "Sinal de identificação",
        "pontos": "1",
        "descricao": [
            "O personagem possui algum tipo de sinal, tatuagem, cicatriz, marca que o torna facilmente identificável por quem quer que o esteja perseguindo. Caso seja uma cicatriz ou tatuagem que tenha algum significado, o jogador deve explicar o motivo / significado na história do personagem."
        ]
    },
    {
        "nome": "Sofrimento Constante",
        "pontos": "2",
        "descricao": [
            "O personagem tem um sofrimento físico ou mental constante por algum motivo obscuro ou mesmo sem razão. O jogador deve explicar na história do personagem caso isso tenha um motivo."
        ]
    },
    {
        "nome": "Sotaque",
        "pontos": "1",
        "descricao": [
            "A forma de falar do seu personagem carrega um sotaque da região onde você foi criado, impedindo que esconda suas origens. Defina algo que torne esse sotaque reconhecido."
        ]
    },
    {
        "nome": "Suicida",
        "pontos": "1",
        "descricao": [
            "O personagem possui impulsos suicidas, que podem surgir em situações de estresse."
        ]
    },
    {
        "nome": "Supremacia",
        "pontos": "1",
        "descricao": [
            "O personagem acredita na superioridade da própria cultura, status social, raça, etc. Ele humilha os outros que não possuem a mesma cultura ou crença que ele."
        ]
    },
    {
        "nome": "Supremacista",
        "pontos": "1",
        "descricao": [
            "Escolha um dos traços importantes e visíveis do seu personagem. Seu personagem acredita que esse traço é o melhor e mais superior de todos e que qualquer um que não se encaixe nele é inferior a ele. Seu personagem pode estar planejando formas de levar seu \"grupo\" ao poder e eliminar (ou dominar) os inferiores. Nesse caso, a desvantagem passa a conceder 2 pontos ao invés de 1."
        ]
    },
    {
        "nome": "Tagarela",
        "pontos": "2",
        "descricao": [
            "O personagem fala sem parar, causando penalidades ou inferioridade nos tratos sociais."        ]
    },
    {
        "nome": "Teimoso",
        "pontos": "1",
        "descricao": [
            "O personagem não muda de opinião facilmente."
        ]
    },
    {
        "nome": "Terríveis Circunstâncias",
        "pontos": "2",
        "descricao": [
            "Toda a sua família próxima está morta. Não sobrou ninguém para falar com você ou te ajudar."
        ]
    },
    {
        "nome": "Timidez",
        "pontos": "2",
        "descricao": [
            "O personagem tem muita dificuldade nos tratos sociais. Não consegue expressar o que realmente sente e se acovarda ao ter que conhecer ou abordar pessoas novas."
        ]
    },
    {
        "nome": "Traumatizado",
        "pontos": "2",
        "descricao": [
            "Personagem é traumatizado por algum motivo e tem penalidades em testes de sanidade e de relações sociais. O trauma irá afetar diretamente o seu dia a dia. O jogador deve explicar o motivo do trauma na história do personagem."
        ]
    },
    {
        "nome": "Vantagem Imaginária",
        "pontos": "1 ou 2 ou 3",
        "descricao": [
            "Escolha uma vantagem na lista de vantagens. Essa desvantagem concede pontos na metade do custo daquela vantagem, arredondado para cima. O personagem deve agir como se possuísse aquela vantagem, mas ele não a possui. Exemplos: um personagem com Vantagem Imaginária: Direção Absoluta faria coisas como “É por ali! Eu sei que é!”, mas estaria errado. Um personagem com Vantagem imaginária: Imortalidade Avançada pode acabar se colocando em situações perigosas, acreditando que não pode morrer. O mestre deve vetar a compra dessa desvantagem caso a vantagem escolhida vá ser irrelevante como vantagem imaginária."
        ]
    },
    {
        "nome": "Verdade Oculta",
        "pontos": "1 ou 2",
        "descricao": [
            "Alguma coisa importante sobre e para o seu personagem não é aparente e talvez até se passe o contrário. Esse traço do personagem raramente é reconhecido de imediato.",
            "Exemplos: um mercenário que só liga pro dinheiro sendo reconhecido como bondoso altruísta ou alguém com uma certa ideologia mas que acaba passando a imagem da ideologia oposta, recebendo vários convites para um grupo que detesta só por parecer seguir aquelas ideias.",
            "Por aumentar o ganho para 2 pontos, o seu traço não ser reconhecido também te traz transtornos consideráveis, talvez te deixando agressivo ou depressivo."
        ]
    },
    {
        "nome": "Viciado",
        "pontos": "3",
        "descricao": [
            "O personagem tem comportamento autodestrutivo e é viciado em algum tipo de substância entorpecente ou hábito em específico. Ele necessita usar a substância ou fazer tal hábito constantemente ou tem grandes penalidades e/ou inferioridade em todos os testes. Pode perder pontos de vida ao ficar sem executar seu vício."
        ]
    },
    {
        "nome": "Vingativo",
        "pontos": "1",
        "descricao": [
            "O personagem é altamente vingativo e não vai sossegar até acertar as contas com qualquer um que o cause mal, chegando a causar dano a si mesmo em sua busca sedenta por vingança."
        ]
    },
    {
        "nome": "Vingança Antiga",
        "pontos": "3",
        "descricao": [
            "Alguém te fez algo há algum tempo atrás e seu personagem não consegue viver com isso. Seu personagem é totalmente tomado por um sentimento de vingança e gasta seus dias indo atrás daquela pessoa ou criando planos para destruir ela."
        ]
    },
    {
        "nome": "Visões Médium",
        "pontos": "2",
        "descricao": [
            "Você sempre tem visões sobrenaturais nos momentos mais inoportunos, efetivamente te desligando por curtos períodos.",
            "Em geral essas visões não vão te trazer nada de útil. Às vezes são do futuro, às vezes são do passado e às vezes são algo que nunca aconteceu."
        ]
    },
    {
        "nome": "Voluntário",
        "pontos": "3",
        "descricao": [
            "Talvez seu personagem tenha um desejo oculto de morrer, talvez ele não se dê valor ou talvez ele dê valor demais às outras pessoas. O que importa é que seu personagem vai se fazer disponível a qualquer trabalho suicida se isso for trazer alguma vantagem para os outros e estaria pronto até para se sacrificar diretamente para salvar alguém."
        ]
    },
    {
        "nome": "Androgenia",
        "pontos": "1 ou 3",
        "descricao": [
            "Algo na sua espécie, ou em você em particular, faz ser bem difícil identificar qual seu gênero. Isso pode atrapalhar muito algumas interações sociais e algumas pessoas até ficarão zangadas ao lidar com você.",
            "Por 3 pontos, a sua situação específica acaba por fazer essas situações ruins acontecerem quase sempre que possíveis."
        ]
    },
    {
        "nome": "Narcisista",
        "pontos": "2 ou 4",
        "descricao": [
            "O personagem é extremamente vaidoso, cuidando de sua aparência a todo momento. Por 2 pontos, o personagem precisa tomar todas as precauções possíveis para manter sua boa aparência.",
            "Por 4 pontos, o personagem irá exigir reconhecimento externo de sua aparência, não aceitando que alguém não o considere lindo.",
            "Nos dois casos, o personagem pode acabar perdendo o auto-controle ao se ferir de uma forma ruim.",
            "Você não pode escolher essa desvantagem caso sua aparência seja inferior a 3. Aparência é igual ao seu nível em Carisma, mas isso pode ser alterado através de vantagens."
        ]
    }
].sort(function (a,b) {
    var na = a.nome.toUpperCase();
    var nb = b.nome.toUpperCase();
    if (na < nb) return -1;
    if (na > nb) return 1;
    return 0;
});

window.desvantagensHash = {};
var nome;
for (var i = 0; i < window.desvantagensArray.length; i++) {
    nome = window.desvantagensArray[i].nome.toUpperCase().replace(/ *\([^)]*\) */, '').trim();
    if (window.desvantagensHash[nome] !== undefined) {
        console.log("Desvantagem repetido. Antigo: ");
        console.log(window.desvantagensHash[nome]);
        console.log("Novo:");
        console.log(window.desvantagensArray[i]);
    }
    window.desvantagensHash[nome] = window.desvantagensArray[i];
}