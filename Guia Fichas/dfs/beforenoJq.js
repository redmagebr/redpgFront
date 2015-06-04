// Roll iniciativa
this.rollIniciativa = function () {
    var inic = Math.floor(this.nivelAtual + (this.sheet.getField("Agilidade").getObject() / 2));
    var mod = this.sheet.getField("iniciativaBonus").getObject();
    
    this.rollDice(10, inic + mod, "1d10 + Agilidade/2 + Nível + " + mod + " (Iniciativa)");
};

// Rolagens Especiais
this.rollEsp = function (sheet) {
    if (window.app.chatapp.room === null) return;
    var valores = sheet.getField("Bonuses").list;
    var result = [0, 0];
    var nomes = [];
    for (var i = 0; i < valores.length; i++) {
        var valor = this.getValorOf(valores[i].getField("Valor").getObject());
        nomes.push(valores[i].getField("Valor").getObject());
        result[0] += valor[0];
        result[1] += valor[1];
    }
    //this.rollDice = function (faces, mod, diceMessage, rolls, extra)
    var faces = result[1] > 1 ? 10 : 6;
    var message = "1d" + faces + " + " + sheet.getField("Nome").getObject() + " (" + nomes.join(" + ") + ")";
    message = message.replace(new RegExp("[+][ ][-]", 'g'), '-');
    this.rollDice(faces, result[0], message);
};

this.getValorOf = function (nome, loop) {
    var half = false;
    if (nome.indexOf("/2") !== -1) {
        nome = nome.replace("/2", "");
        half = true;
    }
    
    var result;
    
    if (!isNaN(nome, 10)) {
        result = parseInt(nome);
        if (half) result = Math.floor(result/2);
        return [result, 0];
    }
    
    var atributos = ["Forca", "Constituicao", "Agilidade", "Carisma", "Sabedoria", "Inteligencia", "ForcaDeVontade"];
    var atributosBonitos = ["FORÇA", "CONSTITUIÇÃO", "AGILIDADE", "CARISMA", "SABEDORIA", "INTELIGÊNCIA", "FORÇA DE VONTADE"];
    var atributoFixo = atributosBonitos.indexOf(nome.toUpperCase());
    if (atributoFixo !== -1) {
        result = [this.sheet.getField(atributos[atributoFixo]).getObject(), 1];
        if (half) result[0] = Math.floor(result[0]/2);
        return result;
    }
    
    var pericias = this.sheet.getField("Pericias").list;
    for (var i = 0; i < pericias.length; i++) {
        if (pericias[i].getField("Name").getObject().toUpperCase() === nome.toUpperCase()) {
            result = [pericias[i].getField("Valor").getObject(), 1];
            if (half) result[0] = Math.floor(result[0]/2);
            return result;
        }
    }
    
    
    if (loop === undefined) {
        loop = [];
    }
    
    if (loop.indexOf(nome) !== -1) return [-9999, 2];
    
    loop.push(nome);
    var rolagens = this.sheet.getField("rollEspRoll").list;
    for (var i = 0; i < rolagens.length; i++) {
        if (rolagens[i].getField("Nome").getObject().toUpperCase() === nome.toUpperCase()) {
            var attrCount;
            var found;
            var sum = 0;
            var atributos = 0;
            for (attrCount = 0; attrCount < rolagens[i].getField('Bonuses').list.length; attrCount++) {
                found = this.getValorOf(rolagens[i].getField('Bonuses').list[attrCount].getField("Valor").getObject(), loop);
                sum += found[0];
                atributos += found[1];
            }
            if (half) sum = Math.floor(sum/2);
            return [sum, atributos];
        }
    }
    
    return null;
};

// Debuffs
this.applyDebuff = function (sheet) {
    if (window.app.chatapp.room === null || window.app.ui.chat.tracker.target === -1) { return; }
    
    var targetId = window.app.ui.chat.tracker.myStuff.ordered[window.app.ui.chat.tracker.target].id;
    var applierId = sheet.style.sheet.id;
    
    var message = new Message();
    message.module = "buff";
    message.setMessage(sheet.getField("Nome").getObject());
    message.destination = window.app.chatapp.room.getStorytellers();
    message.setSpecial("target", targetId);
    message.setSpecial("applier", applierId);
    message.setSpecial("eot", sheet.getField("Tipo").getObject());
    window.app.chatapp.fixPrintAndSend(message, true);
};

// Atributos Automaticos - Hide atributos
this.hideAutomaticos = function (sheet) {
    if (sheet.getField("Automatic").getObject()) {
        this.$visible.find(".notAutomaticOnly").hide();
    } else {
        this.$visible.find(".notAutomaticOnly").unhide();
    }
};

