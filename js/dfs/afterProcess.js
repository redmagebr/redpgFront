// CALCULADORA DE DANO
var checkboxes = {
    ArtesMarciais : $(sheet.$visible.find('#damageAM')[0]),
    Arma : $(sheet.$visible.find('#damageAR')[0]),
    Tecnologia : $(sheet.$visible.find('#damageTC')[0]),
    Elemento : $(sheet.$visible.find('#damageEL')[0]),
    Magia : $(sheet.$visible.find('#damageMG')[0]),
    Lideranca : $(sheet.$visible.find('#damageLD')[0]),
    Damagedeal : $(sheet.$visible.find('#damageDeal')[0]),
    Heal : $(sheet.$visible.find('#damageHeal')[0]),
    Stamina : $(sheet.$visible.find("#damageHealStamina")[0]),
    Clear : $(sheet.$visible.find("#damageClear")[0]),
    Save : $(sheet.$visible.find('#dfsSaveWhenDone')[0])
};

var input = {
    Percent : $(sheet.$visible.find('#dfsDanoPercent')[0]),
    Penetration : $(sheet.$visible.find('#dfsDanoPenetration')[0]),
    Dano : $(sheet.$visible.find("#dfsDanoForm")[0]),
    Motivo : $(sheet.$visible.find('#dfsDanoMotivo')[0])
};

var element = {
    Sabedoria : $(sheet.$visible.find('#dfsSdCNivel')[0])
};

// Calculadora de dano!
var calcDanoF = this.emulateBind(function (dano, objetivo) {
    console.log("Calculadora de Dano");
    // Verifica atributos em pro style
    var atributos = ['ArtesMarciais', 'Arma', 'Tecnologia', 'Elemento', 'Magia', 'Lideranca'];
    if (dano.indexOf('-') !== -1) {
        dano = dano.split('-'); if (dano.length !== 2) { alert("Código inválido."); return; }
        for (var i = 0; i < atributos.length; i++) {
            objetivo[atributos[i]] = dano[0].indexOf(i) !== -1;
        }
        dano = dano[1];
    }
    
    // Essa é a calculadora de dano! sempre dano!
    if (isNaN(dano, 10)) { alert("Dano digitado não é um número."); return; }
    dano = parseInt(dano);
    
    // Porcentagem de dano
    var percent = this.input['Percent'].val().trim();
    if (percent === '' || isNaN(percent, 10)) {
        percent = 1;
    } else {
        percent = parseInt(percent) / 100;
        if (percent < 0) {
            percent = 0;
        }
    }
    
    // Penetração
    var penetration = this.input['Penetration'].val().trim();
    // Invaĺido?
    if (penetration === '' || isNaN(penetration, 10)) { penetration = 0; }
    // Transformar em porcentagem
    penetration =  1 - (parseInt(penetration) / 100);
    // Máximo e Mínimo
    if (penetration < 0) {
        penetration = 0;
    } else if (penetration > 1) {
        penetration = 1;
    }
    
    // AtributosAtaque
    var atributosAtaque = [];
    
    for (var i = 0; i < atributos.length; i++) {
        atributosAtaque.push(objetivo[atributos[i]]);
    }
    
    // Achar RDs
    var thisRD;
    var resistencia = parseInt(parseInt(this.element['Sabedoria'].text().trim()) / 2);
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
    var rdUtilizada = atributosRD[biggestI];
    
    // Dano Final
    var danoFinal = (dano - (rdUtilizada * penetration));
    var danoFinalInt = Math.round(danoFinal * percent);
    if (danoFinalInt < 1) { danoFinalInt = 1; }
    
    // Aplicar dano
    var oldHP = this.sheet.fields['HPAtual'].getObject();
    var newHP = oldHP - danoFinalInt;

    this.sheet.fields['HPAtual'].storeValue(newHP);
    
    // Log
    var motivo = this.input['Motivo'].val().trim();
    if (motivo === '') motivo = "Nenhum motivo especificado.";
    
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
}, {
    element : element, input : input,
    sheet : sheet
});

