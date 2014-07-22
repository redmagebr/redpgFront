/**
 * Parts that are customizable:
 *    this.html;
 *    this.css;
 *    add code BEFORE PROCESS;
 *    add code AFTER PROCESS;
 * @param {Sheet_Instance} sheet
 * @class Style
 * @constructor
 */
function Style_00 (sheet) {
    
    this.sheet = sheet;
    
    this.changed = false;
    
    this.editing = false;
    
    this.html = "<div id=\"dfsDiv\" class=\"character unselectable\">\n    <div class=\"typedBG fullWidth marginBottom paddingTop paddingBottom selectable\" style=\"position: relative\">\n\n        <a class=\"unselectable\" id=\"dfsOpenClose\" onclick=\"$('#dfsExtraInfo').toggle(); $(this).text($('#dfsExtraInfo').is(':visible') ? '(-)' : '(+)');\">(+)</a>\n\n        <div id=\"dfsCommonInfo\">\n            <div class=\"oneFourth centered selectable\">\n                <p id='dfsNome' class=\"typedHeader sheetName\">Nome</p>\n                <p><b>Nível <span id='NivelAtual'>3</span></b></p>\n            </div>\n            <div class=\"oneFourth selectable\">\n                <p class='sheetVariable' data-type='text' data-id='Arquetipo' data-placeholder='Arquétipo'>Arquetipo</p>\n                <p>\n                    <b>Raça:</b>\n                    <span class=\"sheetVariable\" data-type='text' data-id='Raca'>Raça</span>\n                </p>\n            </div>\n            <div class=\"oneFourth selectable\">\n                <p>\n                    <b>Jogador: </b>\n                    <span class=\"sheetVariable\" data-type='text' data-id='Jogador'>Jogador</span>\n                </p>\n                <p>\n                    <b>Idade: </b>\n                    <span class=\"sheetVariable\" data-type='text' data-id='Idade'>Idade</span>\n                </p>\n            </div>\n            <div class=\"oneFourth unselectable\">\n                <div id=\"dfsExpDiv\" class=\"oneHalf\">\n                    <a>XP</a>\n                    <div>\n                        <div class=\"dfsBar tinyBar yellowBar\">\n                            <a>Atual</a>\n                            <p id='dfsExpAtual'>\n                                120\n                            </p>\n                            <span id=\"dfsExpAtualBar\" class=\"barProgress\" style=\"width: 40%;\"></span>\n                        </div>\n                    </div>\n                    <div>\n                        <div class=\"dfsBar tinyBar purpleBar\">\n                            <a>Total</a>\n                            <p id='dfsExpTotal'>\n                                300\n                            </p>\n                            <span id=\"dfsExpTotalBar\" class=\"barProgress\" style=\"width: 93.75%;\"></span>\n                        </div>\n                    </div>\n                    <div>\n                        <p>\n                            Lv up <a id=\"dfsLevelupXP\">320</a>\n                        </p>\n                    </div>\n                </div>\n                <div class=\"oneHalf antiPaddingTop\">\n                    <div class=\"dfsBar redBar\">\n                        <p>\n                            <img src=\"img/dfs/heart-icon.png\" />\n                            <span id=\"dfsHPAtual\">10</span>/<span id=\"dfsHPMaximo\">10</span>\n                        </p>\n                        <span id=\"dfsHPBar\" class=\"barProgress\" style=\"width: 50%;\"></span>\n                    </div>\n                    <div class=\"dfsBar blueBar\">\n                        <p>\n                            <img src=\"img/dfs/energy-icon.png\" />\n                            <span id=\"dfsMPAtual\">40</span>/<span id=\"dfsMPMaximo\">40</span>\n                        </p>\n                        <span id=\"dfsMPBar\" class=\"barProgress\" style=\"width: 75%;\"></span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div id=\"dfsExtraInfo\" class=\"paddingTop\" style=\"display: none;\">\n            <div id=\"dfsPicture\" class=\"oneFourth centered unselectable sheetVariable\" data-type=\"picture\" data-id=\"Avatar\" data-placeholder=\"Url Avatar\">\n                Imagem\n            </div>\n            <div id=\"dfsLongtexts\" class=\"threeFourths\">\n                <p>\n                    <b>Objetivo:</b>\n                    <span class=\"sheetVariable\" data-type=\"longtext\" data-id=\"Objetivo\" data-placeholder=\"Objetivo atual do personagem\">Objetivo</span>\n                </p>\n                <p>\n                    <b>Aparência: </b>\n                    <span class=\"sheetVariable\" data-type=\"longtext\" data-id=\"Aparencia\" data-placeholder=\"Aparência do personagem\">Aparência</span>\n                </p>\n                <p>\n                    <b>Personalidade: </b>\n                <span class=\"sheetVariable\" data-type=\"longtext\" data-id=\"Personalidade\" data-placeholder=\"Personalidade do personagem\">Personalidade</span>\n                </p>\n                <p>\n                    <b>HP:</b>\n                    <span class=\"sheetVariable\" data-id=\"HPAtual\" data-type=\"integer\" data-default=\"10\">Atual</span>/<span class=\"sheetVariable\" data-id=\"HPMaximo\" data-type=\"integer\" data-default=\"10\">Maximo</span>\n                    &nbsp; &nbsp;\n                    <b>MP:</b>\n                    <span class=\"sheetVariable\" data-id=\"MPAtual\" data-type=\"integer\" data-default=\"40\">Atual</span>/<span class=\"sheetVariable\" data-id=\"MPMaximo\" data-type=\"integer\" data-default=\"40\">Maximo</span>\n                    &nbsp; &nbsp;\n                    <b>Experiência:</b>\n                    <span class=\"sheetVariable\" data-id=\"Exp\" data-type=\"integer\" data-default=\"20\">Exp</span>\n                </p>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"clearLeft fullWidth typedBG\">\n        <p class=\"headerArea\">\n            Ferramentas\n            <a id=\"dfsFerramentasOpenClose\" class=\"openClose floatRight paddingRight\" onclick=\"$('#dfsFerramentas').toggle(); $(this).text($('#dfsFerramentas').is(':visible') ? '(-)' : '(+)');\">\n                (+)\n            </a>\n        </p>\n    </div>\n\n    <div id=\"dfsFerramentas\" class=\"clearLeft fullWidth whiteBG paddingBottom paddingTop\" style=\"display: none\">\n        <input type=\"button\" id=\"dfsHealAll\" value=\"Curar Completamente\" class=\"floatRight\" />\n        <form id='dfsCalculadoraMP' onsubmit='return false;'>\n            <p>\n                <input id=\"dfsMPForm\" type=\"text\" placeholder=\"Alterar MP\" />\n                <input id=\"dfsMPMotivo\" type=\"text\" placeholder=\"Motivo\" />\n                <input type=\"submit\" value='Somar ao MP'/>\n            </p>\n        </form>\n\n        <hr />\n        \n        <input type=\"button\" id=\"dfsHealButton\" value=\"Curar Completamente (Sem devolver Stamina)\" class=\"floatRight\" />\n        <form id='dfsCalculadoraExp' onsubmit='return false;'>\n            <p>\n                <input id=\"dfsExpForm\" type=\"text\" placeholder=\"Alterar Exp\" />\n                <input id=\"dfsExpMotivo\" type=\"text\" placeholder=\"Motivo\" />\n                <input type=\"submit\" value='Somar à Exp' />\n            </p>\n        </form>\n        \n        <hr />\n        <form id='dfsCalculadoraDano' onsubmit=\"return false;\">\n            <p>\n                <input id=\"dfsDanoForm\" type=\"text\" placeholder=\"Dano\" />\n                <input id=\"dfsDanoMotivo\" type=\"text\" placeholder=\"Motivo\" />\n                <input id=\"dfsDanoPercent\" type=\"text\" placeholder=\"Dano %\" />\n                <input id=\"dfsDanoPenetration\" type=\"text\" placeholder=\"Penetração %\" />\n            </p>\n            <p>\n                <b>Tipo:</b>\n                <input id=\"damageAM\" type=\"checkbox\" name=\"dfsDamageType\" /><label for=\"damageAM\">0 - Artes Marciais </label>\n                <input id=\"damageAR\" type=\"checkbox\" name=\"dfsDamageType\" /><label for=\"damageAR\">1 - Arma </label>\n                <input id=\"damageTC\" type=\"checkbox\" name=\"dfsDamageType\" /><label for=\"damageTC\">2 - Tecnologia </label>\n                <input id=\"damageEL\" type=\"checkbox\" name=\"dfsDamageType\" /><label for=\"damageEL\">3 - Elemento </label>\n                <input id=\"damageMG\" type=\"checkbox\" name=\"dfsDamageType\" /><label for=\"damageMG\">4 - Magia </label>\n                <input id=\"damageLD\" type=\"checkbox\" name=\"dfsDamageType\" /><label for=\"damageLD\">5 - Liderança </label>\n            </p>\n            <p style='margin-left: 35px;'>\n                <input id='damageDeal' type='radio' name='damageKind' checked /><label for='damageDeal'>Dano</label>\n                <input id='damageHeal' type='radio' name='damageKind' /><label for='damageHeal'>Cura (H)</label>\n                <input id='damageHealStamina' type='radio' name='damageKind' /><label for='damageHealStamina'>Cura e gasta stamina (HS)</label>\n                <input id=\"damageClear\" type=\"checkbox\" name=\"damageClear\" /><label for=\"damageClear\">Limpar ao enviar</label>\n                <input type=\"submit\" value='Causar dano' />\n            </p>\n        </form>\n        \n        <p>\n            <a id='proStyleButton' onclick=\"$('#proStyle').toggle();\">Mostrar dicas</a>\n        </p>\n        \n        <p id='proStyle' style='display: none'>\n            <b>Pro Style:</b>\n            Adicionar números antes de um hífen  (como em 01-10) é eqivalente à marcar as caixas de tipo acima. A presença do hífen marca os números antes dele como tipos e faz o sistema ignorar os tipos marcados.<br />\n            Adicionar H no dano faz o número encontrado se tornar uma Cura. Adicionar S no dano faz ele retirar um ponto de Stamina. Então HS cura uma certa quantidade e tira um ponto de stamina no fim.\n        </p>\n    </div>\n\n    <div class=\"clearLeft thirdWidthComp typedBG marginTop\">\n        <p class=\"headerArea\">\n            Combate\n            <span class=\"innerColumns\">\n                <span class=\"innerColumn\">\n                    <img src=\"img/dfs/sword-icon.png\" />\n                </span>\n                <span class=\"innerColumn\">\n                    <img src=\"img/dfs/shield-icon.png\" />\n                </span>\n            </span>\n        </p>\n    </div>\n\n    <div class=\"thirdMargin marginTop\"></div>\n\n    <div class=\"thirdWidth typedBG marginTop\" title=\"Considerando os iniciais de 2, todos os personagens possuem 18 pontos para dividir entre os atributos-teste. Bônus raciais acabam jogando a maioria do personagens para 20 pontos, com vantagens e desvantagens podendo alterar isso um pouco mais.\">\n        <p class=\"headerArea\">\n            Atributos-teste\n            <span class=\"floatRight paddingRight\" id='sumAtributosTeste'>\n                (10)\n            </span>\n        </p>\n    </div>\n\n    <div class=\"thirdMargin marginTop\"></div>\n\n    <div class=\"thirdWidth typedBG marginTop\" title=\"No nível 1, personagens possuem 18 pontos para espalhar entre perícias. Isso pode ser alterado por outras coisas, como vantagens ou desvantagens.\">\n        <p class=\"headerArea\">\n            Perícias\n            <span id='SumPericias' class=\"floatRight paddingRight\">\n                (0)\n            </span>\n        </p>\n    </div>\n\n    <div id=\"combatStatList\" class=\"clearLeft thirdWidthComp whiteBG selectable\">\n        <p class=\"combatAM\">\n                Artes Marciais\n                <span class=\"innerColumns\">\n                    <span class=\"innerColumn sheetVariable\" data-type='integer' data-id='ArtesMarciaisNivel' data-default='0'>\n                        1\n                    </span>\n                    <span class=\"innerColumn sheetVariable\" data-type='integer' data-id='ArtesMarciaisRD' data-default='0'>\n                        2\n                    </span>\n                </span>\n                <span class=\"hoverTooltip\">\n                    0/10 Exp\n                </span>\n            </p>\n            <p class=\"combatArma\">\n                Arma\n                <span class=\"innerColumns\">\n                    <span class=\"innerColumn sheetVariable\" data-type='integer' data-id='ArmaNivel' data-default='0'>\n                        1\n                    </span>\n                    <span class=\"innerColumn sheetVariable\" data-type='integer' data-id='ArmaRD' data-default='0'>\n                        2\n                    </span>\n                </span>\n                <span class=\"hoverTooltip\">\n                    0/10 Exp\n                </span>\n            </p>\n            <p class=\"combatTech\">\n                Tecnologia\n                <span class=\"innerColumns\">\n                    <span class=\"innerColumn sheetVariable\" data-type='integer' data-id='TecnologiaNivel' data-default='0'>\n                        1\n                    </span>\n                    <span class=\"innerColumn sheetVariable\" data-type='integer' data-id='TecnologiaRD' data-default='0'>\n                        2\n                    </span>\n                </span>\n                <span class=\"hoverTooltip\">\n                    0/10 Exp\n                </span>\n            </p>\n            <p class=\"combatEle\">\n                Elemento\n                <span class=\"innerColumns\">\n                    <span class=\"innerColumn sheetVariable\" data-type='integer' data-id='ElementoNivel' data-default='0'>\n                        1\n                    </span>\n                    <span class=\"innerColumn sheetVariable\" data-type='integer' data-id='ElementoRD' data-default='0'>\n                        2\n                    </span>\n                </span>\n                <span class=\"hoverTooltip\">\n                    0/10 Exp\n                </span>\n            </p>\n            <p class=\"combatMag\">\n                Magia\n                <span class=\"innerColumns\">\n                    <span class=\"innerColumn sheetVariable\" data-type='integer' data-id='MagiaNivel' data-default='0'>\n                        1\n                    </span>\n                    <span class=\"innerColumn sheetVariable\" data-type='integer' data-id='MagiaRD' data-default='0'>\n                        2\n                    </span>\n                </span>\n                <span class=\"hoverTooltip\">\n                    0/10 Exp\n                </span>\n            </p>\n            <p class=\"combatLid\">\n                Liderança\n                <span class=\"innerColumns\">\n                    <span class=\"innerColumn sheetVariable\" data-type='integer' data-id='LiderancaNivel' data-default='0'>\n                        1\n                    </span>\n                    <span class=\"innerColumn sheetVariable\" data-type='integer' data-id='LiderancaRD' data-default='0'>\n                        2\n                    </span>\n                </span>\n                <span class=\"hoverTooltip\">\n                    0/10 Exp\n                </span>\n            </p>\n            <p class=\"combatRDG\">\n                Resistência Geral\n                <span class=\"innerColumns\">\n                    <span class=\"innerColumn rd sheetVariable\" data-id=\"GeralRD\" data-type=\"integer\" data-default=\"0\">\n                        0\n                    </span>\n                </span>\n            </p>\n            <hr class=\"tinyHR\" />\n            <p class=\"combatSdC\" title=\"Sabedoria de Combate recebe metade de toda a experiência gasta em Atributos de Dano e também metade de toda a experiência não gasta.\">\n                Sabedoria de Combate\n                <span id='dfsSdCNivel' class=\"innerColumns centered\">\n                    4 (105 xp)\n                </span>\n                <span id='dfsSdCExp' class=\"hoverTooltip\">\n                    0/10 Exp\n                </span>\n            </p>\n            <p class=\"combatRes\" title=\"Resistência é igual à metade da sua Sabedoria de Combate e é usada no lugar de atributos mais baixos do que ela como Redução de Dano.\">\n                Resistência\n                <span id='dfsResistenciaNivel' class=\"innerColumns centered\">\n                    0 (0.5)\n                </span>\n            </p>\n            <hr class=\"tinyHR\" />\n            <p class=\"combatDef\">\n                Defesa\n                <span class=\"innerColumns\">\n                    <span class=\"innerColumn sheetVariable\" data-id=\"DefesaNivel\" data-type=\"integer\" data-default=\"0\">\n                        0\n                    </span>\n                    <span class=\"innerColumn\" style=\"background: none;\">\n                        <img src=\"img/dfs/def-icon.png\" />\n                    </span>\n                </span>\n                <span class=\"hoverTooltip\">\n                    0/10 Exp\n                </span>\n            </p>\n            <p class=\"combatAtk\">\n                Ataque\n                <span class=\"innerColumns\">\n                    <span class=\"innerColumn sheetVariable\" data-id=\"AtaqueNivel\" data-type=\"integer\" data-default=\"0\">\n                        0\n                    </span>\n                    <span class=\"innerColumn\" style=\"background: none;\">\n                        <img src=\"img/dfs/atk-icon.png\" />\n                    </span>\n                </span>\n                <span class=\"hoverTooltip\">\n                    0/10 Exp\n                </span>\n            </p>\n    </div>\n\n    <div class=\"thirdMargin\"></div>\n\n    <div id=\"testeLista\" class=\"thirdWidth whiteBG selectable\">\n        <p class=\"testeFor\">\n                Força\n                <span class=\"floatRight\">\n                    <span class=\"innerColumn sheetVariable\" data-id=\"Forca\" data-type=\"integer\" data-default=\"2\">\n                        0\n                    </span>\n                </span>\n            </p>\n            <p class=\"testeCon\">\n                Constituição\n                <span class=\"floatRight\">\n                    <span class=\"innerColumn sheetVariable\" data-id=\"Constituicao\" data-type=\"integer\" data-default=\"2\">\n                        0\n                    </span>\n                </span>\n            </p>\n            <p class=\"testeAgi\">\n                Agilidade\n                <span class=\"floatRight\">\n                    <span class=\"innerColumn sheetVariable\" data-id=\"Agilidade\" data-type=\"integer\" data-default=\"2\">\n                        0\n                    </span>\n                </span>\n            </p>\n            <p class=\"testeCar\">\n                Carisma\n                <span class=\"floatRight\">\n                    <span class=\"innerColumn sheetVariable\" data-id=\"Carisma\" data-type=\"integer\" data-default=\"2\">\n                        0\n                    </span>\n                </span>\n            </p>\n            <p class=\"testeSab\">\n                Sabedoria\n                <span class=\"floatRight\">\n                    <span class=\"innerColumn sheetVariable\" data-id=\"Sabedoria\" data-type=\"integer\" data-default=\"2\">\n                        0\n                    </span>\n                </span>\n            </p>\n            <p class=\"testeInt\">\n                Inteligência\n                <span class=\"floatRight\">\n                    <span class=\"innerColumn sheetVariable\" data-id=\"Inteligencia\" data-type=\"integer\" data-default=\"2\">\n                        0\n                    </span>\n                </span>\n            </p>\n            <p class=\"testeFdV\">\n                Força de Vontade\n                <span class=\"floatRight\">\n                    <span class=\"innerColumn sheetVariable\" data-id=\"ForcaDeVontade\" data-type=\"integer\" data-default=\"2\">\n                        0\n                    </span>\n                </span>\n            </p>\n            <hr class=\"tinyHR\" />\n            <p class=\"testeStamina\" title=\"A quantidade máxima de stamina de um personagem é (Sabedoria de Combate + 2). Esse limite pode ser ultrapassado por se alimentar bem.\">\n                Stamina\n                <span class=\"floatRight\">\n                    <span class=\"innerColumn\">\n                        <span class=\"sheetVariable\" data-id=\"StaminaAtual\" data-type=\"integer\" data-defaul=\"0\">3</span>/<span id=\"dfsStaminaMaxima\">3</span>\n                    </span>\n                </span>\n            </p>\n            <p class=\"testeCura\" title=\"A quantidade que cada stamina cura é igual a (Sabedoria de Combate + 2)\">\n                Cura\n                <span class=\"floatRight\">\n                    <span class=\"innerColumn\" id=\"dfsCura\">\n                        3\n                    </span>\n                </span>\n            </p>\n<!--                            <p class=\"typedBG headerArea\">\n                Equipamentos\n                <span class=\"innerColumns\">\n                    <img style=\"margin-right: 3px;\" src=\"img/dfs/equips-icon.png\" />\n                </span>\n            </p>\n            <hr class=\"tinyHR\" />\n            <div class=\"equipButton arma thirdWidthNoMargin floatLeft\">\n                <p onclick=\"$(this).parent().toggleClass('toggled');\">Espada de duas mãos</p>\n            </div>\n            <div class=\"equipButton armadura toggled thirdWidthNoMargin floatLeft\">\n                <p onclick=\"$(this).parent().toggleClass('toggled');\">Armadura lendária</p>\n            </div>\n            <div class=\"equipButton escudo thirdWidthNoMarginComp floatLeft\">\n                <p onclick=\"$(this).parent().toggleClass('toggled');\">Hilde</p>\n            </div>-->\n    </div>\n\n    <div class=\"thirdMargin\"></div>\n    <div class=\"floatRight thirdWidth whiteBG\">\n        <div id=\"periciasLista\" class=\"sheetList\" data-id=\"Pericias\"\n                 data-default='[{\"Attribute\":0,\"Name\":\"Atletismo\",\"Valor\":0},{\"Attribute\":2,\"Name\":\"Acrobacia\",\"Valor\":0},{\"Attribute\":2,\"Name\":\"Furtividade\",\"Valor\":0},{\"Attribute\":2,\"Name\":\"Ladinagem\",\"Valor\":0},{\"Attribute\":3,\"Name\":\"Intimidação\",\"Valor\":0},{\"Attribute\":3,\"Name\":\"Blefe\",\"Valor\":0},{\"Attribute\":3,\"Name\":\"Diplomacia\",\"Valor\":0},{\"Attribute\":3,\"Name\":\"Manha\",\"Valor\":0},{\"Attribute\":4,\"Name\":\"Socorro\",\"Valor\":0},{\"Attribute\":4,\"Name\":\"Natureza\",\"Valor\":0},{\"Attribute\":4,\"Name\":\"Percepção\",\"Valor\":0},{\"Attribute\":5,\"Name\":\"Arcanismo\",\"Valor\":0},{\"Attribute\":5,\"Name\":\"História\",\"Valor\":0},{\"Attribute\":5,\"Name\":\"Religião\",\"Valor\":0},{\"Attribute\":5,\"Name\":\"Sistemas\",\"Valor\":0},{\"Attribute\":7,\"Name\":\"Prontidão\",\"Valor\":0}]' >\n            <p class=\"testeFor\">\n                <a class=\"deleteButton deleteRow\"></a>\n                (<span class=\"sheetVariable\" data-id=\"Attribute\" data-type=\"select\" data-options=\"For;Con;Agi;Car;Sab;Int;FdV;N/A\" data-default=\"0\">For</span>)\n                <span class=\"sheetVariable\" data-id=\"Name\" data-type=\"text\" data-placeholder=\"Perícia\">Nome</span>\n                <span class=\"innerColumns\">\n                    <span class=\"innerColumn sheetVariable\" data-id=\"Valor\" data-type=\"integer\" data-default=\"0\">\n                        3\n                    </span>\n                </span>\n            </p>\n        </div>\n        <a class=\"addRow\" data-for=\"Pericias\">+ Adicionar</a>\n    </div>\n\n    <!--\n    <div class=\"clearLeft twoThirdsWidth marginTop escudoEquipBg\">\n        <p>\n            EQUIPSHOW - <a onclick=\"$('#rightWindow').toggleClass('fullScreen');\">TESTE CLICK HERE</a>\n        </p>\n        <p>\n            Linha 2\n        </p>\n        <p>\n            Linha 3\n        </p>\n        <p>\n            Linha 4\n        </p>\n    </div>\n\n    <div class=\"clearLeft twoThirdsWidth typedBG marginTop\">\n        <p class=\"headerArea\">\n            Bônus\n            <span id=\"dfsPassRound\">\n                Passar Rodada\n            </span>\n        </p>\n    </div>\n    <div class=\"clearLeft twoThirdsWidth whiteBG\">\n        A\n        <hr class=\"tinyHR\" />\n        <a class=\"addRow\">+ Adicionar</a>\n    </div>\n    \n    -->\n\n\n    <div class=\"clearLeft fullWidth typedBG marginTop\">\n        <p class=\"headerArea\">\n            <a id=\"dfsTecnicasOpenClose\" class=\"openClose floatRight paddingRight\" onclick=\"$('#dfsTecnicas').toggle(); $(this).text($('#dfsTecnicas').is(':visible') ? '(-)' : '(+)');\">\n                (-)\n            </a>\n            Técnicas\n        </p>\n    </div>\n    <div id=\"dfsTecnicas\" class=\"fullWidth whiteBG selectable sheetList\" data-id=\"Tecnicas\">\n        <div class=\"techDiv techAtaque\">\n            <a class=\"deleteButton deleteRow unselectable\"></a>\n            <span class=\"techName sheetVariable\" data-id=\"Nome\" data-type=\"text\" data-placeholder=\"Nome da Tecnica\">\n                Nome\n            </span>\n            <div class=\"techMiddle\">\n                <div class='techAddonsContainer'>\n                    <div class=\"sheetList\" data-id=\"Addons\">\n                        <p>\n                            <a class=\"deleteButton deleteRow unselectable\"></a>\n                            <span class=\"sheetVariable\" data-id=\"Nome\" data-type=\"text\" data-placeholder=\"Addon\">Nome</span>\n                        </p>\n                    </div>\n                    <a class=\"addRow unselectable\" data-for=\"Addons\">+ Adicionar</a>\n                </div>\n                <div class='techDesc'>\n                    <b>Descrição:</b>\n                    <span class=\"sheetVariable\" data-id=\"Descricao\" data-type=\"longtext\" data-placeholder=\"Descrição\">Descrição</span>\n                    <br />\n                    <b>Tipo:</b>\n                    <span class=\"sheetVariable\" data-id=\"Tipo\" data-type=\"select\" data-options='Estilo de Luta;Passiva;Ataque;Especial' data-default=\"2\">Tipo</span>\n                </div>\n                <span style='display: block; clear: both;'></span>\n            </div>\n            <div class='techBar techCusto'>\n                <a class='techCustoIcon'></a>\n                <b>Custo:</b>\n                <span class='sheetVariable' data-id='Custo' data-type='longtext' data-placeholder='Custo'>Custo</span>\n            </div>\n            <div class='techBar techEfeito'>\n                <a class='techEfeitoIcon'></a>\n                <b>Efeito:</b>\n                <span class='sheetVariable' data-id='Efeito' data-type='longtext' data-placeholder='Efeito'>1d6 + 5 Dano</span>\n            </div>\n        </div>\n    </div>\n    <div class='whiteBG fullWidth'>\n        <a class=\"addRow\" data-for='Tecnicas'>+ Adicionar</a>\n    </div>\n\n\n    <div class='thirdWidth clearLeft marginTop selectable' id='dfsVantDesv' title=\"A somatória de Vantagens não deve ultrapassar a somatória de desvantagens, mas pode-se ter quantas vantagens desejar. Humanos ganham 4 pontos de vantagens grátis, podendo alcançar até 14.\">\n        <div class='fullWidth typedBG'>\n            <p class='headerArea'>\n                Vantagens (<span id='VantagensSum'>0</span>)\n            </p>\n        </div>\n        <div class='fullWidth whiteBG clearLeft vantList'>\n            <div class='sheetList' data-id='Vantagens'>\n                <p>\n                    <a class=\"deleteButton deleteRow\"></a>\n                    <b class='sheetVariable smallInput' data-id='Pontos' data-type='integer' data-default='0'>Valor</b>\n                    <span class='sheetVariable bigInput' data-id='Nome' data-type='text' data-placeholder='Nome da Vantagem'>Nome</span>\n                </p>\n            </div>\n            <a class=\"addRow unselectable\" data-for='Vantagens'>+ Adicionar</a>\n        </div>\n        <div class='marginTop fullWidth typedBG' title=\"Você só pode ganhar pontos por quatro desvantagens e a somatória não ultrapassa 10 pontos.\">\n            <p class='headerArea'>\n                Desvantagens (<span id='DesvantagensSum'>0</span>)\n            </p>\n        </div>\n        <div class='fullWidth whiteBG clearLeft vantList'>\n            <div class='sheetList' data-id='Desvantagens'>\n                <p>\n                    <a class=\"deleteButton deleteRow\"></a>\n                    <b class='sheetVariable smallInput' data-id='Pontos' data-type='integer' data-default='0'>Valor</b>\n                    <span class='sheetVariable bigInput' data-id='Nome' data-type='text' data-placeholder='Nome da Desvantagem'>Nome</span>\n                </p>\n            </div>\n            <a class=\"addRow unselectable\" data-for='Desvantagens'>+ Adicionar</a>\n        </div>\n    </div>\n\n    <div id=\"dfsInventarioHeader\" class='twoThirdsWidth marginTop typedBG floatRight' title='O limite de inventário é (Força x 4), mas pode ser aumentado por vantagens.'>\n        <p class='headerArea selectable'>\n            <a class=\"bagIcon\"></a>\n            Inventário (<span id='InventarioAtual'>0</span>/<span class='sheetVariable' data-id='InventarioMax' data-type='integer' data-default='8'>Limite</span>)\n            <span class=\"innerColumns\">\n                <span class=\"innerColumn\">\n                    Peso\n                </span>\n                <span class=\"innerColumn\">\n                    Total\n                </span>\n            </span>\n        </p>\n    </div>\n\n    <div class='twoThirdsWidth whiteBG floatRight selectable'>\n        <div id=\"dfsInventario\" class='sheetList' data-id='Inventario'>\n            <div>\n                <p class=\"noWeight\">\n                    <span class=\"dfsQuantidade sheetVariable\" data-id='Quantidade' data-type='integer' data-default='1'>\n                        Quantidade\n                    </span>\n                    <a class=\"deleteButton deleteRow unselectable\"></a>\n                    <span class=\"dfsNomeItem sheetVariable\" data-id='Nome' data-type='text' data-placeholder='Nome do Item'>\n                        Nome\n                    </span>\n                    <span class=\"innerColumns\">\n                        <span class=\"innerColumn sheetVariable\" data-id='Peso' data-default='0' data-type='integer' title='Por padrão, itens tem peso 1. Itens pesados, como equipamentos, possuem peso 2. Bandagens possuem peso 0 dentro de kits de primeiros socorros.'>\n                            0\n                        </span>\n                        <span class=\"innerColumn pesoTotal bagPesoTotal\">\n                            0\n                        </span>\n                    </span>\n                </p>\n                <div class='sheetList' data-id='SubInventario'>\n                    <p class=\"weight\">\n                        <span class=\"dfsQuantidade sheetVariable\" data-id='Quantidade' data-type='integer' data-default='1'>\n                            Quantidade\n                        </span>\n                        <a class=\"deleteButton deleteRow unselectable\"></a>\n                        <span class=\"dfsNomeItem sheetVariable\" data-id='Nome' data-type='text' data-placeholder='Nome do Item'>\n                            Nome\n                        </span>\n                        <span class=\"innerColumns\">\n                            <span class=\"innerColumn sheetVariable\" data-id='Peso' data-default='0' data-type='integer' title='Por padrão, itens tem peso 1. Itens pesados, como equipamentos, possuem peso 2. Bandagens possuem peso 0 dentro de kits de primeiros socorros.'>\n                                0\n                            </span>\n                            <span class=\"innerColumn pesoTotal itemPesoTotal\">\n                                0\n                            </span>\n                        </span>\n                    </p>\n                </div>\n                <a class=\"addRow unselectable\" data-for='SubInventario'>+ Adicionar</a>\n            </div>\n        </div>\n        <a class=\"addRow unselectable\" data-for='Inventario'>+ Adicionar</a>\n    </div>\n\n    <div class='fullWidth clearBoth typedBG marginTop'>\n        <p class='headerArea'>\n            Anotações\n        </p>\n    </div>\n\n    <div class='fullWidth clearBoth whiteBG'>\n        <div id=\"dfsAnotacoes\" class=\"selectable sheetList\" data-id=\"Anotacoes\"\n             data-default='[{\"Campo\":\"Dinheiro\",\"Valor\":\"500\"},{\"Campo\":\"Pontos de Habilidade\",\"Valor\":\"0\"}]'>\n            <p>\n                <a class=\"deleteButton deleteRow unselectable\"></a>\n                <b class=\"sheetVariable\" data-type=\"text\" data-id=\"Campo\" data-placeholder=\"Nome da Anotação\">Campo</b>\n                :\n                <span class=\"sheetVariable\" data-type=\"longtext\" data-id=\"Valor\" data-placeholder=\"Anotação\">Valor</span>\n            </p>\n        </div>\n        <a class=\"addRow unselectable\" data-for=\"Anotacoes\">+ Adicionar</a>\n    </div>\n    \n    <div class=\"clearLeft fullWidth typedBG marginTop\">\n        <p class=\"headerArea\">\n            <a id=\"dfsLogsOpenClose\" class=\"openClose floatRight paddingRight\" onclick=\"$('#dfsLogs').toggle(); $(this).text($('#dfsLogs').is(':visible') ? '(-)' : '(+)');\">\n                (-)\n            </a>\n            Logs\n        </p>\n    </div>\n    <div id='dfsLogs' class='fullWidth whiteBG marginBottom'>\n        <a onclick=\"$('#dfsLogs > div').hide(); $('#dfsLogs > a').removeClass('active'); $(this).addClass('active'); $('#dfsLogsExp').show();\">Log de Experiência</a> | \n        <a onclick=\"$('#dfsLogs > div').hide(); $('#dfsLogs > a').removeClass('active'); $(this).addClass('active'); $('#dfsLogsDano').show();\">Log de Dano</a> | \n        <a onclick=\"$('#dfsLogs > div').hide(); $('#dfsLogs > a').removeClass('active'); $(this).addClass('active'); $('#dfsLogsMP').show();\">Log de MP</a>\n        <div id='dfsLogsExp' class='sheetList selectable' data-id='ExpLog' style='display: none'>\n            <p>\n                <a class=\"deleteButton deleteRow unselectable\"></a>\n                <b class='sheetVariable' data-id='Quantidade' data-type='integer' data-default='0'>Quantidade</b>:\n                <span class='sheetVariable bigInput' data-id='Motivo' data-type='text' data-placeholder='Motivo do ganho'>Motivo</span>\n            </p>\n        </div>\n        <div id='dfsLogsMP' class='sheetList selectable' data-id='MPLog' style='display: none'>\n            <p>\n                <a class=\"deleteButton deleteRow unselectable\"></a>\n                <b class='sheetVariable' data-id='Quantidade' data-type='integer' data-default='0'>Quantidade</b>:\n                <span class='sheetVariable bigInput' data-id='Motivo' data-type='text' data-placeholder='Motivo da alteração'>Motivo</span>\n            </p>\n        </div>\n        <div id='dfsLogsDano' class='sheetList selectable' data-id='CombatLog' style='display: none'>\n            <p>\n                <a class=\"deleteButton deleteRow unselectable\"></a>\n                <b class='sheetVariable' data-id='Quantidade' data-type='integer' data-default='0'>Quantidade</b>:\n                <span class='sheetVariable bigInput' data-id='Motivo' data-type='text' data-placeholder='Motivo do ganho'>Motivo</span>\n                <br />\n                <span class='sheetVariable' data-id='Explicacao' data-type='longtext' data-placeholder='Cálculo do dano'>Explicação</span>\n            </p>\n        </div>\n    </div>\n    \n    <div id=\"dfsLastDiv\">\n        \n    </div>\n\n</div>";
    
    this.css = "/* Ferramentas e Log */\n\n#dfsDiv #dfsFerramentas input[type=text] {\n    width: 100px;\n    margin-right: 10px;\n    text-align: center;\n}\n\n#dfsDiv #dfsFerramentas p {\n    padding-left: 5px;\n    padding-right: 5px;\n    text-align: justify;\n}\n\n#dfsDiv #dfsFerramentas p > b {\n    color: #000;\n}\n\n#proStyleButton {\n    color: #3a4bd6;\n}\n\n#proStyleButton:hover {\n    color: #707fff;\n    cursor: pointer;\n}\n\n#proStyleButton:active {\n    color: #4853a9;\n}\n\n#dfsDiv #dfsLogs input {\n    width: 100px;\n    text-align: center;\n    height: 25px;\n    line-height: 25px;\n}\n\n#dfsDiv #dfsLogs .bigInput input {\n    width: 400px;\n    text-align: left;\n}\n\n#dfsDiv #dfsLogs textarea {\n    margin-top: 10px;\n    width: 600px;\n}\n\n#dfsDiv #dfsLogs b {\n    color: #000;\n}\n\n#dfsDiv #dfsLogs p {\n    padding-left: 10px;\n    padding-right: 10px;\n    padding-bottom: 4px;\n    border-bottom: solid 1px #fff;\n    background-color: #bcc3ff;\n}\n\n#dfsDiv #dfsLogs p:hover {\n    background-color: #8f99e8;\n}\n\n#dfsLogs > a {\n    font-weight: bold;\n    color: #2737bd;\n    font-size: 1.2em;\n    padding-left: 10px;\n    padding-right: 10px;\n}\n\n#dfsLogs > a:hover {\n    color: #394df2;\n    cursor: pointer;\n}\n\n#dfsLogs > a:active {\n    color: #0f1d96\n}\n\n#dfsLogs > a.active, #dfsLogs > a.active:hover, #dfsLogs > a.active:active {\n    color: #2737bd;\n    cursor: default;\n    background-color: #bcc3ff;\n}\n\n/* Ferramentas e Log */\n\n/* Edit Inputs */\n\n#dfsDiv #dfsCommonInfo input {\n    width: 60%;\n    vertical-align: top;\n    border-bottom: solid 1px #fff;\n}\n\n#dfsDiv #dfsExpTotal input {\n    position: absolute;\n    width: 20px;\n    height: 7px;\n    line-height: 7px;\n    font-size: 0.8em;\n    background-color: red;\n    top: 0px;\n    right: 0px;\n    vertical-align: top;\n    text-align: right;\n}\n\n#dfsDiv #dfsNome input {\n    vertical-align: top;\n    text-align: center;\n    font-size: 0.85em;\n    height: auto;\n    width: 80%;\n    margin-top: -3px;\n}\n\n#dfsDiv #dfsPicture input {\n    width: 80%;\n    border: none;\n    border-bottom: 1px solid #fff;\n    color: #fff;\n}\n\n#dfsDiv #dfsLongtexts textarea {\n    width: 370px;\n    margin-bottom: 10px;\n    resize: none;\n    border: solid 1px #000;\n    background-color: rgba(192,192,192,.5);\n}\n\n#dfsDiv #dfsLongtexts input {\n    border-bottom-color: #fff;\n    width: 30px;\n    text-align: center;\n}\n\n#dfsDiv #dfsLongtexts textarea::-webkit-input-placeholder {\n    color: #0b3949;\n}\n\n#dfsDiv #dfsInventario .dfsQuantidade > input, #dfsDiv #dfsInventario .innerColumn > input {\n    width: 20px;\n    height: 20px;\n    text-align: center;\n    margin-top: -3px;\n}\n\n#dfsDiv #dfsInventario .dfsNomeItem > input {\n    width: 230px;\n}\n\n#dfsDiv #dfsInventarioHeader input {\n    height: 20px;\n    line-height: 20px;\n    text-align: center;\n    border-bottom-color: #fff;\n    width: 20px;\n    margin-top: -6px;\n}\n\n#dfsDiv #dfsAnotacoes input {\n    width: 140px;\n}\n\n#dfsDiv #dfsAnotacoes textarea {\n    width: 460px;\n    resize: none;\n    border: solid 1px #000;\n    background-color: rgba(192, 192, 192, .5);\n    margin-top: 4px;\n    margin-bottom: 10px;\n}\n\n#dfsDiv #periciasLista select {\n    width: 45px;\n}\n\n#dfsDiv #periciasLista .deleteButton {\n    width: 20px;\n}\n\n#dfsDiv #periciasLista > p > span.innerColumns > span.innerColumn > input {\n    text-align: center;\n    width: 20px;\n    color: inherit;\n    padding-bottom: 3px;\n}\n\n#dfsDiv #periciasLista > p > span.sheetVariable > input[type=text] {\n    width: 85px;\n    vertical-align: middle;\n    margin-top: 1px;\n}\n\n#dfsTecnicas .deleteButton {\n    position: absolute;\n    right: 0px;\n    background-color: rgba(255,255,255,.5);\n}\n\n#dfsTecnicas .techAddonsContainer .deleteButton {\n    background-color: initial;\n    right: initial;\n    left: 0px;\n    width: 30px;\n    margin: 0px;\n    background-position-x: center;\n}\n\n#dfsDiv #dfsTecnicas .techAddonsContainer input {\n    width: 100px;\n    height: 20px;\n    line-height: 30px;\n    vertical-align: middle;\n}\n\n#dfsTecnicas input::-webkit-input-placeholder, #dfsTecnicas textarea::-webkit-input-placeholder {\n    color: #0b3949;\n}\n\n#dfsDiv #dfsTecnicas .techName input {\n    width: 90%;\n    height: 21px;\n    margin-bottom: 3px;\n    border-bottom: solid 2px #000;\n}\n\n#dfsDiv #dfsTecnicas textarea {\n    width: 400px;\n    margin-bottom: 10px;\n    resize: none;\n    vertical-align: top;\n    background-color: rgba(192,192,192,.5);\n}\n\n#dfsDiv #dfsTecnicas .techBar textarea {\n    margin-top: 6px;\n    width: 520px;\n}\n\n#dfsDiv #dfsVantDesv .smallInput input {\n    width: 15px;\n    height: 20px;\n    line-height: 20px;\n    text-align: center;\n    vertical-align: middle;\n}\n\n#dfsDiv #dfsVantDesv .bigInput input {\n    width: 70%;\n    height: 20px;\n    line-height: 20px;\n    text-align: center;\n    vertical-align: middle;\n}\n\n#dfsDiv input[type=text] {\n    display: inline-block;\n    width: 50px;\n    height: 15px;\n    border: none;\n    border-bottom: 1px solid #000;\n    outline: none;\n    background: none;\n    vertical-align: middle;\n    font-family: alegreya;\n    font-size: inherit;\n    color: inherit;\n    font-weight: inherit;\n}\n\n#dfsDiv textarea {\n    display: inline-block;\n    width: 50px;\n    height: 80px;\n    border: solid 1px #000;\n    background-color: #fff;\n    vertical-align: top;\n    outline: none;\n    font-family: alegreya;\n    font-size: inherit;\n    color: inherit;\n    font-weight: inherit;\n    background: none;\n}\n\n#dfsDiv select {\n    font-family: alegreya;\n}\n\n#dfsDiv #combatStatList input, #dfsDiv #testeLista input {\n    text-align: center;\n    width: 20px;\n    color: inherit;\n    padding-bottom: 3px;\n}\n\n/* Edit Inputs */\n\n/* Vantagens e Desvantagens */\n\n#dfsVantDesv > div.vantList > div > p:hover {\n    background-color: #d9d9d9;\n}\n\n#dfsVantDesv > div.vantList > div > p > b {\n    display: inline-block;\n    text-align: center;\n    width: 30px;\n    color: #000;\n    font-size: 1.2em;\n    line-height: 30px;\n}\n\n#dfsVantDesv > div.vantList > div > p > span {\n    font-size: 0.9em;\n    line-height: 30px;\n}\n\n#dfsVantDesv > div.vantList > div > p > a.deleteButton {\n    background-image: url('img/dfs/fechar1-icon.png');\n    background-position: center center;\n    background-repeat: no-repeat;\n    width: 30px;\n    height: 30px;\n    display: inline-block;\n    vertical-align: middle;\n    float: right;\n}\n\n#dfsVantDesv > div.vantList > div > p > a.deleteButton:hover {\n    background-image: url('img/dfs/fechar2-icon.png');\n    cursor: pointer;\n}\n\n#dfsVantDesv > div.vantList > div > p > a.deleteButton:active {\n    background-image: url('img/dfs/fechar1-icon.png');\n}\n\n/* Vantagens e Desvantagens END */\n\n\n/* TECNICAS TEMPORARIAS */\n\n/* ATAQUE */\n\n#dfsTecnicas > div.techAtaque > span.techName {\n    background-color: #b11e3b;\n}\n\n#dfsTecnicas > div.techAtaque > div.techMiddle {\n    background-color: #f69693;\n}\n\n#dfsTecnicas > div.techAtaque > div.techCusto > b, #dfsTecnicas > div.techAtaque > div.techCusto > span {\n    color: #9a1c1f;\n}\n\n#dfsTecnicas > div.techAtaque > div.techCusto {\n    background-color: #f2737a;\n}\n\n#dfsTecnicas > div.techAtaque > div.techCusto:hover {\n    background-color: #b11e3b;\n}\n\n#dfsTecnicas > div.techAtaque > div.techEfeito > b, #dfsTecnicas > div.techAtaque > div.techEfeito > span {\n    color: #9a1c1f;\n}\n\n#dfsTecnicas > div.techAtaque > div.techEfeito {\n    background-color: #f69693;\n}\n\n#dfsTecnicas > div.techAtaque > div.techEfeito:hover {\n    background-color: #ee304e;\n}\n\n/* PASSIVA */\n\n#dfsTecnicas > div.techPassiva > span.techName {\n    background-color: #03b19c;\n}\n\n#dfsTecnicas > div.techPassiva > div.techMiddle {\n    background-color: #9cd6c9;\n}\n\n#dfsTecnicas > div.techPassiva > div.techCusto > b, #dfsTecnicas > div.techPassiva > div.techCusto > span {\n    color: #025a70;\n}\n\n#dfsTecnicas > div.techPassiva > div.techCusto {\n    background-color: #68c7bd;\n}\n\n#dfsTecnicas > div.techPassiva > div.techCusto:hover {\n    background-color: #007883;\n}\n\n#dfsTecnicas > div.techPassiva > div.techEfeito > b, #dfsTecnicas > div.techPassiva > div.techEfeito > span {\n    color: #025a70;\n}\n\n#dfsTecnicas > div.techPassiva > div.techEfeito {\n    background-color: #9cd6c9;\n}\n\n#dfsTecnicas > div.techPassiva > div.techEfeito:hover {\n    background-color: #03b19c;\n}\n\n/* Especial */\n\n#dfsTecnicas > div.techEspecial > span.techName {\n    background-color: #f47a24;\n}\n\n#dfsTecnicas > div.techEspecial > div.techMiddle {\n    background-color: #fee36d;\n}\n\n#dfsTecnicas > div.techEspecial > div.techCusto > b, #dfsTecnicas > div.techEspecial > div.techCusto > span {\n    color: #e64f25;\n}\n\n#dfsTecnicas > div.techEspecial > div.techCusto {\n    background-color: #ffcd55;\n}\n\n#dfsTecnicas > div.techEspecial > div.techCusto:hover {\n    background-color: #e85725;\n}\n\n#dfsTecnicas > div.techEspecial > div.techEfeito > b, #dfsTecnicas > div.techEspecial > div.techEfeito > span {\n    color: #e64f25;\n}\n\n#dfsTecnicas > div.techEspecial > div.techEfeito {\n    background-color: #ffe46e;\n}\n\n#dfsTecnicas > div.techEspecial > div.techEfeito:hover {\n    background-color: #f79036;\n}\n\n/* Estilo de Luta */\n\n#dfsTecnicas > div.techEdL > span.techName {\n    background-color: #8254a2;\n}\n\n#dfsTecnicas > div.techEdL > div.techMiddle {\n    background-color: #caa9d0;\n}\n\n#dfsTecnicas > div.techEdL > div.techCusto > b, #dfsTecnicas > div.techEdL > div.techCusto > span {\n    color: #453386;\n}\n\n#dfsTecnicas > div.techEdL > div.techCusto {\n    background-color: #ac87bd;\n}\n\n#dfsTecnicas > div.techEdL > div.techCusto:hover {\n    background-color: #692d8a;\n}\n\n#dfsTecnicas > div.techEdL > div.techEfeito > b, #dfsTecnicas > div.techEdL > div.techEfeito > span {\n    color: #453386;\n}\n\n#dfsTecnicas > div.techEdL > div.techEfeito {\n    background-color: #c9a8d0;\n}\n\n#dfsTecnicas > div.techEdL > div.techEfeito:hover {\n    background-color: #8255a2;\n}\n\n/* Outras coisas tecnicas */\n\n#dfsTecnicas > div > span.techName {\n    display: block;\n    width: 100%;\n    text-indent: 5px;\n    font-variant: small-caps;\n    font-weight: bold;\n    font-size: 1.3em;\n    color: #fff;\n    line-height: 30px;\n}\n\n#dfsTecnicas > div > div.techMiddle {\n    position: relative;\n    display: block;\n    width: 100%;\n    color: #414242;\n}\n\n#dfsTecnicas > div > div.techMiddle > div.techAddonsContainer {\n    width: 170px;\n    //position: absolute;\n    //top: 0px;\n    //left: 0px;\n    //bottom: 0px;\n    float: left;\n    position: relative;\n}\n\n#dfsTecnicas > div > div.techMiddle > div.techAddonsContainer > div {\n    font-weight: bold;\n    text-align: center;\n    font-size: 0.8em;\n    margin-top: 5px;\n    margin-bottom: 5px;\n    line-height: 1.5em;\n}\n\n#dfsTecnicas > div > div.techMiddle > div.techDesc {\n    margin-left: 170px;\n    padding-top: 6px;\n    font-size: 0.8em;\n}\n\n#dfsTecnicas > div > div.techMiddle > div.techDesc > b {\n    color: #414242;\n    text-transform: uppercase;\n}\n\n#dfsDiv #dfsTecnicas .addRow {\n    color: #000f8d;\n}\n\n#dfsDiv #dfsTecnicas .addRow:hover {\n    background-color: rgba(255,255,255,.3);\n}\n\n#dfsDiv #dfsTecnicas .addRow:active {\n    background-color: rgba(255,255,255,.1);\n}\n\n#dfsTecnicas > div > div.techBar {\n    display: block;\n    width: 100%;\n    font-size: 1em;\n    line-height: 28px;\n    margin: 0px;\n}\n\n#dfsTecnicas > div > div.techBar > a {\n    width: 40px;\n    height: 28px;\n    display: inline-block;\n    vertical-align: middle;\n    margin: 0px;\n}\n\n#dfsTecnicas > div > div.techBar > a.techEfeitoIcon {\n    background-image: url('img/dfs/bonus-icon.png');\n}\n\n#dfsTecnicas > div > div.techBar > a.techCustoIcon {\n    background-image: url('img/dfs/custo-icon.png');\n}\n\n#dfsTecnicas > div > div.techBar > b {\n    text-transform: uppercase;\n    display: inline-block;\n    width: 65px;\n}\n\n#dfsTecnicas > div > div.techBar:hover > span, #dfsTecnicas > div > div.techBar:hover > b {\n    color: #fff;\n}\n\n\n\n/* TECNICAS TEMPORARIAS */\n\n\n/* Inventario */\n\n#dfsInventarioHeader > p > a.bagIcon {\n    background-image: url('img/dfs/bag-icon.png');\n    width: 28px;\n    height: 30px;\n    display: inline-block;\n    vertical-align: middle;\n    margin-left: -10px;\n}\n\n#dfsInventarioHeader > p.headerArea {\n    overflow: hidden;\n}\n\n#dfsInventarioHeader > p > span.innerColumns > span.innerColumn {\n    font-size: 0.6em;\n    text-align: center;\n    width: 40px;\n    border-left: solid 1px #fff;\n    float: left;\n}\n\n#dfsInventario > div p {\n    border: none;\n    line-height: 28px;\n    height: 28px;\n    overflow: hidden;\n}\n\n#dfsInventario > div > p:nth-child(0n+1) {\n    border-top: solid 1px #000;\n}\n\n#dfsInventario > div > div > p > span.dfsQuantidade {\n    padding-left: 28px;\n}\n\n#dfsInventario > div p > span.dfsQuantidade {\n    display: inline-block;\n    width: 28px;\n    background-color: #ebeaf2;\n    text-align: center;\n}\n\n#dfsInventario > div p > span.dfsNomeItem {\n    font-size: 0.9em;\n    padding-left: 10px;\n    line-height: 28px;\n    font-weight: bold;\n}\n\n#dfsInventario > div p:hover {\n    background-color: #d9d9d9;\n}\n\n#dfsInventario > div p.noWeight > span.dfsNomeItem {\n    color: #691e23;\n}\n\n#dfsInventario > div p.weight > span.dfsNomeItem {\n    color: #265f56;\n}\n\n#dfsInventario > div p > span.innerColumns {\n    height: 28px;\n    background-color: #ebeaf2;\n}\n\n#dfsInventario > div p > span.innerColumns > span.innerColumn {\n    font-size: 0.8em;\n    float: left;\n    text-align: center;\n    width: 40px;\n    border-left: solid 1px #fff;\n}\n\n#dfsInventario > div > addRow {\n    display: block;\n    width: 100%;\n    height: 30px;\n}\n\n\n/* Inventario */\n\n\n/* Anotações */\n\n#dfsDiv #dfsAnotacoes > p {\n    line-height: 30px;\n    color: #000;\n    padding-left: 10px;\n    padding-right: 10px;\n}\n\n#dfsAnotacoes > p:hover {\n    background-color: #e6e6e6;\n}\n\n#dfsAnotacoes > p > b {\n    color: #000;\n}\n\n#dfsAnotacoes > p > a.deleteButton {\n    background-image: url('img/dfs/fechar1-icon.png');\n    background-position: center center;\n    background-repeat: no-repeat;\n    width: 30px;\n    height: 30px;\n    margin-left: -10px;\n    display: inline-block;\n    vertical-align: middle;\n}\n\n/* Anotações */\n\n#dfsDiv .openClose:hover {\n    background-color: rgba(255,255,255,.2);\n    cursor: pointer;\n    padding-right: 10px;\n    padding-left: 10px;\n}\n\n#dfsDiv .openClose:active {\n    background-color: rgba(255,255,255,.1);\n}\n\n#dfsExpDiv {\n    margin-top: 2px;\n}\n\n#dfsExpDiv > a {\n    float: left;\n    font-size: 0.7em;\n    font-weight: bold;\n    margin-top: -3px;\n    width: 20%;\n    display: block;\n    height: 100%;\n    overflow: hidden;\n    color: #fff;\n    text-transform: uppercase;\n}\n#dfsExpDiv > div {\n    display: block;\n    height: 12px;\n    float: right;\n    width: 80%;\n    margin-bottom: 2px;\n}\n\n#dfsExpDiv .dfsBar.tinyBar {\n    height: 100%;\n    width: 90%;\n    margin: 0px;\n    margin-left: 5%;\n    padding: 0px;\n}\n\n#dfsExpDiv .dfsBar.tinyBar > p {\n    font-size: 0.7em;\n    line-height: 100%;\n    color: #fff;\n}\n\n#dfsExpDiv .dfsBar.tinyBar > a {\n    color: #fff;\n    font-size: 0.65em;\n    line-height: 100%;\n    font-weight: bold;\n    text-transform: uppercase;\n    position: absolute;\n    z-index: 2;\n    left: 2px;\n}\n\n#dfsExpDiv > div > p {\n    line-height: 12px;\n    font-size: 0.7em;\n    color: #fff;\n    text-indent: 5px;\n    text-transform: uppercase;\n    font-weight: bold;\n}\n\n#dfsExpDiv > div > p > a {\n    float: right;\n    margin-right: 5px;\n    margin-left: -100px;\n}\n\n#dfsDiv .dfsBar {\n    width: 90%;\n    margin-left: 5%;\n    overflow: hidden;\n    height: 15px;\n    margin-top: 7px;\n    border: solid 1px;\n    box-sizing: border-box;\n    position: relative;\n    border-radius: 3px;\n}\n\n#dfsDiv .dfsBar > p > img {\n    vertical-align: middle;\n}\n\n#dfsDiv .dfsBar > p {\n    height: 100%;\n    position: absolute;\n    right: 5px;\n    left: 5px;\n    top: 0px;\n    line-height: 15px;\n    font-weight: bold;\n    text-align: right;\n    z-index: 2;\n}\n\n#dfsDiv .dfsBar.yellowBar {\n    border-color: #ebf304;\n}\n\n#dfsDiv .dfsBar.yellowBar > .barProgress {\n    background-color: #ff932f;\n}\n\n#dfsDiv .dfsBar.purpleBar {\n    border-color: #fd7ffc;\n}\n\n#dfsDiv .dfsBar.purpleBar > .barProgress {\n    background-color: #9b48fa;\n}\n\n#dfsDiv .dfsBar.redBar {\n    border-color: #ef494b;\n}\n\n#dfsDiv .dfsBar.redBar > .barProgress {\n    background-color: #db3136;\n}\n\n#dfsDiv .dfsBar.blueBar {\n    border-color: #00ffd8;\n}\n\n#dfsDiv .dfsBar.blueBar > .barProgress {\n    background-color: #00b2ca;\n}\n\n#dfsDiv .dfsBar > .barProgress {\n    position: absolute;\n    right: 0px;\n    top: 0px;\n    height: 100%;\n    z-index: 1;\n}\n\n#dfsDiv .antiPaddingTop {\n    margin-top: -5px;\n}\n\n#dfsOpenClose {\n    width: 5%;\n    overflow: hidden;\n    height: 100%;\n    padding-top: 5px;\n    margin-top: -5px;\n    display: block;\n    position: absolute;\n    text-align: center;\n    color: #FFF;\n    font-size: 1.2em;\n}\n\n#dfsOpenClose:hover {\n    cursor: pointer;\n    background-color: rgba(255,255,255,.20);\n}\n\n#dfsOpenClose:active {\n    background-color: rgba(255,255,255,.10);\n}\n\n#dfsCommonInfo {\n    margin-left: 5%;\n    width: 95%;\n    height: 40px;\n    line-height: 20px;\n}\n\n#dfsCommonInfo p {\n    overflow: hidden;\n    font-size: 0.9em;\n    height: 20px;\n    line-height: 20px;\n    color: #FFF;\n}\n\n#dfsExtraInfo p {\n    color: #FFF;\n    font-size: 0.9em;\n    line-height: 20px;\n}\n\n#dfsDiv .oneFourth {\n    float: left;\n    display: inline-block;\n    width: 25%;\n    height: 100%;\n}\n\n#dfsDiv .oneHalf {\n    float: left;\n    display: inline-block;\n    width: 50%;\n    height: 100%;\n}\n\n#dfsDiv .threeFourths {\n    float: left;\n    display: inline-block;\n    width: 75%;\n    height: 100%;\n}\n\n#dfsExtraInfo {\n    margin-left: 5%;\n    width: 95%;\n    position: relative;\n}\n\n#dfsPicture > img {\n    max-width: 90%;\n    border: solid 1px #000;\n    height: auto;\n    width: auto;\n}\n\n#dfsPassRound {\n    float: right;\n    height: 26px;\n    padding-top: 4px;\n    width: 45px;\n    padding-right: 30px;\n    background-color: #843057;\n    overflow: hidden;\n    font-size: 0.6em;\n    line-height: 12px;\n    padding-left: 5px;\n    display: block;\n    background-image: url('img/dfs/ff-icon.png');\n    background-repeat: no-repeat;\n    background-position-x: 55px;\n    background-position-y: 6px;\n    text-transform: uppercase;\n    text-align: center;\n}\n\n#dfsPassRound:hover {\n    cursor: pointer;\n    background-color: #b34176;\n}\n\n#dfsPassRound:active {\n    background-color: #9f3c6a;\n}\n\n#dfsDiv .addRow {\n    line-height: 30px;\n    display: block;\n    height: 30px;\n    width: 100%;\n    text-indent: 10px;\n    color: #006cff;\n}\n\n#dfsDiv .addRow:hover {\n    cursor: pointer;\n    background-color: #d1f5ea;\n}\n\n#dfsDiv .addRow:active {\n    background-color: #e0f8f1;\n}\n\n#dfsDiv div.marginTop {\n    margin-top: 7px;\n}\n\n#dfsDiv div.marginBottom {\n    margin-bottom: 7px;\n}\n\n#dfsDiv #dfsLastDiv {\n    display: block;\n    clear: both;\n    height: 40px;\n    width: 100px;\n}\n\n#dfsDiv {\n    width: 100%;\n    display: block;\n    font-family: alegreya;\n    padding-bottom: 100px;\n}\n\n#dfsDiv .paddingRight {\n    padding-right: 10px;\n}\n\n#dfsDiv .paddingTop {\n    padding-top: 5px;\n}\n\n#dfsDiv .paddingBottom {\n    padding-bottom: 5px;\n}\n\n#dfsDiv > div {\n    float: left;\n}\n\n#dfsDiv > div.clearLeft {\n    clear: left;\n}\n\n#dfsDiv > div.clearRight {\n    clear: right;\n}\n\n#dfsDiv > div.clearBoth {\n    clear: both;\n}\n\n#dfsDiv div.fullWidth {\n    width: 100%;\n    display: block;\n}\n\n#dfsDiv div.halfWidth {\n    width: 49%;\n    display: inline-block;\n}\n\n#dfsDiv div.thirdWidth {\n    width: 32%;\n    display: inline-block;\n}\n\n#dfsDiv div.thirdWidthComp {\n    width: 34%;\n    display: inline-block;\n}\n\n#dfsDiv div.thirdWidthNoMargin {\n    width: 33%;\n    display: inline-block;\n}\n\n#dfsDiv div.thirdWidthNoMarginComp {\n    width: 34%;\n    display: inline-block;\n}\n\n#dfsDiv div.twoThirdsWidth {\n    width: 67%;\n    display: inline-block;\n}\n\n#dfsDiv .thirdMargin {\n    width: 1%;\n    display: inline-block;\n    height: 1px;\n}\n\n#dfsDiv .halfMargin {\n    width: 2%;\n    display: inline-block;\n}\n\n#atributosTesteSum:before, #periciasSum:before {\n    content: '(';\n}\n#atributosTesteSum:after, #periciasSum:after {\n    content: ')';\n}\n\n#dfsDiv p {\n    margin: 0px;\n    padding: 0px;\n    max-width: 100%;\n    overflow-x: hidden;\n}\n\n#dfsDiv b {\n    color: #ccff32;\n}\n\n#combatStatList .hoverTooltip {\n    display: none;\n    padding-left: 10px;\n    padding-right: 10px;\n    position: absolute;\n    overflow: hidden;\n    height: 30px;\n    line-height: 30px;\n    font-size: 0.8em;\n    left: 0px;\n    top: 100%;\n    background-color: inherit;\n    text-align: center;\n    pointer-events: none;\n    z-index: 2;\n}\n\n#combatStatList > p:hover > .hoverTooltip {\n    display: block;\n}\n\n#combatStatList > p {\n    padding-left: 10px;\n    line-height: 30px;\n    height: 30px;\n    overflow: visible;\n    position: relative;\n}\n\n#combatStatList > p > span.floatRight > span.innerColumn:nth-child(2n), #combatStatList > p > span.floatRight > span.innerColumn.rd {\n    background-color: rgba(44,44,44,.25);\n}\n\n#dfsDiv .headerArea {\n    font-size: 1.2em;\n    font-weight: bold;\n    line-height: 30px;\n    height: 30px;\n    color: #FFF;\n    padding-left: 10px;\n}\n\n#dfsDiv .floatRight {\n    float: right;\n}\n#dfsDiv .floatLeft {\n    float: left;\n}\n\n#dfsDiv .innerColumns {\n    float: right;\n    height: 30px;\n    overflow: hidden;\n}\n\n#dfsDiv .innerColumn {\n    display: inline-block;\n    text-align: center;\n    width: 30px;\n    height: 30px;\n    overflow: hidden;\n}\n\n#dfsDiv .testeStamina .innerColumn {\n    width: auto;\n    margin-right: 5px;\n}\n\n#dfsDiv .innerColumn > img {\n    display: block;\n    vertical-align: middle;\n    width: 30px;\n    height: 30px;\n}\n\n#dfsDiv .combatAM, #dfsDiv .testeFor {\n    color: #6b078d;\n}\n\n#dfsDiv .combatAM:hover, #dfsDiv .testeFor:hover {\n    background-color: #ebd9f1;\n}\n\n#dfsDiv .combatArma, #dfsDiv .testeCon, #dfsDiv .testeStamina {\n    color: #c71c19;\n}\n\n#dfsDiv .combatArma:hover, #dfsDiv .testeCon:hover, #dfsDiv .testeStamina:hover {\n    background-color: #f4bcbb;\n}\n\n#dfsDiv .combatTech, #dfsDiv .testeAgi {\n    color: #007d4c;\n}\n\n#dfsDiv .combatTech:hover, #dfsDiv .testeAgi:hover {\n    background-color: #cefbea;\n}\n\n#dfsDiv .combatEle, #dfsDiv .testeCar {\n    color: #9f4b01;\n}\n\n#dfsDiv .combatEle:hover, #dfsDiv .testeCar:hover {\n    background-color: #fde3b2;\n}\n\n#dfsDiv .combatMag, #dfsDiv .testeSab {\n    color: #1c2a8f;\n}\n\n#dfsDiv .combatMag:hover, #dfsDiv .testeSab:hover {\n    background-color: #d9dcf1;\n}\n\n#dfsDiv .combatLid, #dfsDiv .testeInt, #dfsDiv .testeCura {\n    color: #1f7001;\n}\n\n#dfsDiv .combatLid:hover, #dfsDiv .testeInt:hover, #dfsDiv .testeCura:hover {\n    background-color: #daf3d1;\n}\n\n#dfsDiv hr.tinyHR {\n    margin: 0px;\n    border: none;\n    padding: 0px;\n    border-bottom: #333745 solid 1px;\n}\n\n#dfsDiv .combatRDG, #dfsDiv .testeFdV {\n    color: #2a2a2a;\n}\n\n#dfsDiv .combatRDG:hover, #dfsDiv .testeFdV:hover {\n    background-color: #e3e3e3;\n}\n\n#dfsDiv .testeNA {\n    color: #656565;\n}\n\n#dfsDiv .testeNA:hover {\n    background-color: #c6c6c6;\n}\n\n#dfsDiv .combatSdC {\n    color: #863200;\n}\n\n#dfsDiv .combatSdC:hover {\n    background-color: #feffb7;\n}\n\n#dfsDiv #dfsSdCNivel, #dfsDiv #dfsResistenciaNivel {\n    text-align: center;\n    width: 60px;\n}\n\n#dfsDiv .combatRes {\n    color: #4b018a;\n}\n\n#dfsDiv .combatRes:hover {\n    background-color: #d5c6ff;\n}\n\n#dfsDiv .combatDef {\n    color: #0d7f76;\n}\n\n#dfsDiv .combatDef:hover {\n    background-color: #ccefec;\n}\n\n#dfsDiv .combatAtk {\n    color: #6d032b;\n}\n\n#dfsDiv .combatAtk:hover {\n    background-color: #eeccd5;\n}\n\n#dfsDiv .bgDefense {\n    background-color: #e2e5eb;\n}\n\n#testeLista > p {\n    line-height: 30px;\n    height: 30px;\n    overflow: hidden;\n    padding-left: 10px;\n}\n\n#testeLista > div.equipButton {\n    height: 30px;\n    overflow: hidden;\n}\n\n#testeLista > div.equipButton.toggled {\n    height: 40px;\n    margin-bottom: -10px;\n    background-color: #FFF;\n}\n\n#testeLista > div.equipButton > p {\n    line-height: 12px;\n    font-size: 0.7em;\n    font-weight: bold;\n    padding: 3px;\n    overflow: hidden;\n    text-align: center;\n    text-transform: uppercase;\n}\n\n#testeLista > div.equipButton:hover {\n    cursor: pointer;\n}\n\n#testeLista > div.equipButton.toggled:hover {\n    cursor: default;\n}\n\n#testeLista > div.equipButton.arma.toggled + * + div.equipButton.used:hover {\n    cursor: default;\n}\n\n#testeLista > div.equipButton.armadura {\n    color: #00378a;\n}\n\n#testeLista > div.equipButton.armadura:hover, #testeLista > div.equipButton.armadura.toggled {\n    background-color: #9bf8c4;\n}\n\n#testeLista > div.equipButton.escudo {\n    color: #6809b8;\n}\n\n#testeLista > div.equipButton.escudo:hover, #testeLista > div.equipButton.escudo.toggled {\n    background-color: #c8b3fa;\n}\n\n#dfsDiv .escudoEquipBg {\n    background-color: #c8b3fa;\n    color: #6809b8;\n}\n\n#dfsDiv .escudoEquipBg > *:nth-child(2n) {\n    background-color: #d3c2fb;\n}\n\n#dfsDiv .armaduraEquipBg {\n    background-color: #9bf8c4;\n    color: #00378a;\n}\n\n#dfsDiv .armaduraEquipBg > *:nth-child(2n) {\n    background-color: #aff9d0;\n}\n\n#testeLista > div.equipButton.arma {\n    color: #8a0000;\n}\n\n#testeLista > div.equipButton.arma:hover, #testeLista > div.equipButton.arma.toggled {\n    background-color: #f6ce77;\n}\n\n#testeLista > div.equipButton.used {\n    color: #5d5d5d;\n}\n\n#testeLista > div.equipButton.used:hover, #testeLista > div.equipButton.arma.toggled + * + div.equipButton.used {\n    background-color: #c9c9c9;\n}\n\n\n\n#periciasLista > p, #periciasTD > p {\n    line-height: 30px;\n    height: 30px;\n    padding-left: 10px;\n    overflow: hidden;\n}\n\n#periciasLista .deleteButton, #dfsTecnicas .deleteButton, #dfsInventario .deleteButton {\n    background-image: url('img/dfs/fechar1-icon.png');\n    background-position: center center;\n    background-repeat: no-repeat;\n    width: 30px;\n    margin-left: -10px;\n    height: 30px;\n    display: inline-block;\n    vertical-align: middle;\n}\n\n#dfsInventario .deleteButton {\n    margin: 0px;\n}\n\n#periciasLista .deleteButton:hover, #dfsAnotacoes > p > a.deleteButton:hover, #dfsTecnicas .deleteButton:hover, #dfsInventario .deleteButton:hover {\n    background-image: url('img/dfs/fechar2-icon.png');\n    cursor: pointer;\n}\n\n#periciasLista .deleteButton:active, #dfsAnotacoes > p > a.deleteButton:active, #dfsTecnicas .deleteButton:active, #dfsInventario .deleteButton:active {\n    background-image: url('img/dfs/fechar1-icon.png');\n}\n\n#dfsDiv.character .typedBG {\n    background-color: #333745;\n}\n\n#dfsDiv.nonplayer .typedBG {\n    background-color: #734443;\n}\n\n#dfsDiv .typedHeader {\n    font-size: 1.2em;\n    font-weight: bold;\n}\n\n#dfsDiv.character .typedHeader {\n    color: #00ffea;\n}\n\n#dfsDiv.nonplayer .typedHeader {\n    color: #ffb500;\n}\n\n#dfsDiv .whiteBG {\n    background-color: #FFF;\n}\n\n#dfsDiv .centered {\n    text-align: center;\n}\n\n";
    
    this.$css = $('<style type="text/css" />').html(this.css);
    
    this.$html = $('<div id="sheetDiv" />').html(this.html);
    
    this.mainSheet = new Sheet(this.$html, this, true, null);
    
    this.variableTypes = {
        'text' : window.Variable_Varchar,
        'number' : window.Variable_Number,
        'integer' : window.Variable_Integer,
        'longtext' : window.Variable_Longtext,
        'picture' : window.Variable_Picture,
        'select' : window.Variable_Select
    };
    
    this.emulateBind = function (f, context) {
        return function () {
            f.apply(context, arguments);
        };
    };
    
    this.setValues = function () {
        this.mainSheet.update(this.sheet.values);
        this.mainSheet.update$();
    };
    
    this.beforeProcess = function (sheet, instance, style) {
        // Run Before Process
    };
    
    this.afterProcess = function (sheet, instance, style) {
        // Formulario Alterar MP
        var calcMPF = this.emulateBind(function () {
            var $mpinput = $(this.sheet.$visible.find('#dfsMPForm')[0]);
            var mpform = $mpinput.val();
            if (isNaN(mpform, 10)) {
                return false;
            }
            $mpinput.val('');
            mpform = parseInt(mpform);
            var $motivoInput = $(this.sheet.$visible.find('#dfsMPMotivo')[0]);
            var motivo = $motivoInput.val().trim();
            if (motivo === null || motivo === '') {
                motivo = "Nenhum motivo especificado.";
            }
            $motivoInput.val('');
            
            var oldMP = this.sheet.fields['MPAtual'].getObject();
            var newMP = oldMP + mpform;
            
            this.sheet.fields['MPAtual'].storeValue(newMP);
            
            var log = this.sheet.fields['MPLog'];
            var newHistory = log.getNewRow();
            newHistory.fields['Quantidade'].storeValue(mpform);
            newHistory.fields['Motivo'].storeValue(
                motivo + ' (MP Antigo: ' + oldMP + ' - Novo MP: ' + newMP + ')'
            );
        }, {sheet : sheet}
        );

        sheet.$visible.find('#dfsCalculadoraMP').on('submit', calcMPF);
        
        // Formulario Alterar Exp
        var calcExpF = this.emulateBind(function () {
            var $expinput = $(this.sheet.$visible.find('#dfsExpForm')[0]);
            var expform = $expinput.val();
            if (isNaN(expform , 10)) {
                return false;
            }
            $expinput.val('');
            expform  = parseInt(expform );
            var $motivoInput = $(this.sheet.$visible.find('#dfsExpMotivo')[0]);
            var motivo = $motivoInput.val().trim();
            if (motivo === null || motivo === '') {
                motivo = "Nenhum motivo especificado.";
            }
            $motivoInput.val('');
            
            var oldExp = this.sheet.fields['Exp'].getObject();
            var newExp = oldExp + expform;
            
            this.sheet.fields['Exp'].storeValue(newExp);
            
            var log = this.sheet.fields['ExpLog'];
            var newHistory = log.getNewRow();
            newHistory.fields['Quantidade'].storeValue(expform);
            newHistory.fields['Motivo'].storeValue(
                motivo + ' (Antiga Exp: ' + oldExp + ' - Nova Exp: ' + newExp + ')'
            );
        }, {sheet : sheet}
        );

        sheet.$visible.find('#dfsCalculadoraExp').on('submit', calcExpF);
        
        // Formulario Alterar Exp
        var calcDanoF = this.emulateBind(function (dano) {
            console.log("Calculadora de Dano");
            // Configurar atributos
            var atributos = ['ArtesMarciais', 'Arma', 'Tecnologia', 'Elemento', 'Magia', 'Lideranca'];
            var atributosAtaque = [
                this.sheet.$visible.find('#damageAM')[0].checked,
                this.sheet.$visible.find('#damageAR')[0].checked,
                this.sheet.$visible.find('#damageTC')[0].checked,
                this.sheet.$visible.find('#damageEL')[0].checked,
                this.sheet.$visible.find('#damageMG')[0].checked,
                this.sheet.$visible.find('#damageLD')[0].checked
            ];
            
            // Achar prostyle
            if (dano.indexOf('-') !== -1) {
                dano = dano.split('-');
                atributosAtaque = [false, false, false, false, false, false];
                for (var i = 0; i < dano[0].length; i++) {
                    if (!isNaN(dano[0].charAt(i), 10) && typeof atributos[parseInt(dano[0].charAt(i))]) {
                        atributosAtaque[parseInt(dano[0].charAt(i))] = true;
                    }
                }
                if (dano.length !== 2) {
                    return false;
                }
                dano = dano[1];
            }
            
            
            // Percent e Penetração e consumir stamina
            
            var percent = $(this.sheet.$visible.find('#dfsDanoPercent')[0]).val().trim();
            if (percent === '' || isNaN(percent, 10)) { percent = "100"; }
            percent = (parseInt(percent) / 100);
            
            var penetration = $(this.sheet.$visible.find('#dfsDanoPenetration')[0]).val().trim();
            if (penetration === '' || isNaN(penetration, 10)) { penetration = "0"; }
            penetration =  1 - (parseInt(penetration) / 100);
            if (penetration < 0) {
                penetration = 0;
            } else if (penetration > 1) {
                penetration = 1;
            }
            
            // Achar RDs
            var thisRD;
            var resistencia = parseInt(parseInt($(this.sheet.$visible.find('#dfsSdCNivel')[0]).text().trim()) / 2);
            var RDBasica = (resistencia + this.sheet.fields['GeralRD'].getObject());
            var atributosRD = [-1, -1, -1, -1, -1, -1, RDBasica];
            var atributosArray = [];
            var biggestI = 6;
            for (i = 0; i < atributos.length; i++) {
                if (!atributosAtaque[i]) { continue; }
                atributosArray.push(i);
                thisRD = 0;
                if (this.sheet.fields[atributos[i] + 'Nivel'].getObject() < resistencia) {
                    thisRD += resistencia;
                } else {
                    thisRD += this.sheet.fields[atributos[i] + 'Nivel'].getObject();
                }
                
                thisRD += this.sheet.fields['GeralRD'].getObject();
                thisRD += this.sheet.fields[atributos[i] + 'RD'].getObject();
                
                if (thisRD > atributosRD[biggestI]) {
                    biggestI = i;
                }
                
                if (thisRD < 0) { thisRD = 0; }
                
                atributosRD[i] = thisRD;
            }
            
            // Calcular dano
            var rdUtilizada = 0;
            rdUtilizada = atributosRD[biggestI];
            
            var danoFinal = (dano - (rdUtilizada * penetration));
            var danoFinalInt = Math.round(danoFinal * percent);
            if (danoFinalInt < 1) { danoFinalInt = 1; }
            
            // Aplicar dano
            var oldHP = this.sheet.fields['HPAtual'].getObject();
            var newHP = oldHP - danoFinalInt;
            
            this.sheet.fields['HPAtual'].storeValue(newHP);
            
            // Guardar histórico
            var $motivoInput = $(this.sheet.$visible.find('#dfsDanoMotivo')[0]);
            var motivo = $motivoInput.val().trim();
            if (motivo === null || motivo === '') {
                motivo = "Nenhum motivo especificado.";
            }
            
            // Achar nomes dea tributos do aatque
            atributos = ['Artes Marciais', 'Arma', 'Tecnologia', 'Elemento', 'Magia', 'Liderança', 'Resistência Geral'];
            var names = [];
            for (i = 0; i < atributosAtaque.length; i++) {
                if (atributosAtaque[i]) {
                    names.push(atributos[i]);
                }
            }
            if (names.length === 0) {
                names.push('Sem tipo');
            }
            
            var log = this.sheet.fields['CombatLog'];
            var newRow = log.getNewRow();
            newRow.fields['Quantidade'].storeValue(danoFinalInt);
            newRow.fields['Motivo'].storeValue(motivo);
            newRow.fields['Explicacao'].storeValue(
                "Dano de " + dano + " (" + names.join(', ') + ') recebido. Penetração de ' + ((1 - penetration) * 100).toFixed(0)
                + '%, com multiplicação de dano em ' + (percent * 100).toFixed(0) +'%. ' + atributos[biggestI] + ' (' + rdUtilizada + 
                ', virando ' + (rdUtilizada * penetration).toPrecision(1) + '), '
                + ' escolhida como maior redução de dano relevante para um dano final de ' + danoFinalInt + ' (' + (danoFinal * percent).toFixed(1)
                + ' de ' + danoFinal.toFixed(1)  + ').\nHP Antigo: ' + oldHP + '. Novo HP: ' + newHP + '.'
            );
            return true;
        }, {sheet : sheet}
        );

        var combatF = this.emulateBind(function () {
            console.log("CALCULADORA CALCULADORA CALCULADORA CALCULADORA CALCULADORA CALCULADORA ");
            var dano = $(this.sheet.$visible.find('#dfsDanoForm')[0]).val().trim();
            if (dano === null || dano === '') { return false; }
            dano = dano.toUpperCase();
            
            var clearInputs = function (sheet) {
                if (!sheet.$visible.find('#damageClear')[0].checked) {
                    return false;
                }
                var $calculadora = sheet.$visible.find('#dfsCalculadoraDano');
                $calculadora.find('input[type=text]').val('');
                $calculadora.find('input[type=checkbox]').prop('checked', false);
                $calculadora.find('input[type=radio]').prop('checked', false);
                $calculadora.find('#damageDeal').prop('checked', true);
                $calculadora.find('#damageClear').prop('checked', true);
            };
            
            if (dano.indexOf('H') === -1 && this.sheet.$visible.find('#damageDeal')[0].checked) {
                if (this.calcDanoF(dano)) {
                    // clear if need to
                    clearInputs (this.sheet);
                    return true;
                }
                return false;
            }
            
            
            dano = dano.replace(/H/g, '');
            
            
            var removeStamina = (dano.indexOf('S') !== -1 || this.sheet.$visible.find('#damageHealStamina')[0].checked);
            
            dano = dano.replace(/S/g, '');
            
            if (isNaN(dano, 10)) {
                return false;
            }
            
            dano = parseInt(dano);
            
            var oldHP = this.sheet.fields['HPAtual'].getObject();
            var newHP = oldHP + dano;
            if (newHP > this.sheet.fields['HPMaximo'].getObject()) {
                newHP = this.sheet.fields['HPMaximo'].getObject();
            }
            
            this.sheet.fields['HPAtual'].storeValue(newHP);
            
            if (removeStamina) {
                var oldStamina = this.sheet.fields['StaminaAtual'].getObject();
                var newStamina = oldStamina - 1;
                this.sheet.fields['StaminaAtual'].storeValue(newStamina);
            }
            
            var log = this.sheet.fields['CombatLog'];
            var newRow = log.getNewRow();
            
            var $motivoInput = $(this.sheet.$visible.find('#dfsDanoMotivo')[0]);
            var motivo = $motivoInput.val().trim();
            if (motivo === null || motivo === '') {
                motivo = "Nenhum motivo especificado.";
            }
            
            newRow.fields['Quantidade'].storeValue(dano);
            newRow.fields['Motivo'].storeValue(motivo);
            newRow.fields['Explicacao'].storeValue(
                ((dano > 0) ? 'Cura de ' : 'HP reduzido em ') + dano + ". HP Antigo: " + oldHP + ". Novo HP: " + newHP + '.' +
                (removeStamina ? (' Stamina descontada. Antiga Stamina: ' + oldStamina + '. Stamina atual: ' + newStamina) : '')
            );
    
            clearInputs(this.sheet);
        }, {sheet : sheet, calcDanoF : calcDanoF});

        sheet.$visible.find('#dfsCalculadoraDano').on('submit', combatF);
        
        // Curar Tudo
        
        var healF = this.emulateBind(function () {
            this.sheet.fields['HPAtual'].storeValue(this.sheet.fields['HPMaximo'].getObject());
            this.sheet.fields['MPAtual'].storeValue(this.sheet.fields['MPMaximo'].getObject());
            this.sheet.fields['CombatLog'].update([]);
            this.sheet.fields['MPLog'].update([]);
        }, {sheet:sheet});
        
        var healFAll = this.emulateBind(function () {
            var stamina = parseInt($(this.sheet.$visible.find('#dfsStaminaMaxima')[0]).text());
            this.sheet.fields['StaminaAtual'].storeValue(stamina);
            this.sheet.fields['HPAtual'].storeValue(this.sheet.fields['HPMaximo'].getObject());
            this.sheet.fields['MPAtual'].storeValue(this.sheet.fields['MPMaximo'].getObject());
            this.sheet.fields['CombatLog'].update([]);
            this.sheet.fields['MPLog'].update([]);
        }, {sheet:sheet});
        
        sheet.$visible.find('#dfsHealAll').on('click', healFAll);
        sheet.$visible.find('#dfsHealButton').on('click', healF);
        
        // NPCzar
        sheet.fields['Jogador'].$visible.on('changedVariable', function (e, variable) {
            console.log(variable);
            if (variable.getObject() === 'NPC') {
                variable.style.$html.find('#dfsDiv').removeClass('character').addClass('nonplayer');
            } else {
                variable.style.$html.find('#dfsDiv').removeClass('nonplayer').addClass('character');
            }
        });
        
        sheet.fields['Jogador'].$visible.trigger('changedVariable', [sheet.fields['Jogador']]);
        
        // Mudar tipo de Pericia
        sheet.fields['Pericias'].$visible.on('changedVariable', function (e, variable) {
            /** @type jQuery */ var $parent = variable.parent.$visible;
            var attribute = variable.parent.fields['Attribute'];
            $parent.removeClass("testeFor testeCon testeAgi testeCar testeSab testeInt testeFdV testeNA").
                    addClass("teste" + 
                             (attribute.options[attribute.value] === 'N/A' ? 'NA' : attribute.options[attribute.value])
                            );
        });
        
        for (var i = 0; i < sheet.fields['Pericias'].list.length; i++) {
            sheet.fields['Pericias'].$visible.trigger('changedVariable', [sheet.fields['Pericias'].list[i].fields['Attribute']]);
        }
        
        // Mudar tipo de Pericia
        sheet.fields['Tecnicas'].$visible.on('changedVariable', function (e, variable) {
            /** @type jQuery */ var $parent = variable.parent.$visible;
            var tipo = variable.parent.fields['Tipo'].getObject();
            $parent.removeClass("techEdL techEspecial techPassiva techAtaque").
                    addClass("tech" + 
                             (tipo === 'Estilo de Luta' ? 'EdL' : tipo)
                            );
        });
        
        for (var i = 0; i < sheet.fields['Tecnicas'].list.length; i++) {
            sheet.fields['Tecnicas'].$visible.trigger('changedVariable', [sheet.fields['Tecnicas'].list[i].fields['Tipo']]);
        }
        
        // Contar soma de pericias
        sheet.fields['Pericias'].$visible.on('changedVariable', function (e, variable) {
            var pericias = variable.style.mainSheet.fields['Pericias'];
            var sum = 0;
            
            for (var i = 0; i < pericias.list.length; i++) {
                sum += pericias.list[i].fields['Valor'].getObject();
            }
            
            variable.style.$html.find('#SumPericias').text('(' + sum + ')');
        });
        
        if (sheet.fields['Pericias'].list.length > 0) {
            sheet.fields['Pericias'].$visible.trigger('changedVariable', [sheet.fields['Pericias'].list[0].fields['Attribute']]);
        }
        
        // Contar soma de Vantagens
        sheet.fields['Vantagens'].$visible.on('changedVariable', function (e, variable) {
            var vantagens = variable.style.mainSheet.fields['Vantagens'];
            var sum = 0;
            
            for (var i = 0; i < vantagens.list.length; i++) {
                sum += vantagens.list[i].fields['Pontos'].getObject();
            }
            
            variable.style.$html.find('#VantagensSum').text(sum);
        });
        
        if (sheet.fields['Vantagens'].list.length > 0) {
            sheet.fields['Vantagens'].$visible.trigger('changedVariable', [sheet.fields['Vantagens'].list[0].fields['Pontos']]);
        }
        
        // Contar soma de Desvantagens
        sheet.fields['Desvantagens'].$visible.on('changedVariable', function (e, variable) {
            var desvantagens = variable.style.mainSheet.fields['Desvantagens'];
            var sum = 0;
            
            var pontos = [];
            for (var i = 0; i < desvantagens.list.length; i++) {
                pontos.push(desvantagens.list[i].fields['Pontos'].getObject());
            }
            pontos = pontos.sort();
            
            for (var i = 0; (i < pontos.length) && (i < 4); i++) {
                sum += pontos[pontos.length - (i + 1)];
            }
            
            variable.style.$html.find('#DesvantagensSum').text(sum);
        });
        
        if (sheet.fields['Desvantagens'].list.length > 0) {
            sheet.fields['Desvantagens'].$visible.trigger('changedVariable', [sheet.fields['Desvantagens'].list[0].fields['Pontos']]);
        }
        
        
        // Contar soma de atributos-teste
        var atributosTeste = ['Forca', "Constituicao", "Agilidade", "Carisma", "Sabedoria", "Inteligencia", "ForcaDeVontade"];
        
        for (i = 0; i < atributosTeste.length; i++) {
            sheet.fields[atributosTeste[i]].$visible.on('changedVariable', function (e, variable) {
                var sheet = variable.style.mainSheet;
                var atributosTeste = ['Forca', "Constituicao", "Agilidade", "Carisma", "Sabedoria", "Inteligencia", "ForcaDeVontade"];
                var sum = 0;
                
                for (i = 0; i < atributosTeste.length; i++) {
                    sum += sheet.fields[atributosTeste[i]].getObject();
                }
                
                variable.style.$html.find('#sumAtributosTeste').text('(' + sum + ')');
            });
        }
        
        sheet.fields['Forca'].$visible.trigger('changedVariable', [sheet.fields['Forca']]);
        
        // Contar Exp para proximo nivel de atributos de combate
        var fixCurrentExpBar = function (e, variable) {
            var sheet = variable.parent;
            var atributosCombate = ['ArtesMarciais', 'Arma','Tecnologia',"Elemento",'Magia','Lideranca','Defesa','Ataque'];
            var atributo;
            var sum = 0;
            var expThis;
            
            var expSabedoria = 0;
            for (var i = 0; i < atributosCombate.length; i++) {
                atributo = sheet.fields[atributosCombate[i] + 'Nivel'];
                expThis = parseInt((atributo.getObject() * (5 + (atributo.getObject() * 5))) / 2);
                sum += expThis;
                if (i < 6) {
                    expSabedoria += expThis;
                }
            }
            
            var expAtual = sheet.fields['Exp'].getObject() - sum;
            
            if (expAtual > 0) {
                expSabedoria += expAtual;
            }
            
            expSabedoria = parseFloat(expSabedoria / 2).toFixed(1);
            
            for (var nivelSabedoria = 1; (nivelSabedoria * (5 + (nivelSabedoria * 5)) / 2) <= expSabedoria; nivelSabedoria++) {}
            
            sheet.$visible.find('#dfsSdCNivel').text(--nivelSabedoria);
            
            var expRestante = expSabedoria - (nivelSabedoria * (5 + (nivelSabedoria * 5)) / 2);
            
            sheet.$visible.find('#dfsSdCExp').text(
                ((++nivelSabedoria * 5) - expRestante) + ' Exp para level up (Total: ' + parseInt(expSabedoria) + ')'
            );
    
            sheet.$visible.find('#dfsResistenciaNivel').text(
                parseInt(--nivelSabedoria / 2) + " (" + (nivelSabedoria / 2).toFixed(1) + ')'
            );
    
            sheet.$visible.find('#dfsCura').text(
                parseInt(nivelSabedoria + 2)
            );
    
            sheet.$visible.find('#dfsStaminaMaxima').text(
                parseInt(nivelSabedoria + 2)
            );
            

            sheet.$visible.find('#dfsExpAtual').text(expAtual);
            if (expAtual > 0) {
                sheet.$visible.find('#dfsExpAtualBar').width(
                        ((expAtual / sheet.fields['Exp'].getObject()) * 100) + '%'
                );
            } else {
                sheet.$visible.find('#dfsExpAtualBar').width('0%');
            }
        };
        
        sheet.fields['Exp'].$visible.on('changedVariable', fixCurrentExpBar);
        
        
        var atributosCombate = ['ArtesMarciais', 'Arma','Tecnologia',"Elemento",'Magia','Lideranca','Defesa','Ataque'];
        var atributo;
        for (i = 0; i < atributosCombate.length; i++) {
            atributo = sheet.fields[atributosCombate[i] + 'Nivel'];
            atributo.$visible.on('changedVariable', function (e, variable) {
                var $nextLevel = $(variable.$visible.parent().parent().find('.hoverTooltip')[0]);
                $nextLevel.text(
                    ((variable.getObject() + 1) * 5) + ' Exp para level up (Total: ' +
                    parseInt((variable.getObject() * (5 + (variable.getObject() * 5))) / 2) +
                    ')'
                );
            });
            atributo.$visible.trigger('changedVariable', [atributo]);
            
            
            atributo.$visible.on('changedVariable', fixCurrentExpBar);
        }
        
        // Exp atual será triggered pela de baixo
        
        // Achar Exp Total e level Up
        
        sheet.fields['Exp'].$visible.on('changedVariable', function (e, variable) {
            var sheet = variable.parent;
            sheet.$visible.find('#dfsExpTotal').text(variable.getObject());
            var expTotal = variable.getObject();
            for (var i = 1; 
                    (i * (5 + (i * 5)) * 2)
                    <= expTotal; i++
                ) {}
            var expNext = (i * (5 + (i * 5)) * 2);
            sheet.$visible.find('#dfsLevelupXP').text (expNext);
            if (expTotal > 0) {
                sheet.$visible.find('#dfsExpTotalBar').width(
                       ((expTotal / expNext) * 100) + '%'
                );
            } else {
                sheet.$visible.find('#dfsExpTotalBar').width('0%');
            }
            
            sheet.$visible.find('#NivelAtual').text(i - 1);
        });
        
        sheet.fields['Exp'].$visible.trigger('changedVariable', sheet.fields['Exp']);
        
        // Corrigir barras de HP
        
        var fixHPBar = function (e, variable) {
            var sheet = variable.parent;
            var hpAtual = sheet.fields['HPAtual'].getObject();
            var hpMaximo = sheet.fields['HPMaximo'].getObject();
            sheet.$visible.find('#dfsHPAtual').text(hpAtual);
            sheet.$visible.find('#dfsHPMaximo').text(hpMaximo);
            
            if (hpAtual > 0 && hpMaximo > 0) {
                sheet.$visible.find('#dfsHPBar').width(
                    ((hpAtual / hpMaximo) * 100) + '%'
                );
            } else {
                sheet.$visible.find('#dfsHPBar').width('0%');
            }
        };
        
        sheet.fields['HPAtual'].$visible.on('changedVariable', fixHPBar);
        sheet.fields['HPMaximo'].$visible.on('changedVariable', fixHPBar);
        fixHPBar (null, sheet.fields['HPAtual']);
        
        // Corrigir barras de MP
        
        var fixMPBar = function (e, variable) {
            var sheet = variable.parent;
            var hpAtual = sheet.fields['MPAtual'].getObject();
            var hpMaximo = sheet.fields['MPMaximo'].getObject();
            sheet.$visible.find('#dfsMPAtual').text(hpAtual);
            sheet.$visible.find('#dfsMPMaximo').text(hpMaximo);
            
            if (hpAtual > 0 && hpMaximo > 0) {
                sheet.$visible.find('#dfsMPBar').width(
                    ((hpAtual / hpMaximo) * 100) + '%'
                );
            } else {
                sheet.$visible.find('#dfsMPBar').width('0%');
            }
        };
        
        sheet.fields['MPAtual'].$visible.on('changedVariable', fixMPBar);
        sheet.fields['MPMaximo'].$visible.on('changedVariable', fixMPBar);
        fixMPBar (null, sheet.fields['MPAtual']);
        
        
        // Calcular pesos
        
        var calcularPesos = function (e, variable) {
            var parent = variable.parent;
            if (!parent.isRoot) {
                var sheet = parent.style.mainSheet;
            } else {
                var sheet = parent;
            }
            var bags = sheet.fields["Inventario"];
            var bag;
            var itens;
            var item;
            var k;
            var meuPeso;
            var itemPeso;
            var pesoTotal = 0;
            for (var i = 0; i < bags.list.length; i++) {
                bag = bags.list[i];
                meuPeso = bag.fields['Quantidade'].getObject() * bag.fields['Peso'].getObject();
                
                itens = bag.fields['SubInventario'];
                
                for (k = 0; k < itens.list.length; k++) {
                    item = itens.list[k];
                    itemPeso = item.fields['Quantidade'].getObject() * item.fields['Peso'].getObject();
                    
                    item.$visible.find('.itemPesoTotal').text(itemPeso);
                    meuPeso += itemPeso;
                }
                
                bag.$visible.find('.bagPesoTotal').text(meuPeso);
                pesoTotal += meuPeso;
            }
            sheet.$visible.find('#InventarioAtual').text(pesoTotal);
        };
        
        sheet.fields['Inventario'].$visible.on('changedVariable', calcularPesos);
        if (sheet.fields['Inventario'].list.length > 0) {
            calcularPesos(null, [sheet.fields['Inventario'].list[0]]);
        }
    };
    
    this.process = function () {
        this.beforeProcess(this.mainSheet, this.sheet, this);
        
        this.mainSheet.process();
        this.mainSheet.setDefault();
        
        var $nameField = this.mainSheet.$visible.find('.sheetName');
        if ($nameField.length > 0) {
            this.nameField = new Variable_Name($($nameField[0]), this, 0, this.mainSheet);
            this.nameField.setDefault();
        }
        
        var setChanged = this.emulateBind(
            function () {
                this.style.changed = true;
            }, {style : this}
        );

        this.mainSheet.$visible.on('changedVariable', setChanged);
        this.mainSheet.$visible.on('changedRows', setChanged);
        
        this.afterProcess(this.mainSheet, this.sheet, this);
    };
    
    this.toggleEdit = function () {
        if (!this.sheet.editable) {
            this.editing = false;
        } else {
            this.editing = !this.editing;
        }
        this.mainSheet.update$();
    };
    
    this.getField = function (id) {
        if (typeof this.mainSheet.fields[id] === 'undefined') {
            return null;
        }
        return this.mainSheet.fields[id];
    };
    
    this.get$ = function () {
        return this.$html;
    };
    
    this.get$css = function () {
        return this.$css;
    };
    
    this.getObject = function () {
        return this.mainSheet.getObject();
    };
    
    this.seppuku = function () {
        this.$html.remove();
        this.$html = null;
        this.$css.remove();
        this.$css = null;
        this.mainSheet.seppuku();
        this.mainSheet = null;
    };
}