// Dano automatico
window.dfsDice = this.emulateBind(function (message) {
    this.style.dfsDice(message);
}, {style : this});

this.dfsDice = function (message) {
    var extra = message.getSpecial("extra", null);

    window.app.ui.sheetui.controller.openSheet(extra.id);

    this.element['dfsFerramentas'].show(); 
    this.element['dfsFerramentasOpenClose'].text('(-)');

    var atributos = ['ArtesMarciais', 'Arma', 'Tecnologia', 'Elemento', 'Magia', 'Lideranca'];
    for (var i = 0; i < atributos.length; i++) {
        this.calcCheckbox[atributos[i]][0].checked = extra.damageType.indexOf(i) !== -1;
    }
    
    if (extra.type === "Cura") {
        this.calcCheckbox['Damagedeal'][0].checked = false;
        this.calcCheckbox["Heal"][0].checked = true;
        var motivo = "Cura realizada por " + message.getSpecial("persona", "Desconhecido") + ".";
    } else {
        var motivo = "Ataque realizado por " + message.getSpecial("persona", "Desconhecido") + ".";
        this.calcCheckbox["Heal"][0].checked = false;
        this.calcCheckbox['Damagedeal'][0].checked = true;
    }
    
    this.calcInput['Percent'].val(extra.perc);
    this.calcInput['Penetration'].val(extra.pen);
    this.calcInput['Motivo'].val(motivo);
    
    $('#sheetWindow').finish();
    this.calcInput['Dano'].val(message.getSpecial("sum", 0)).focus();
	this.element['dfsCalculadoraDano'].find("input[type=submit]").trigger("click");
};

// Tecnicas
this.rollTecnica = function (sheet) {
    if (window.app.ui.chat.cc.room === null) return;
    var types = [];
    //Artes Marciais;Arma;Tecnologia;Elemento;Magia;Liderança;Sabedoria;Defesa;Ataque
    var atributos = ['Artes Marciais', 'Arma', 'Tecnologia', 'Elemento', 
                     'Magia', 'Liderança', "Sabedoria de Combate", "Defesa", 
                     "Ataque"];
    var rolls = sheet.getField("Rolls").getObject();
    var faces = sheet.getField("Faces").getObject();
    var atr1 = sheet.getField("Attribute1").getObject();
    if (atr1 >= 0 && atr1 <= 5) types.push(atr1);
    var atr2 = sheet.getField("Attribute2").getObject();
    if (atr2 >= 0 && atr1 <= 5) types.push(atr2);
    
    if (atr1 === 6 || atr2 === 6) {
        for (var i = 0; i < 6; i++) {
            if (this.getTechAtrib(i) > 0 && types.indexOf(i) === -1) {
                types.push(i);
            }
        }
    }
    
    if (!sheet.getField("Automatic").getObject()) {
        types = [];
        for (var i = 0; i < 6; i++) {
            if (sheet.getField("Atr" + i).getObject()) {
                types.push(i);
            }
        }
    }
    
    rolls = parseInt(rolls);
    faces = parseInt(faces);
    var mod1 = this.getTechAtrib(atr1);
    var mod2 = this.getTechAtrib(atr2);
    
    var mod2H = sheet.getField("Attribute2half").getObject();
    
    if (mod2H) {
        mod2 = mod2 / 2;
    }
    
    var mod3 = sheet.getField("Mod").getObject();
    var rollType = sheet.getField("RollType").getOption(); // 0 & 1
    var message = rolls + "d" + faces + " + ";
    var modmessages = [];
    if (mod1 > 0) {
        modmessages.push(atributos[atr1] + " (" + mod1 + ")");
    }
    if (mod2 > 0) {
        modmessages.push(atributos[atr2] + (mod2H? "/2" : "") + " (" + mod2 + ")");
    }
    if (mod3 > 0) {
        modmessages.push(mod3);
    }
    
    var bonus = sheet.style.mainSheet.getField('Bonus' + rollType);
    if (bonus !== null && bonus.getObject() !== 0) {
        mod3 += bonus.getObject();
        modmessages.push(bonus.getObject() + " (Bônus)");
    }
    
    if (modmessages.length > 0) {
        message = message + modmessages.join(" + ");
    } else {
        message = message + "0";
    }
    message = message.replace(new RegExp("[+][ ][-]", 'g'), '-');
    message = message + " = " + rollType;
	
	var modTotal = (mod1 + mod2 + mod3);
	
	if (sheet.getField("Normalizar").getObject()) {
		modTotal = modTotal/2;
		
		message = message + " | Modificador Normalizado";
	}
	
	modTotal = Math.floor(modTotal);
    
    var extra;
    
    if (window.app.ui.chat.tracker.target !== -1 && (rollType === "Dano" || rollType === "Cura")) {
        var info = window.app.ui.chat.tracker.myStuff.ordered[window.app.ui.chat.tracker.target];
        extra = {
            target : window.app.ui.chat.tracker.target,
            name : info.name,
            id : info.id,
            type : rollType,
            damageType : types,
			perc : sheet.getField("DanoPerc").getObject(),
			pen : sheet.getField("Penetracao").getObject()
        };
    }
    
    this.rollDice(faces, Math.floor(modTotal), message, rolls, extra);
};

