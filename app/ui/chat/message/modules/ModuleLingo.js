if (window.chatModules === undefined) window.chatModules = [];
window.AvailableLanguages = ['Elvish', 'Binary', 'Magraki', 'Abyssal', 'Draconic', 'Aquon',
                             'Celestan', 'Technum', 'Arcana', 'Ancient', 'Natrum', 'Ellum',
                             'Animal', 'Auran', 'Davek', 'Arkadium'];
window.AvailableLanguages.sort(function (a, b) {
    var na = a.toUpperCase();
    var nb = b.toUpperCase();
    if (na < nb) {
        return -1;
    }
    if (na > nb) {
        return 1;
    }
    return 0;
});
window.chatModules.push({

    ID : 'lingo',
    
    Slash : ['/lang', '/language', '/lingo', '/lingua', '/ling', '/langsto',
             '/languagestory', '/lingosto', '/linguastory', '/lingsto', '/lingstory', '/lingostory'],
    
    linguas : window.AvailableLanguages,
    
    lingua : {
		Ancient : {
			words : {
				1: ['u', 'd', 'r', 'q', 'c', 's', 't', 'o', 'n', 'dd', 'z'],
				Bigger : ['ka', 'ko', 'ku', 'ma', 'mo', 'mu', 'la', 'lo', 'lu', 'na', 'no', 'nu', 'da', 'do', 'du'],
				Numbers : ['u', 'd', 'r', 'q', 'c', 's', 't', 'o', 'n', 'dd', 'z']
			},
			knownWords : {
				
			},
			uppercase : false,
			allowpoints : false
		},
        Elvish : {
            words : {
                1 : ['a', 'i', 'e'],
                2 : ['ae', 'ea', 'lae', 'lea', 'mia', 'thal', 'maae', 'leah', 'tea', 'ma', 'da', 'le', 'li', 'ta', 'te', 'ia', 'io'],
                3 : ["a'la", 'eu', 'maari', 'eaat', 'tenlar', 'umil', 'malas', 'nilas', 'vaala', 'miu', 'thea', 'thao', 'bae', 'dia'],
                4 : ["e'lud", "mi'tael", 'lussia', 'tamila', 'lavia', 'mera', 'liaah', 'paalvas', 'mala', 'thala', 'tooa', 'theia'],
                5 : ["lu'thanis", "to'meera", "tha'valsar", 'tolelstraz', 'awynn', 'lissanas', 'olaamiss', 'tovalsar', 'malaasa', 'tholad'],
                6 : ["thaliassu", "leeramas", "su'diel", "mi'dhanas", "thashama", "liriana", "luinassa"],
                7 : ["lae'missa", "thol'vana", "sahmila", "mitrusala", "loriema", "tolisava"],
                Bigger : ["'", "lae", "mil", "a'la", 'eu', 'maari', 'eaat', 'tenlar', 'umil', 'malas', 'nilas', 'vaala', 'miu', 'thea', 'thao', 'bae', 'dia', 'ae', 'ea', 'lae', 'lea', 'mia', 'thal', 'maae', 'leah', 'tea', 'ma', 'da', 'le', 'li', 'ta', 'te', 'ia', 'io'],
                Numbers : ['o', 'u', 'uli', 'lia', 'sa', 'mi', 'ola', 'su', 'kaala', 'thus']
            },
            knownWords : {
                'uloloki' : ['CALOR','QUENTE','FOGO','CHAMA','FLAMEJANTE','CHAMAS','FOGOS'],
                'tenwar' : ['LETRA', 'LETRAS', 'LETTER', 'LETTERS'],
                'thalias' : ['CORAGEM', 'CONFIANÇA', 'CONFIANCA', 'BRAVERY'],
                'laer' : ['VERAO', 'VERÃO', 'SUMMER'],
                'tar' : ['ALTO', 'GRANDE'],
                'mellon' : ['AMIGO', 'COMPADRE', 'CAMARADA', "AMIGOS", "CAMARADAS", "COMPADRES", "ALIADO", "ALIADOS"],
                'zallon' : ['INIMIGO', "INIMIGOS", "ADVERSÁRIO", "ADVERSÁRIOS", "ADVERSARIO", "ADVERSARIOS"],
                'luin' : ['AZUL', 'AZULADO'],
                'hehe' : ['HA', "HAH", "HE", "HEH", "HEHE", "HAHA", "HEHEH", "HAHAH", "HEHEHE", "HAHAHA"],
                "el'um" : ['ELF', 'ELFO', 'ELFA'],
                "el'ar" : ['ELFOS', "ELFAS", "ELVES"],
                "el'zel" : ['FALSO', "FAKE", "FALSOS", "FAKES"],
                'elain' : ['ESPERANÇA', 'HOPE'],
                'luria' : ['ALEGRIA', 'FELICIDADE', 'JOY', 'HAPPINESS'],
                'lerast' : ['RÁPIDO', 'VELOZ', 'VELOCIDADE', 'FAST', 'SPEEDY', 'SPEED'],
                'vehal' : ['LAMA', 'BARRO', 'MUD', 'CLAY'],
                'simuh' : ['PÁSSARO', 'AVE', 'PASSARINHO', 'BIRD'],
                'fahin' : ['CURAR', 'SARAR', 'HEAL'],
                'amuhn' : ['BRUXA', 'FEITICEIRA', 'MAGA', 'WITCH', 'WIZARD', 'MAGE']
            },
            uppercase : true,
            allowpoints : true
        },
        Binary : {
            words : {
				1 : ['.','-', '..', '.-', '-.', '--'],
                Bigger : ['.','-', '..', '.-', '-.', '--', '...', '..-', '.-.', '-..', '.--', '-.-', '--.', '---']
            },
            knownWords : {
                
            },
            uppercase : false,
            allowpoints : false
        },
        Magraki : {
            words : {
                1 : ['a', 'u', 'k', 'c', 'e'],
                2 : ['ek', 'uk', 'tu', 'ob', 'zug', 'va'],
                3 : ['ruk', 'gra', 'mog', 'zuk', 'xar'],
                4 : ['zaga', 'garo', 'xhok', 'teba', 'nogu', 'uruk'],
                Bigger : ['ruk', 'gra', 'mog', 'zuk', 'xar', 'ek', 'uk', 'tu', 'ob', 'zug', 'va', 'a', 'u', 'k', 'c', 'e']
            },
            knownWords : {
                'khazzog' : ['MATAR', 'MATE', 'MASSACRE', 'DEATH'],
                'mogtuban' : ['AMIGO', 'COMPADRE', 'CAMARADA'],
                'loktorok' : ['OI', 'OLÁ', 'OLA', 'HELLO'],
                'maguna' : ['ATACAR', 'ATAQUE', 'DESTRUIR', 'DESTRUA', 'ATTACK'],
                'grom' : ['HEROI', 'HERÓI', 'SALVADOR','HERO'],
                'kek' : ['HEHE', "HE", "HEH", "HA", "HAHA", "HAH", 'LOL', 'LMAO', 'ROFL', 'ROFLMAO'],
                'kekek' : ["HEHEHE", "HAHAHA", "HAHAH", 'HEHEH', "HAHAHAH", "HEHEHEH"],
                'bubu' : ['ORC', 'ORK'],
                'bubus' : ['ORCS', 'ORKS'],
                'bubugo' : ['ORCISH', 'ORKISH', 'ORQISH', 'ORQUES', "ORQUÊS", "ORKES", "ORKÊS"]
            },
            uppercase : true,
            allowpoints : true
        },
        Abyssal : {
            words : {
                1 : ['x', 'y', 'e', 'a', 'g', 'o'],
                2 : ['za', 'xy', 'go', 'ua', 'ka', 're', 'te', 'la', 'az'],
                3 : ['rruk', 'kar', 'mra', 'gak', 'zar', 'tra', 'maz'],
                4 : ['okra', 'zzar', 'kada', 'zaxy', 'drab', 'rikk'],
                5 : ['belam', 'rraka', 'ashaj', 'zannk', 'xalah'],
                Bigger : ['rruk', 'kar', 'mra', 'gak', 'zar', 'tra', 'maz', 'za', 'xy', 'go', 'ua', 'ka', 're', 'te', 'la', 'az', 'x', 'y', 'e', 'a', 'g', 'o'],
                Numbers : ['ia', 'ori', 'eri', 'dara', 'iru', 'taro', 'cace', 'zori', 'xash', 'rura']
            },
            knownWords : {
                "soran" : ['ANJO', 'YUQUN', 'ANGEL'],
                "gakzakada" : ['SACRIFICIO', 'SACRIFÍCIO', 'SACRIFICE'],
                "burah" : ['CALOR','QUENTE','FOGO','CHAMA','FLAMEJANTE','CHAMAS','FOGOS'],
                "aman" : ['HUMANO', 'HUMANA', 'HUMAN'],
                "zennshinagas" : ['INFERNO', 'INFERNAL', 'HELL']
            },
            uppercase : true,
            allowpoints : true
        },
        Draconic : {
            words : {
                1 : ['vi', 'si', 'fe', 'sh', 'ix', 'ur'],
                2 : ['wux ', 'vah', 'veh', 'vee', 'ios', 'irsa'],
                3 : ['rerk', 'xsio ', 'axun', 'yrev', 'ithil', 'creic'],
                4 : ["e'cer", 'direx', 'dout', 'yrev'],
                5 : ['ibleuailt ', 'virax', 'mrrandiina ', 'whedab ', 'bekisnhlekil '],
                Bigger : ['rerk', 'xsio ', 'axun', 'yrev', 'ithil', 'creic', 'wux ', 'vah', 'veh', 'vee', 'ios', 'irsa', 'vi', 'si', 'fe', 'sh', 'ix', 'ur'],
                Numbers : ['zero', 'ir', 'jiil', 'fogah', 'vrrar', 'jlatak', 'jiko', 'vakil', 'supri', 'wlekjr']
            },
            knownWords : {
                "darastrix " : ['DRAGÃO', 'DRAGON', 'DRAGAO', 'DRAGOES', 'DRAGÕES'],
                "thurirl" : ['COMPANHEIRO','AMIGO','PARCEIRO','FRIEND','PARTNER','ALIADO'],
                "ternocki" : ['ESCAMAS', 'SCALES', 'ESCAMA', 'SCALE'],
                "molik" : ['PELE', 'SKIN'],
                "seltur" : ['MOLE','MACIA','SOFT'],
                "l'gra" : ['MEDO','PAVOR','TEMOR','HORROR','FEAR'],
                "munthrek" : ['HUMANO','HUMANOS','HUMAN','HUMANS'],
                "arthonath" : ['HUMANIDADE','HUMANITY']
            },
            uppercase : true,
            allowpoints : true
        },
        Aquon : {
            words : {
                1 : ['le', 'li', 'la', 'a', 'e', 'i'],
                2 : ['laren', 'sare', 'elane', 'alena', 'leair'],
                3 : ['lessa', 'saril ', 'quissa', 'sarte', 'tassi', 'selasse'],
                4 : ['atoloran', 'tiran', 'quilara', 'assiassi'],
                Bigger : ['lessa', 'saril ', 'quissa', 'sarte', 'tassi', 'selasse', 'laren', 'sare', 'elane', 'alena', 'leair', 'le', 'li', 'la', 'a', 'e', 'i'],
                Numbers : ['on', 'liss', 'diss', 'tiss', 'quass', 'ciss', 'siss', 'sess', 'oiss', 'niss']
            },
            knownWords : {
                "tassela" : ['TERRA', 'PISO', 'CHÃO', 'SUPERFICIE'],
                "tasselarane" : ['TERRESTRE', 'INIMIGO', 'ADVERSARIO', 'OPONENTE', 'INIMIGOS', 'ADVERSARIOS', 'OPONENTES'],
                "quill" : ['RIO', 'MAR', 'OCEANO'],
                "quillarine" : ['AQUATICO', 'AMIGO', 'COMPANHEIRO', 'ALIADO', 'AMIGOS', 'COMPANHEIROS', 'ALIADOS'],
                "quell" : ['AGUA', 'SAGRADO'],
                "sir" : ['AMANTE', 'ADORADOR'],
                "salara" : ['GLÓRIA', 'HONRA', 'AUTORIDADE', 'VIRTUDE'],
                "quellsalara" : ['REI', 'SOBERANO', 'MONARCA'],
                "selarane" : ["EL'ZEL"],
                "setarane" : ['ELFO'],
                "talarane" : ['HUMANO']
            },
            uppercase : true,
            allowpoints : true
        },
        Arcana : {
            words : {
                1 : ['a', 'o', 'z', 'c'],
				2 : ['xa', 'nu', 'da', 'xi', 'li'],
                3 : ['xie', 'uru', 'ara', 'naa', 'ean', 'zha', 'zhi', 'xin', 'xan', 'chu', 'ran', 'nan', 'zan', 'ron'],
                4 : ['wanv', 'haov', 'chan', 'chun', 'chen', 'zhen', 'zhan', 'shie', 'yong', 'xing', 'kafe'],
                6 : ['zazado', 'kafel', 'xinzhao', 'mengtah', 'mengzha', 'lenshi', 'qibong', 'qubhan', 'quzhan', 'qizhao'],
                Bigger : ['wanv', 'haov', 'chan', 'chun', 'chen', 'zhen', 'zhan', 'shie', 'yong', 'xing', 'kafe', 'xa', 'nu', 'da', 'xi', 'li', 'xie', 'uru', 'ara', 'naa', 'ean', 'zha', 'zhi', 'xin', 'xan', 'chu', 'ran', 'nan', 'zan', 'ron', 'a', 'o', 'z', 'c'],
                numbers : ['lin', 'i', 'e', 'sa', 'si', 'wu', 'liu', 'qi', 'ba', 'ju']
            },
            knownWords : {
                "yu mo" : ['COISA', 'BAD', 'COISAS', 'TRECO', 'TRECOS'],
                'gui gwai' : ['RUIM', 'THING', 'RUINS'],
                'fai' : ['VAI', 'GO', 'CAI', 'VA', 'VÁ'],
                'di zao' : ['EMBORA', 'AWAY', 'FORA'],
                'lai' : ['WATER', 'ÁGUA', 'AGUA', 'OCCUR'],
                'shui zai' : ['ACONTEÇA', 'COME', 'HAPPEN', 'FLOOD']
            },
            uppercase : true,
            allowpoints : true
        },
        Natrum : {
            words : {
                1 : ['en', 'er', 'i', 'ir', 'j', 'na', 'ma', 'ur', 'yl'],
                2 : ['aiga', 'draum', 'gaf', 'gorak', 'hennar', 'ormar', 'saman', 'warin'],
                3 : ['barmjor', 'eltzi', 'gunronir', 'thalandor', 'yirindir'],
                4 : ['iemnarar', 'normnundor', 'melgandark', 'sunnarsta', 'villnorer', 'znorud'],
                Bigger : ['barmjor', 'eltzi', 'gunronir', 'thalandor', 'yirindir', 'aiga', 'draum', 'gaf', 'gorak', 'hennar', 'ormar', 'saman', 'warin', 'en', 'er', 'i', 'ir', 'j', 'na', 'ma', 'ur', 'yl'],
                Numbers : ['ein', 'tvein', 'trir', 'fjor', 'fimm', 'seks', 'syv', 'otte', 'niu', 'tiu']
            },
            knownWords : {
                'jotun' : ['ALTO', 'COLOSSAL', 'TITÃ', 'ROCHEDO'],
                'gutland' : ['TERRA', 'TERRITÓRIO', 'LUGAR', 'PAÍS', 'REGIÃO'],
                'jormungandr' : ['TERRA NATAL', 'MONTANHA', 'ORIGEM', 'FAMÍLIA', 'PÁTRIA', 'GELEIRA', 'POLAR'],
                'yggdrasil' : ['ÁRVORE', 'MUNDO', 'NATUREZA', 'ESSÊNCIA', 'ESPERANÇA'],
                'ragnarokkr' : ['FIM', 'DESTRUIÇÃO', 'ANIQUILAÇÃO', 'EXTERMÍNIO', 'RUÍNA', 'DECADÊNCIA'],
                'vollusp' : ['INICIO', 'PASSADO', 'ANTIGO', 'ANCIÃO'],
                'bifrost' : ['CÉU', 'CELESTE', 'SOL', 'NUVEM', 'AURORA', 'FIRMAMENTO', 'ESTELAR', 'ASTRAL'],
                'garm' : ['IRA', 'RAIVA', 'FOME', 'PERIGOSO', 'IRRACIONAL', 'AMEAÇA', 'INVEJA'],
                'hel' : ['MORTE', 'CEMITÉRIO', 'TÚMULO', 'TORMENTO', 'ESCURIDÃO', 'TREVAS', 'NEVOA'],
                'gagap' : ['VAZIO', 'ABISMO', 'FISSURA', 'FANTASMAGÓRICO', 'NADA', 'ESPAÇO', 'CAOS'],
                'surt' : ['CALOR','PODER', 'FORÇA', 'FÚRIA', 'FOGO', 'JUIZ', 'ACUSADOR'],
                'ymir' : ['FRIO', 'GELADO', 'PAREDE', 'MURALHA', 'GUARDIÃO', 'TEMPESTADE'],
                'hrimthur' : ['TRAIDOR', 'PÁLIDO', 'INIMIGO', 'COVARDE', 'FRACO'],
                'jormum' : ['PAI', 'PATERNO', 'PATERNAL'],
                'angrboda' : ['MÃE', 'MATERNAL', 'AMOR', 'AFETO', 'PAIXÃO'],
                'alvo' : ['COMPANHEIRO', 'IRMÃO', 'AMIGO'],
                'elain' : ['ANIMAL', 'FERA', 'SELVAGEM', 'BICHO', 'CRIATURA'],
                'alfir' : ['RESPEITOSO', 'DILIGENTE', 'ALIADO', 'PROTETOR'],
                'aesir' : ['LÍDER', 'GENERAL', 'GUERREIRO', 'HERÓI', 'CORAJOSO', 'DIVINO', 'IMORTAL'],
                'alfheim' : ['FLORESTA', 'SELVA', 'BOSQUE', 'FAUNA', 'FLORA', 'ARVOREDO'],
                'nidavel' : ['DESERTO', 'PLANÍCIE', 'ERMO', 'CAMPO'],
                'nidavemnir' : ['TRIBO', 'NOMADE', 'COLONIA', 'ACAMPAMENTO', 'ESTADIA'],
                'valtamer' : ['OCEANO', 'ÁGUA', 'LAGO', 'RIO', 'CORREGO', 'CHUVA'],
                'niohoggr' : ['MAU', 'MALIGNO', 'PESTE', 'DOENÇA', 'TIRANO'],
                'valhana' : ['SONHO', 'VISÃO', 'ESPIRITO', 'MÍSTICO', 'SOBRENATURAL', 'SÁBIO']
            },
            uppercase : true,
            allowpoints : true
        },
        Animal : {
            words : {
                1 : ['u', 'r', 'a', 'n', 'w'],
                Bigger : ['u', 'r', 'a', 'n', 'w', 'grr!', 'rarr!', 'rawr', 'mmf', 'pamf', 'pant', 'rrrr', 'rrrrrrr', 'eeep', 'uk', 'karr!', 'uff', 'off', 'aff', 'snif', 'puff', 'roar!', 'raar', 'mmmm', 'ghhh', 'kak', 'kok', 'grr', 'year', 'yor', 'caaaar', 'urr', 'uru!', 'muu', 'up', 'uup', 'oap', 'rrrraawr', 'mip', 'iap', 'ap']
            },
            uppercase: true,
            allowpoints : false
        },
        Technum : {
            uppercase : true,
            allowpoints : true,
            words : {
                1 : ['n', 'e', 'i', 'k', 'a'],
                2 : ['ok', 'un', 'ac', 'hal', 'sub', 'fyi', 'hym', 'cmp'],
                3 : ['vaal', 'hyss', 'lrok', 'gfun', 'jyin'],
                4 : ['netak', 'urmin', 'kvyan', 'trekt', 'pvnum'],
                Bigger: ['tkmkrok', 'ncallat', 'khstrat', 'meknym', 'snwyhok']
            },
            knownWords : {
                'lwyhak' : ['ESPADA', 'LÂMINA', 'AÇO', 'METAL'],
                'vclloc' : ['VENTO', 'BRISA', 'VENTANIA', 'SOPRO'],
                'vwynm' : ['AMIGO', 'AMIZADE', 'COMPANHEIRO'],
                'klumiun' : ['ÁGUA', 'GELO', 'LÍQUIDO'],
                'kramik' : ['CÉU', 'PARAÍSO', 'NUVEM', 'ANJO', 'DIVINO'],
                'mnyacc' : ['MORTE', 'TREVAS', 'DEMÔNIO', 'ESCURIDÃO']
            }
        },
        Arkadium : {
            uppercase : true,
            allowpoints : true,
            words : {
                1 : ['h', 'a', 'n', 'i', 'e'],
                2 : ['no', 'ko', 'ta', 'ain', 'nah', 'roi', 'shu', 'kon'],
                3 : ['ishi', 'temi', 'poto', 'taan', 'kain'],
                4 : ['treja', 'nizui', 'boron', 'hazoi', 'lamaf'],
                Bigger: ['ishi', 'temi', 'poto', 'taan', 'kain', 'no', 'ko', 'ta', 'ain', 'nah', 'roi', 'shu', 'kon', 'h', 'a', 'n', 'i', 'e']
            },
            knownWords : {
                'saldine' : ['ILHA', 'ISTMO', 'DERIVA'],
                'kairu' : ['EDUCAÇÃO', 'ENSINO', 'ESCOLA', 'CONHECIMENTO'],
                'sazuina' : ['MAR', 'OCEANO', 'PRAIA'],
                'tenozesa' : ['ESTRANGEIRO', 'ESTRANHO', 'DESCONHECIDO'],
                'purechi' : ['AMIGO', 'COMPANHEIRO', 'IRMÃO', 'COLEGA'],
                'pukapuka' : ['CALMO', 'LENTO', 'TRANQUILO', 'AMIGÁVEL']
            }
        },
        Auran : {
            uppercase: true,
            allowpoints: true,
            words: {
                1 : ['o', 'k', 's', 'i', 'a', 'm'],
                2 : ['me', 'ra', 'lo', 'fu', 'je'],
                3 : ['kin', 'zoh', 'jao', 'nen', 'has'],
                4 : ['mewa', 'waon', 'kerl', 'nomu', 'qolt'],
                Bigger : ['kin', 'zoh', 'jao', 'nen', 'has', 'me', 'ra', 'lo', 'fu', 'je', 'o', 'k', 's', 'i', 'a', 'm']
            },
            knownWords : {
                'makonah' : ['PAZ', 'CALMARIA', 'CALMO', 'TRANQUILO'],
                'falnafu' : ['FOGO', 'CALOR', 'QUENTE', 'SOL'],
                'komuona' : ['MENINA', 'MULHER', 'FEMININO'],
                'zasujoh' : ['MÁQUINA', 'MAGIA', 'ELETRICIDADE'],
                'omuzah' : ['COMEÇO', 'INÍCIO', 'CRIAÇÃO'],
                'miwonih' : ['FIM', 'FINAL', 'DESTRUIÇÃO']
            }
        },
        Celestan : {
            uppercase : true,
            allowpoints : true,
            words : {
                1 : ['z', 'i', 'h', 'k', 'u'],
                2 : ['ul', 'ha', 'ko', 'ia', 'ez', 'oh'],
                3 : ['moh', 'lea', 'sha', 'lok', 'tae'],
                4 : ['zaha', 'ohta', 'baos', 'naia', 'ezoh'],
                Bigger: ['zaha', 'ohta', 'baos', 'naia', 'ezoh', 'moh', 'lea', 'sha', 'lok', 'tae', 'ul', 'ha', 'ko', 'ia', 'ez', 'oh', 'z', 'i', 'h', 'k', 'u']
            },
            knownWords : {
                'ladon' : ['ANJO', 'CELESTIAL', 'YUQUN'],
                'deis' : ['COBRA', 'SERPENTE', 'SNAKE'],
                'klistera' : ['GELO', 'SÓLIDO', 'CONGELADO', 'GELEIRA'],
                'toraeh': ['ASAS', 'PENAS', 'ALADO', 'WINGED'],
                'goetiah' : ['CAÍDO', 'DEMÔNIO', 'INFERNAL', 'TREVAS']
            }
        },
        Ellum : {
            words : {
                1 : ['a', 'i', 'e'],
                2 : ['ae', 'ea', 'tae', 'cea', 'mia', 'lhat', 'maae', 'teah', 'lea', 'ma', 'da', 'te', 'ti', 'la', 'le', 'ia', 'io'],
                3 : ["a'ta", 'eu', 'maari', 'eaal', 'lentar', 'umit', 'matas', 'nitas', 'vaata', 'miu', 'lhea', 'lhao', 'bae', 'dia'],
                4 : ["e'tud", "mi'laet", 'tussia', 'lamita', 'tavia', 'mera', 'tiaah', 'paatvas', 'mata', 'lhata', 'looa', 'lheia'],
                5 : ["tu'lhanis", "lo'meera", "lha'vatsar", 'lotetslraz', 'awynn', 'tissanas', 'otaamiss', 'lovatsar', 'mataasa', 'lhotad'],
                6 : ["lhatiassu", "teeramas", "su'diet", "mi'dhanas", "lhashama", "tiriana", "tuinassa"],
                7 : ["tae'missa", "lhot'vana", "sahmita", "milrusata", "toriema", "lotisava"],
                Bigger : ["e'tud", "mi'laet", 'tussia', 'lamita', 'tavia', 'mera', 'tiaah', 'paatvas', 'mata', 'lhata', 'looa', 'lheia', "a'ta", 'eu', 'maari', 'eaal', 'lentar', 'umit', 'matas', 'nitas', 'vaata', 'miu', 'lhea', 'lhao', 'bae', 'dia', 'ae', 'ea', 'tae', 'cea', 'mia', 'lhat', 'maae', 'teah', 'lea', 'ma', 'da', 'te', 'ti', 'la', 'le', 'ia', 'io', 'a', 'i', 'e'],
                Numbers : ['o', 'u', 'uti', 'tia', 'sa', 'mi', 'ota', 'su', 'kaata', 'lhus']
            },
            knownWords : {
                'utotoki' : ['CALOR','QUENTE','FOGO','CHAMA','FLAMEJANTE','CHAMAS','FOGOS'],
                'lenwar' : ['LETRA', 'LETRAS', 'LETTER', 'LETTERS'],
                'lhatias' : ['CORAGEM', 'CONFIANÇA', 'CONFIANCA', 'BRAVERY'],
                'taer' : ['VERAO', 'VERÃO', 'SUMMER'],
                'lar' : ['ALTO', 'GRANDE'],
                'metton' : ['AMIGO', 'COMPADRE', 'CAMARADA', "AMIGOS", "CAMARADAS", "COMPADRES", "ALIADO", "ALIADOS"],
                'zatton' : ['INIMIGO', "INIMIGOS", "ADVERSÁRIO", "ADVERSÁRIOS", "ADVERSARIO", "ADVERSARIOS"],
                'tuin' : ['AZUL', 'AZULADO'],
                'hehe' : ['HA', "HAH", "HE", "HEH", "HEHE", "HAHA", "HEHEH", "HAHAH", "HEHEHE", "HAHAHA"],
                "et'um" : ['ELF', 'ELFO', 'ELFA'],
                "et'ar" : ['ELFOS', "ELFAS", "ELVES"],
                "et'zet" : ['FALSO', "FAKE", "FALSOS", "FAKES"],
                'etain' : ['ESPERANÇA', 'HOPE'],
                'turia' : ['ALEGRIA', 'FELICIDADE', 'JOY', 'HAPPINESS'],
                'terasl' : ['RÁPIDO', 'VELOZ', 'VELOCIDADE', 'FAST', 'SPEEDY', 'SPEED'],
                'vehat' : ['LAMA', 'BARRO', 'MUD', 'CLAY'],
                'simuh' : ['PÁSSARO', 'AVE', 'PASSARINHO', 'BIRD'],
                'fahin' : ['CURAR', 'SARAR', 'HEAL'],
                'amuhn' : ['BRUXA', 'FEITICEIRA', 'MAGA', 'WITCH', 'WIZARD', 'MAGE']
            },
            uppercase : true,
            allowpoints : true
        },
        Davek : {
            uppercase : true,
            allowpoints : true,
            words : {
                1 : ['d', 'k', 'e', 'a', 'u'],
                2 : ['bu', 'ka', 'ce', 'ke', 'ko', 'za', 'ik', 'ep', 'pa', 'na', 'ma', 'pe'],
                3 : ['kok', 'kek', 'iek', 'cea', 'sok', 'ask', 'pok', 'pak', 'rak', 'rok', 'ruh', 'ruk', 'ram', 'ran', 'rae', 'era', 'ero', 'erp'],
                4 : ['doko', 'pika', 'paek', 'caeo', 'peao', 'pako', 'poka', 'mako', 'zako', 'zado', 'edo', 'akad', 'miko', 'adek', 'edao'],
                5 : ['emaop', 'edaki', 'pedak', 'pokad', 'emako', 'pokad', 'rakza', 'edoru', 'akara', 'iekpa', 'dokok', 'ceape', 'mikora', 'erada', 'erpad'],
                6 : ['jukoa', 'kodoko', 'pikace', 'peaika', 'pakpoka', 'rokzado', 'maedoru', 'akarape', 'epask', 'dokoran'],
                Bigger: ['doko', 'pika', 'paek', 'caeo', 'peao', 'pako', 'poka', 'mako', 'zako', 'zado', 'edo', 'akad', 'miko', 'adek', 'edao', 'kok', 'kek', 'iek', 'cea', 'sok', 'ask', 'pok', 'pak', 'rak', 'rok', 'ruh', 'ruk', 'ram', 'ran', 'rae', 'era', 'ero', 'erp', 'bu', 'ka', 'ce', 'ke', 'ko', 'za', 'ik', 'ep', 'pa', 'na', 'ma', 'pe']
            },
            knownWords : {
                'topkek' : ['ENGRAÇADO', "ENGRACADO", "GRAÇA", "GRACA", "PIADA", "PIADAS", "ENGRAÇADOS", "ENGRACADOS"],
                'kekdoru' : ['COMEDIANTE', 'COMEDIANTES', 'PALHAÇO', "PALHACO", "PALHAÇOS", "PALHAÇOS"],
                'maraka' : ['AMIGO', "AMIGOS", "COMPADRE", "COMPADRES", "PARCEIRO", "PARCEIROS"],
                'karama' : ['INIMIGO', 'INIMIGOS', "OPONENTE", "OPONENTES"],
                'kara' : ['PESSOA', 'CARA', "KRA"],
                'ma' : ['RUIM', "MALIGNO", "MALIGNA", "MALDADE", "MA", "MÁ", "MAU"],
                'ukokimadokuzapa' : ['PARALELEPIPEDO', "PARALELEPÍPEDO"]
            }
        }
    },
    
    isValid : function (slashCMD, message) {
        var lingua = message.substring(0, message.indexOf(','));
        return this.linguas.indexOf(lingua) !== -1 && this.doISpeak(lingua);
    },
    
    
    /**
     * Scours a Game Controller Sheet for who can speak a certain language
     * @param {String} language
     * @returns {Array}
     */
    whoSpeaks : function (language) {
        return window.app.ui.chat.langtab.whoSpeaks(language);
    },
    
    doISpeak : function (language) {
        return !window.app.ui.chat.mc.getModule("stream").isStream && this.whoSpeaks(language).indexOf(window.app.loginapp.user.id) !== -1;
    },

    /**
     * Translates a word into a set language.
     * @param {String} word
     * @param {String} language
     * @returns {String}
     */
    translate : function (word, language) {
        if (this.lingua[language] === undefined || word.length === 0) {
            return word;
        }
        
        var exclamation = word.indexOf('!') !== -1;
        var interrobang = word.indexOf('?') !== -1;
        var finish = word.indexOf('.') !== -1;
        var trespontos = word.indexOf('...') !== -1;
        var doispontos = word.indexOf(':') !== -1;
        var virgula = word.indexOf(',') !== -1;
        word = word.replace(/\!/g, '');
        word = word.replace(/\?/g, '');
        word = word.replace(/\./g, '');
        word = word.replace(/\:/g, '');
        word = word.replace(/\,/g, '');
        var words = this.lingua[language].words;
        var knownWords = this.lingua[language].knownWords;
        var uppercase = this.lingua[language].uppercase;
        var allowpoints = this.lingua[language].allowpoints;
        
        for (var index in knownWords) {
            if (typeof knownWords[index] === 'string') {
                words[knownWords[index]] = [index];
            } else {
                for (var k = 0; k < knownWords[index].length; k++) {
                    words[knownWords[index][k]] = [index];
                }
            }
        }
        
        if (typeof words['Numbers'] !== 'undefined' && !isNaN(word, 10)) {
            var result = '';
            for (var i = 0; i < word.length; i++) {
                result += words['Numbers'][parseInt(word.charAt(i))];
            }
            if (allowpoints) {
                result +=
                    (virgula ? ',' : '') +
                    (doispontos ? ':' : '') +
                    (exclamation ? '!' : '') +
                    (interrobang ? '?' : '') +
                    (finish ? '.' : '') +
                    (trespontos ? '..' : '');
            }
            return result;
        }
        
        var resultFrom = "Bigger";
        if (typeof words[word.toUpperCase()] !== 'undefined') {
            resultFrom = word.toUpperCase();
        } else if (typeof words[word.length] !== 'undefined') {
            resultFrom = word.length;
        }
        
        var myrng = new Math.seedrandom(word.toUpperCase());
		if (resultFrom === "Bigger") {
			var selected = "";
			while (selected.length < word.length) {
				var result = Math.floor(myrng() * words[resultFrom].length);
				selected = selected + words[resultFrom][result];
			}
		} else {
			var result = Math.floor(myrng() * words[resultFrom].length);
			var selected = words[resultFrom][result];
		}
        
        if (!uppercase) {
            var newWord = selected;
        } else {
            var newWord = '';
            var char;
            for (var i = 0; i < selected.length; i++) {
                if (i > (word.length - 1)) {
                    char = word.charAt(word.length - 1);
                } else {
                    char = word.charAt(i);
                }
                if (char === char.toUpperCase()) {
                    newWord += selected.charAt(i).toUpperCase();
                } else {
                    newWord += selected.charAt(i);
                }
            }
        }
        
        if (allowpoints) {
            newWord = newWord +
                    (virgula ? ',' : '') +
                    (doispontos ? ':' : '') +
                    (exclamation ? '!' : '') +
                    (interrobang ? '?' : '') +
                    (finish ? '.' : '') +
                    (trespontos ? '..' : '');
        }
        
        return newWord;
    },
    
    translatePhrase : function (phrase, language) {
        phrase = phrase.split(' ');
        for (var i = 0; i < phrase.length; i++) {
            if (phrase[i].length > 0) {
                phrase[i] = this.translate(phrase[i], language);
            }
        }
        phrase = phrase.join(' ');
        return phrase;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg) {
        return null;
    },
    
    getMsg : function (slashCMD, message) {
        var room = window.app.chatapp.room;
        var msg = new Message();
        msg.roomid = room.id;
        msg.origin = window.app.loginapp.user.id;
        
        if (slashCMD.toUpperCase().indexOf("STO") === -1 || !room.getMe().isStoryteller) {
            msg.module = 'roleplay';
            if (room.persona === null) {
                msg.setSpecial('persona', '?????');
            } else {
                msg.setSpecial('persona', room.persona);
            }
        } else {
            msg.module = 'story';
        }
        var lingua = message.substring(0, message.indexOf(','));
        msg.setSpecial('lingua', lingua);
        
        var cleanMsg = message.substring(message.indexOf(',') + 1, message.length).trim();
        
        var pseudo = '';
        var sentence = '';
        var skipfor = null;
        var char;
        for (var i = 0; i < cleanMsg.length; i++) {
            char = cleanMsg.charAt(i);
            if (skipfor === null) {
                if (['*', '[', '(', '{'].indexOf(char) === -1) {
                    sentence += char;
                } else {
                    if (char === '*') {
                        skipfor = '*';
                    } else if (char === '[') {
                        skipfor = ']';
                    } else if (char === '(') {
                        skipfor = ')';
                    } else if (char === '{') {
                        skipfor = '}';
                    }
                    if (sentence.length > 0) {
                        pseudo += this.translatePhrase(sentence, lingua);
                    }
                    sentence = char;
                }
            } else {
                sentence += char;
                if (char === skipfor) {
                    pseudo += sentence;
                    sentence = '';
                    skipfor = null;
                }
            }
            
        };
        
        if (sentence.length > 0) {
            pseudo += this.translatePhrase(sentence, lingua);
        }
        
        msg.setMessage(pseudo);
        msg.setSpecial('translation', cleanMsg);
        
        var speakers = this.whoSpeaks(lingua);
        
        msg.setDestination(speakers);
        window.app.chatapp.fixPrintAndSend(msg, true);
        
        msg.unsetSpecial('translation');
        msg.setDestination(null);
        msg.clone = false;
        msg.setSpecial("ignoreFor", speakers);
        window.app.chatapp.sendMessage(msg);

        
        return null;
    },
    
    get$error : function (slash, msg, storyteller) {
        var lingua = msg.substring(0, msg.indexOf(','));
        var $error = $('<p class="chatSistema" class="language" />');
        
        if (this.linguas.indexOf(lingua) === -1) {
            $error.attr('data-langhtml', '_CHATLANGINVALID_');
        } else if (!this.doISpeak(lingua)) {
            $error.attr('data-langhtml', '_CHATLANGUNKNOWN_');
        } else {
            $error.attr('data-langhtml', '_INVALIDSLASHMESSAGE_');
        }
        
        $error.html("?");
        
        return $error;
    }
});