// Calculadora de HP
var calcHp = this.emulateBind(function (dano, stamina) {
    if (isNaN(dano, 10)) { alert("Quantidade de HP a alterar digitada não é um número."); return; }
    dano = parseInt(dano);
    
    var hpField = this.sheet.getField('HPAtual');
    var oldHp = hpField.getObject();
    var maxHpField = this.sheet.getField('HPMaximo');
    
    var newHp = hpField.getObject() + dano;
    if (newHp > maxHpField.getObject()) {
        newHp = maxHpField.getObject();
    }
    
    hpField.storeValue(newHp);
    
    // Consumir Stamina
    if (stamina) {
        var staminaObj = this.sheet.getField('StaminaAtual');
        var oldStamina = staminaObj.getObject();
        staminaObj.storeValue(staminaObj.getObject() - 1);
        var newStamina = staminaObj.getObject();
    }
    
    // Log
    var log = this.sheet.fields['CombatLog'];
    var newRow = log.getNewRow();
    var motivo = this.input['Motivo'].val().trim();
    if (motivo === null || motivo === '') {
        motivo = "Nenhum motivo especificado.";
    }

    newRow.fields['Quantidade'].storeValue(dano);
    newRow.fields['Motivo'].storeValue(motivo);
    newRow.fields['Explicacao'].storeValue(
        ((dano > 0) ? 'Cura de ' : 'HP reduzido em ') + dano + ". HP Antigo: " + oldHp + ". Novo HP: " + newHp + '.' +
        (stamina ? (' Stamina descontada. Antiga Stamina: ' + oldStamina + '. Stamina atual: ' + newStamina) : '')
    );
}, {
    sheet : sheet, input : input
});

// Calculadora mae!
var calculadora = this.emulateBind(function () {
    // Pega valores das checkboxes
    var objetivo = {};
    for (var id in this.checkboxes) {
        objetivo[id] = this.checkboxes[id][0].checked;
    }
    
    // Cura? Dano?
    var cleanObj = function (obj) {
        obj.Damagedeal = false;
        obj.Heal = false;
        obj.HealStamina = false;
    };
    var dano = this.input['Dano'].val();
    if (dano.indexOf('D') !== -1) {
        cleanObj(objetivo);
        objetivo.Damagedeal = true;
    } else if (dano.indexOf('H') !== -1) {
        cleanObj(objetivo);
        objetivo.Heal = true;
    }
    if (dano.indexOf('S') !== -1) {
        objetivo.Stamina = true;
    }
    
    dano = dano.replace("D", '').replace("H", '').replace("S", '');
    
    // Guardar HP da ficha
    var oldHp = this.sheet.getField('HPAtual').getObject();
    
    // Causar dano ou curar?
    if (objetivo.Damagedeal) {
        this.calcDanoF(dano, objetivo);
    } else {
        this.calcHp(dano, objetivo.Stamina);
    }
    
    // Imprime mudança de HP no chat
    var Diferenca = this.sheet.getField('HPAtual').getObject() - oldHp;
    if (Diferenca !== 0 && window.app.ui.chat.cc.room !== null) {
        var message = new Message();
        message.setOrigin(window.app.loginapp.user.id);
        message.roomid = window.app.ui.chat.cc.room.id;
        message.module = "sheetdm";
        message.setSpecial("sheetname", this.sheet.style.sheet.name);
        
        if (Diferenca > 0) {
            Diferenca = '+' + Diferenca;
        }

        message.setSpecial("amount", Diferenca);

        window.app.chatapp.printAndSend(message, true);
    }
    
    // Salvar?
    if (this.checkboxes['Save'][0].checked) {
        window.app.ui.sheetui.controller.saveSheet();
    }
    
    // Limpar?
    if (this.checkboxes['Clear'][0].checked) {
        for (var id in this.checkboxes) {
            this.checkboxes[id][0].checked = false;
        }
        this.checkboxes['Damagedeal'][0].checked = true;
        this.checkboxes['Clear'][0].checked = true;
        for (var id in this.input) {
            this.input[id].val('');
        }
    }
}, {
    checkboxes: checkboxes, element : element, input : input,
    sheet : sheet, calcDanoF : calcDanoF, calcHp : calcHp
});