this.getTechAtrib = function (atrib) {
    if (atrib >= 0 && atrib <= 5) {
        var atributoNome = this.getAtributo(atrib);
	return this.sheet.fields[atributoNome + 'Nivel'].getObject();
    } else if (atrib === 6) {
        return this.sabedoriaDeCombate;
    } else if (atrib === 7) {
	return this.sheet.fields['DefesaNivel'].getObject();
    } else if (atrib === 8) {
	return this.sheet.fields['AtaqueNivel'].getObject();
    }
    return 0;
};

// ROlling
this.rollPericia = function (sheet) {
    if (window.app.ui.chat.cc.room === null) return;
	var atrib = parseInt(sheet.getField("Attribute").getObject());
	var atributos = ["Força", "Constituição", "Agilidade", "Carisma", "Sabedoria", "Inteligência", "Força de Vontade"];
	var nome = sheet.getField("Name").getObject();
	var valor = sheet.getField("Valor").getObject();
	var mod;
	var message;
	if (atrib < 0 || atrib > 6) {
		mod = valor;
		message = "1d10 + " + nome + " (" + valor + ")";
	} else {
		var valorAtributo = this.getAtributoTeste(atrib);
		mod = valor + valorAtributo;
		message = "1d10 + " + nome + " (" + valor + ") + " + atributos[atrib] + " (" + valorAtributo + ")";
	}
	
	this.rollDice(10, mod, message);
};

this.rollHeal = function () {
	if (window.app.ui.chat.cc.room === null) return;
	var sab = Math.floor(this.sabedoriaDeCombate);
	var valor = sab + 2;
	this.rollDice(null, valor, "Cura - Sabedoria de Combate (" + sab + ") + 2");
};

this.rollAtrib = function (atrib) {
	if (window.app.ui.chat.cc.room === null) return;
	var atributos = ["Força", "Constituição", "Agilidade", "Carisma", "Sabedoria", "Inteligência", "Força de Vontade"];
	if (atrib < 0 || atrib >= atributos.length) { alert("Atributo inválido"); return 0; }
	var valor = this.getAtributoTeste(atrib); 
	this.rollDice(6, valor, "1d6 + " + atributos[atrib] + " (" + valor + ")");
};

this.getAtributoTeste = function (atrib) {
	var atributos = ["Forca", "Constituicao", "Agilidade", "Carisma", "Sabedoria", "Inteligencia", "ForcaDeVontade"];
	return this.sheet.getField(atributos[atrib]).getObject();
};

this.rollDice = function (faces, mod, diceMessage, rolls, extra) {
    if (typeof rolls === 'undefined') rolls = 1;
	var message = new Message();
	message.setMessage(diceMessage);
	message.setOrigin(window.app.loginapp.user.id);
	message.roomid = window.app.ui.chat.cc.room.id;
	message.module = 'dice';
	var rolling = [];
	if (faces !== null && rolls > 0) {
            for (var i = 0; i < rolls; i++) {
                rolling.push(faces);
            }
	}
        message.setSpecial('dice', rolling);
	message.setSpecial('mod', mod);
	message.setSpecial('persona', this.nameField.getObject());
        
        if (typeof extra !== 'undefined') {
            message.setSpecial("extra", extra);
        }
	
	var mod = window.app.ui.chat.mc.getModule('dice');
	var $html = mod.get$(message);
	
	message.set$($html);
	
	window.app.ui.language.applyLanguageOn($html);
	
	window.app.chatapp.printAndSend(message, true);
	
	
	window.app.ui.chat.dc.dicese.currentTime = 0;
	window.app.ui.chat.dc.dicese.volume = 0.3;
	window.app.ui.chat.dc.dicese.play();
};

// Old Stuff

this.calcCheckbox = {
    ArtesMarciais : $(this.$visible.find('#damageAM')[0]),
    Arma : $(this.$visible.find('#damageAR')[0]),
    Tecnologia : $(this.$visible.find('#damageTC')[0]),
    Elemento : $(this.$visible.find('#damageEL')[0]),
    Magia : $(this.$visible.find('#damageMG')[0]),
    Lideranca : $(this.$visible.find('#damageLD')[0]),
    Damagedeal : $(this.$visible.find('#damageDeal')[0]),
    Heal : $(this.$visible.find('#damageHeal')[0]),
    Stamina : $(this.$visible.find("#damageHealStamina")[0]),
    Clear : $(this.$visible.find("#damageClear")[0]),
    Save : $(this.$visible.find('#dfsSaveWhenDone')[0]),
    Announce : $(this.$visible.find('#dfsAnnounceWhenDone')[0])
};

