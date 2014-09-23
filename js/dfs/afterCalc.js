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
    sheet : sheet
});

// Calculadora mãe!
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
        message.setSpecial("sheetname", thissheet.style.sheet.name);
        
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