sheet.$visible.find('#dfsCalculadoraDano').on('submit', calculadora);


// Passar rodada
        sheet.$visible.find('#dfsPassRound').on('click', this.emulateBind(function() {
            var buffs = this.sheet.fields['Buffs'].list;
            var buff;
            for (var i = (buffs.length - 1); i >= 0; i--) {
                buff = buffs[i];
                buff.fields['Duration'].storeValue(buff.fields['Duration'].getObject() - 1);
                if (buff.fields['Duration'].getObject() <= 0) {
                    this.sheet.fields['Buffs'].deleteRow(buff);
                }
            }
        }, {sheet : sheet}));
        
        // Colocar persona
        sheet.$visible.find('#dfsNome').on('click', this.emulateBind(function () {
            if (this.style.editing) {
                return;
            }
            window.app.ui.chat.pc.addPersona(this.style.sheet.name, this.sheet.fields['Avatar'].getObject(), false, false);
        }, {sheet : sheet, style : style}));
        
        
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
    
            // Salvar?
            if (this.checkboxes['Save'][0].checked) {
                window.app.ui.sheetui.controller.saveSheet();
            }
        }, {sheet : sheet, checkboxes : checkboxes}
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
            // Salvar?
            if (this.checkboxes['Save'][0].checked) {
                window.app.ui.sheetui.controller.saveSheet();
            }
        }, {sheet : sheet, checkboxes : checkboxes}
        );

        sheet.$visible.find('#dfsCalculadoraExp').on('submit', calcExpF);
        
        // Curar Tudo
        
        var healF = this.emulateBind(function () {
            this.sheet.fields['HPAtual'].storeValue(this.sheet.fields['HPMaximo'].getObject());
            this.sheet.fields['MPAtual'].storeValue(this.sheet.fields['MPMaximo'].getObject());
            this.sheet.fields['CombatLog'].update([]);
            this.sheet.fields['MPLog'].update([]);
            // Salvar?
            if (this.checkboxes['Save'][0].checked) {
                window.app.ui.sheetui.controller.saveSheet();
            }
            
        }, {sheet:sheet, checkboxes : checkboxes});
        
        var healFAll = this.emulateBind(function () {
            var stamina = parseInt($(this.sheet.$visible.find('#dfsStaminaMaxima')[0]).text());
            this.sheet.fields['StaminaAtual'].storeValue(stamina);
            this.sheet.fields['HPAtual'].storeValue(this.sheet.fields['HPMaximo'].getObject());
            this.sheet.fields['MPAtual'].storeValue(this.sheet.fields['MPMaximo'].getObject());
            this.sheet.fields['CombatLog'].update([]);
            this.sheet.fields['MPLog'].update([]);
            // Salvar?
            if (this.checkboxes['Save'][0].checked) {
                window.app.ui.sheetui.controller.saveSheet();
            }
        }, {sheet:sheet, checkboxes : checkboxes});
        
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
        sheet.fields['Tecnicas'].$visible.on('changedVariable updateAddons', function (e, variable) {
            var parent = variable.parent;
            if (typeof parent.fields['Tipo'] === 'undefined') { return false; }
            /** @type jQuery */ var $parent = parent.$visible;
            var tipo = parent.fields['Tipo'].getOption();
            $parent.removeClass("techEdL techEspecial techPassiva techAtaque").
                    addClass("tech" + 
                             (tipo === 'Estilo de Luta' ? 'EdL' : tipo)
                            );
            var addonTipo = {
                "Estilo de Luta" : 'estilo',
                'Especial' : 'especial',
                'Passiva' : 'passiva',
                'Ataque' : 'ataque'
            };
            var addonVar;
            for (var i = 0; i < parent.fields['Addons'].list.length; i++) {
                addonVar = parent.fields['Addons'].list[i];
                if (parent.style.editing) {
                    window.app.ui.addonui.unAddonize(addonVar.$visible);
                } else {
                    window.app.ui.addonui.addonize(addonVar.$visible, addonTipo[tipo] + '-' + addonVar.fields['Nome'].getObject());
                }
            }
        });
        
        for (var i = 0; i < sheet.fields['Tecnicas'].list.length; i++) {
            sheet.fields['Tecnicas'].$visible.trigger('changedVariable', [sheet.fields['Tecnicas'].list[i].fields['Tipo']]);
        }
        
        sheet.$visible.on('loaded editing viewing', window.app.emulateBind(function () {
            for (var i = 0; i < this.sheet.fields['Tecnicas'].list.length; i++) {
                this.sheet.fields['Tecnicas'].$visible.trigger('updateAddons', [this.sheet.fields['Tecnicas'].list[i].fields['Tipo']]);
            }
        }, {sheet : sheet}));
        
        sheet.fields['Vantagens'].$visible.on('updateAddons', function (e, parent) {
            var addonVar;
            for (var i = 0; i < parent.list.length; i++) {
                addonVar = parent.list[i];
                if (parent.style.editing) {
                    window.app.ui.addonui.unAddonize(addonVar.$visible);
                } else {
                    window.app.ui.addonui.turnVantagem(addonVar.$visible, addonVar.fields['Nome'].getObject());
                }
            }
        });
        
        sheet.fields['Desvantagens'].$visible.on('updateAddons', function (e, parent) {
            var addonVar;
            for (var i = 0; i < parent.list.length; i++) {
                addonVar = parent.list[i];
                if (parent.style.editing) {
                    window.app.ui.addonui.unAddonize(addonVar.$visible);
                } else {
                    window.app.ui.addonui.turnDesvantagem(addonVar.$visible, addonVar.fields['Nome'].getObject());
                }
            }
        });
        
        sheet.$visible.on('loaded editing viewing', window.app.emulateBind(function () {
            if (sheet.fields['Vantagens'].list.length > 0) {
                sheet.fields['Vantagens'].$visible.trigger('updateAddons', [sheet.fields['Vantagens']]);
            }
            if (sheet.fields['Desvantagens'].list.length > 0) {
                sheet.fields['Desvantagens'].$visible.trigger('updateAddons', [sheet.fields['Desvantagens']]);
            }
        }, {sheet : sheet}));
        
        // Contar soma de pericias
        sheet.fields['Pericias'].$visible.on('changedVariable changedRows', function (e, variable) {
            var pericias = variable.style.mainSheet.fields['Pericias'];
            var sum = 0;
            
            for (var i = 0; i < pericias.list.length; i++) {
                sum += pericias.list[i].fields['Valor'].getObject();
            }
            
            variable.style.$html.find('#SumPericias').text('(' + sum + ')');
        });
        
        if (sheet.fields['Pericias'].list.length > 0) {
            sheet.fields['Pericias'].$visible.trigger('changedVariable', [sheet.fields['Pericias'].list[0].fields['Attribute']]);
        } else { 
            sheet.$visible.find('#SumPericias').text('(0)');
        }
        
        // Contar soma de Vantagens
        sheet.fields['Vantagens'].$visible.on('changedVariable changedRows', function (e, variable) {
            var vantagens = variable.style.mainSheet.fields['Vantagens'];
            var sum = 0;
            
            for (var i = 0; i < vantagens.list.length; i++) {
                sum += vantagens.list[i].fields['Pontos'].getObject();
            }
            
            variable.style.$html.find('#VantagensSum').text(sum);
        });
        
        if (sheet.fields['Vantagens'].list.length > 0) {
            sheet.fields['Vantagens'].$visible.trigger('changedVariable', [sheet.fields['Vantagens'].list[0].fields['Pontos']]);
        } else {
            sheet.$visible.find('#VantagensSum').text(0);
        }
        
        // Contar soma de Desvantagens
        sheet.fields['Desvantagens'].$visible.on('changedVariable changedRows', function (e, variable) {
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
        } else {
            sheet.$visible.find('#DesvantagensSum').text(0);
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
            var sheet = variable.style.mainSheet;
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
        
        sheet.fields['Inventario'].$visible.on('changedVariable changedRows', calcularPesos);
        if (sheet.fields['Inventario'].list.length > 0) {
            calcularPesos(null, [sheet.fields['Inventario'].list[0]]);
        } else {
            sheet.$visible.find('#InventarioAtual').text(0);
        }