this.calcInput = {
    Percent : $(this.$visible.find('#dfsDanoPercent')[0]),
    Penetration : $(this.$visible.find('#dfsDanoPenetration')[0]),
    Dano : $(this.$visible.find("#dfsDanoForm")[0]),
    Motivo : $(this.$visible.find('#dfsDanoMotivo')[0])
};

this.element = {
    dfsFerramentas : $(this.$visible.find('#dfsFerramentas')[0]),
    dfsFerramentasOpenClose : $(this.$visible.find('#dfsFerramentasOpenClose')[0]),
    Sabedoria : $(this.$visible.find('#dfsSdCNivel')[0]),
    dfsIniciativaValue : $(this.$visible.find('#dfsIniciativaValue')[0]),
	InventarioAtual : $(this.$visible.find("#InventarioAtual")[0]),
	dfsExpTotal : $(this.$visible.find("#dfsExpTotal")[0]),
	dfsLevelupXP : $(this.$visible.find("#dfsLevelupXP")[0]),
	dfsExpTotalBar : $(this.$visible.find("#dfsExpTotalBar")[0]),
	dfsExpAtual : $(this.$visible.find("#dfsExpAtual")[0]),
	dfsExpAtualBar : $(this.$visible.find("#dfsExpAtualBar")[0]),
	NivelAtual : $(this.$visible.find("#NivelAtual")[0]),
	dfsSdCNivel : $(this.$visible.find("#dfsSdCNivel")[0]),
	dfsSdCExp : $(this.$visible.find("#dfsSdCExp")[0]),
	dfsResistenciaNivel : $(this.$visible.find("#dfsResistenciaNivel")[0]),
	dfsCura : $(this.$visible.find("#dfsCura")[0]),
	dfsStaminaMaxima : $(this.$visible.find("#dfsStaminaMaxima")[0]),
	sumAtributosTeste : $(this.$visible.find("#sumAtributosTeste")[0]),
	DesvantagensSum : $(this.$visible.find("#DesvantagensSum")[0]),
	VantagensSum : $(this.$visible.find("#VantagensSum")[0]),
	SumPericias : $(this.$visible.find("#SumPericias")[0]),
	dfsDiv : $(this.$visible.find("#dfsDiv")[0]),
	dfsMPForm : $(this.$visible.find("#dfsMPForm")[0]),
	dfsMPMotivo : $(this.$visible.find("#dfsMPMotivo")[0]),
	dfsExpForm : $(this.$visible.find("#dfsExpForm")[0]),
	dfsExpMotivo : $(this.$visible.find("#dfsExpMotivo")[0]),
	dfsCalculadoraDano : $(this.$visible.find("#dfsCalculadoraDano")[0]),
	dfsCalculadoraMP : $(this.$visible.find("#dfsCalculadoraMP")[0]),
	dfsCalculadoraExp : $(this.$visible.find("#dfsCalculadoraExp")[0])
};

// Funções

this.getExp = function (nivel) {
	return parseInt((nivel * (5 + (nivel * 5))) / 2);
};

this.getRD = function (atributo) {
	var atributoNome = this.getAtributo(atributo);
	var rd = this.sheet.fields[atributoNome + 'Nivel'].getObject();
	
	// Atributo é maior que a resistência?
	var resistencia = this.getResistencia();
	if (resistencia > rd) rd = resistencia;
	
	// Achar RD específica
	rd += this.sheet.fields[atributoNome + 'RD'].getObject();
	
	// Somar RD Geral
	rd += this.sheet.fields['GeralRD'].getObject();
	
	// Nome Bonitos
	var atributos = ['Artes Marciais', 'Arma', 'Tecnologia', 'Elemento', 'Magia', 'Liderança'];
	
	return {"Nome":atributos[atributo], "RD":rd};
};

this.getAtributo = function (atributo) {
	var atributos = ['ArtesMarciais', 'Arma', 'Tecnologia', 'Elemento', 'Magia', 'Lideranca'];
	if (atributo < 0 || atributo >= atributos.length) {
		alert("The system attempted to get Damage Reduction for an unknown combat attribute.");
		return "Arma";
	}
	return atributos[atributo];
};

this.getResistencia = function () {
	return this.sabedoriaDeCombate / 2;
};

this.getRDBase = function () {
	return {
		Nome : "Sem Tipo",
		RD : this.getResistencia() + this.sheet.fields['GeralRD'].getObject()
	};
};