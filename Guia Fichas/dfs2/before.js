this.atributosAsTheyAre = ['ARTESMARCIAIS', 'ARMA', 'TECNOLOGIA', 'ELEMENTO', 'MAGIA', 'LIDERANCA']
this.atributos = ['Artes Marciais', 'Arma', 'Tecnologia', 'Elemento', 'Magia', 'Liderança', 'Sem Tipo'];

this.hasSheet = function (id) {
	return (window.app.sheetdb.getSheet(id) !== null && window.app.sheetdb.getSheet(id).values !== null);
};

this.complainOfSheet = function (target) {
	var $span = $('<span />').text(target.id + " - " + target.name);
	var $p = $('<p class="chatSistema" />').append('Ficha "').append($span).append('" não está aberta, então não posso aplicar o dano.');
	window.app.ui.chat.appendToMessages($p);
};


this.applyExp = function (exp, reason) {
	var expF = this.sheet.getField("Exp");
	var expAntiga = expF.getValue();
	var expNova = expAntiga + exp;
	expF.storeValue(expNova);
	
	var logM = exp + " exp concedida. Experiência era " + expAntiga + " e agora é " + expNova + ".\nMotivo: " + reason + ".";
	
	var log = this.sheet.getField("ExpLog").addRow();
	log.getField("Diff").storeValue(exp);
	log.getField("Expl").storeValue(logM);
	
	if (this.inputs['dfsCalcSave'].checked) {
		window.app.ui.sheetui.controller.saveSheet()
	}
	
	if (this.inputs['dfsCalcAnnounce'].checked) {
		var message = new Message();
		message.module = "sheetdm";
		message.setSpecial('type', 'Exp');
		message.setSpecial('sheetname', this.sheetInstance.name);
		message.setSpecial('amount', exp);
		message.setSpecial("log", logM);
		
		window.app.chatapp.fixPrintAndSend(message, true);
	}
};

this.removeHP = function (amount, reason) {
	var hpF = this.sheet.getField("HPAtual");
	var hpAntigo = hpF.getValue();
	var hpNovo = hpAntigo - amount;
	hpF.storeValue(hpNovo);
	var logM = "HP Reduzido em " + amount + ", indo de " + hpAntigo + " para " + hpNovo + ".";
	if (reason !== undefined) {
		logM += "\nMotivo: " + reason + ".";
	}
	
	var log = this.sheet.getField("HPLog").addRow();
	log.getField("Diff").storeValue(-amount);
	log.getField("Expl").storeValue(logM);
	
	if (this.inputs['dfsCalcSave'].checked) {
		window.app.ui.sheetui.controller.saveSheet()
	}
	
	if (this.inputs['dfsCalcAnnounce'].checked) {
		var message = new Message();
		message.module = "sheetdm";
		message.setSpecial('type', 'HP');
		message.setSpecial('sheetname', this.sheetInstance.name);
		message.setSpecial('amount', -amount);
		message.setSpecial("log", logM);
		
		window.app.chatapp.fixPrintAndSend(message, true);
	}
};

this.removeMP = function (amount, reason) {
	var mpF = this.sheet.getField("MPAtual");
	var mpAntigo = mpF.getValue();
	var mpNovo = mpAntigo - amount;
	mpF.storeValue(mpNovo);
	var logM = "MP Reduzido em " + amount + ", indo de " + mpAntigo + " para " + mpNovo + ".";
	if (reason !== undefined) {
		logM += "\nMotivo: " + reason + ".";
	}
	
	var log = this.sheet.getField("MPLog").addRow();
	log.getField("Diff").storeValue(-amount);
	log.getField("Expl").storeValue(logM);
	
	if (this.inputs['dfsCalcSave'].checked) {
		window.app.ui.sheetui.controller.saveSheet()
	}
	
	if (this.inputs['dfsCalcAnnounce'].checked) {
		var message = new Message();
		message.module = "sheetdm";
		message.setSpecial('type', 'MP');
		message.setSpecial('sheetname', this.sheetInstance.name);
		message.setSpecial('amount', -amount);
		message.setSpecial("log", logM);
		
		window.app.chatapp.fixPrintAndSend(message, true);
	}
};

this.removeStamina = function (amount) {
	var stamina = this.sheet.getField("StaminaAtual");
	stamina.storeValue(stamina.getValue() - 1);
	
	if (this.inputs['dfsCalcSave'].checked) {
		window.app.ui.sheetui.controller.saveSheet()
	}
};

/**
 * applyHeal
 * Cura a ficha
 */
this.applyHeal = function (amount, useOwnStamina, spendStamina) {
	var logM = "Cura de " + amount;
	if (useOwnStamina) {
		var bonusHeal = this.sheet.getField("Cura").getValue();
		amount += bonusHeal;
		logM += " somado à minha cura de " + bonusHeal + " para um total de " + amount;
	}
	logM += ".\n";

	var hpAF = this.sheet.getField("HPAtual");
	var hpMF = this.sheet.getField("HPMaximo");
	
	var oldHP = hpAF.getValue();
	var newHP = oldHP + amount;
	
	if (newHP > hpMF.getValue()) {
		newHP = hpMF.getValue();
	}
	
	logM += "HP de " + this.sheetInstance.name + " era " + oldHP + " e agora é " + newHP + ".";
	
	hpAF.storeValue(newHP);
	
	if (spendStamina) {
		logM += "\nUm ponto de Stamina foi gasto por essa cura. ";
		var stamina = this.sheet.getField("StaminaAtual");
		var oldStamina = stamina.getValue();
		stamina.storeValue(oldStamina - 1);
		logM += "Stamina era " + oldStamina + " e agora é " + (oldStamina - 1) + ".";
	}
	
	var log = this.sheet.getField("HPLog").addRow();
	log.getField("Diff").storeValue(amount);
	log.getField("Expl").storeValue(logM);
	
	if (this.inputs['dfsCalcSave'].checked) {
		window.app.ui.sheetui.controller.saveSheet()
	}
	if (this.inputs['dfsCalcAnnounce'].checked) {
		var message = new Message();
		message.module = "sheetdm";
		message.setSpecial('type', 'HP');
		message.setSpecial('sheetname', this.sheetInstance.name);
		message.setSpecial('amount', (amount > 0 ? "+" + amount : amount));
		message.setSpecial("log", logM);
		
		window.app.chatapp.fixPrintAndSend(message, true);
	}
};

/**
 * applyDamage (diceResult, atributos, perc, pent, nosave)
 * Aplica dano a essa ficha.
 * diceResult = numero
 * atributos = array de Atributosastheyare
 * perc, pent = numeros
 * nosave = opcional boolean
 */
this.applyDamage = function (diceResult, atributos, perc, pent, nosave) {
	nosave = nosave === undefined ? false : nosave;

	var logM = "Dano ["
	atributosCute = [];
	for (var i = 0; i < atributos.length; i++) {
		atributosCute.push(this.getAtribCuteName(atributos[i]));
	}
	logM += atributosCute.join(", ") + "]: " + diceResult + " com multiplicação de ";
	
	// Get Percentage
	perc = perc / 100;
	if (perc < 0) perc = 0;
	
	
	
	// Get Penetration
	if (pent < 0) pent = 0;
	if (pent > 100) pent = 100;
	pent = 1 - (pent / 100);
	
	// Log It
	logM += (perc * 100) + "%, penetrando " + (100 - (pent * 100)) + "% das defesas.\n";
	
	/**
	 * Find RDS
	 */
	this.rds = [];
	for (var i = 0; i < atributos.length; i++) {
		this.rds.push({
			id : atributos[i],
			nome : atributosCute[i],
			rd : this.getRD(atributos[i])
		});
	}
	
	// No Type RD
	this.rds.push({
		id : "SEM TIPO",
		nome : "Sem Tipo",
		rd : this.getRDGeral()
	});
	
	// Order from highest to smallest
	this.rds.sort(function(a,b) {
		return b.rd - a.rd;
	});
	
	// Log It
	logM += "Maior RD relevante: " + this.rds[0].nome + ", com RD de " + (+ this.rds[0].rd.toFixed(2));
	
	var rdFinal = this.rds[0].rd * pent;
	
	logM += ". RD Final: " + (+rdFinal.toFixed(2)) + " (" + (pent * 100) + "% de " + (+ this.rds[0].rd.toFixed(2)) + ").\n";
	
	var danoPosRD = diceResult - rdFinal;
	var danoRecebido = danoPosRD * perc;
	if (danoRecebido < 1) {
		danoFinal = 1;
	} else {
		danoFinal = Math.round(danoRecebido);
	}
	
	logM += "Dano Recebido: " + (perc * 100) + "% de (" + diceResult + " - " + (+rdFinal.toFixed(2)) + ") = " + (+danoRecebido.toFixed(2)) + ", finalizado como " + danoFinal + ".\n";
	
	var hpF = this.sheet.getField('HPAtual');
	var hpAntigo  = this.sheet.getField('HPAtual').getValue();
	var novoHp = hpAntigo - danoFinal;
	var diff = novoHp - hpAntigo;
	
	logM += "O HP de " + this.sheetInstance.name + " era " + hpAntigo + " e agora é " + novoHp + " (" + diff + " HP).";
	
	hpF.storeValue(novoHp);
	
	var log = this.sheet.getField("HPLog").addRow();
	log.getField("Diff").storeValue(diff);
	log.getField("Expl").storeValue(logM);
	
	if (!nosave && this.inputs['dfsCalcSave'].checked) {
		window.app.ui.sheetui.controller.saveSheet()
	}
	if (this.inputs['dfsCalcAnnounce'].checked) {
		var message = new Message();
		message.module = "sheetdm";
		message.setSpecial('type', 'HP');
		message.setSpecial('sheetname', this.sheetInstance.name);
		message.setSpecial('amount', diff);
		message.setSpecial("log", logM);
		
		window.app.chatapp.fixPrintAndSend(message, true);
	}
};

/**
 * Automatizar
 * Esses botões são utilizados apenas para EFEITOS e CUSTOS, pelo menos por enquanto
 */
this.automate = function (button) {
	var id = button.visible.id;
	if (id === "dfsCalcApplyDamage" || id === "dfsCalcApplyDamageStamina") {
		var atributos = this.inputs['dfsCalcAtributos'].value;
		var truAtributos = [];
		for (var i = 0; i < atributos.length; i++) {
			var idx = parseInt(atributos.charAt(i));
			if (idx >= 0 && idx < this.atributosAsTheyAre.length) {
				truAtributos.push(this.atributosAsTheyAre[idx]);
			}
		}
		for (var i = 0; i < this.atributosAsTheyAre.length; i++) {
			var atrib = this.atributosAsTheyAre[i];
			if (truAtributos.indexOf(atrib) !== -1) continue;
			if (this.inputs["dfsCalc" + atrib].checked) truAtributos.push(atrib);
		}
		var dano = parseInt(this.inputs['dfsCalcDano'].value);
		var perc = parseInt(this.inputs['dfsCalcDanoPerc'].value);
		var pent = parseInt(this.inputs['dfsCalcDanoPent'].value);
		if (isNaN(dano, 10)) return;
		if (isNaN(perc, 10)) {
			perc = 100;
		}
		if (isNaN(pent, 10)) {
			pent = 0;
		}
		if (id === 'dfsCalcApplyDamageStamina') {
			var stamina = this.sheet.getField("StaminaAtual");
			stamina.storeValue(stamina.getValue() - 1);
		}
		this.applyDamage(dano, truAtributos, perc, pent);
	} else if (id === "dfsCalcApplyDamageAsHeal") {
		var dano = parseInt(this.inputs['dfsCalcDano'].value);
		if (isNaN(dano, 10)) return;
		this.applyHeal(dano, false, false);
	} else if (id === "dfsCalcHealAll" || id === "dfsCalcHealNoStam") {
		this.sheet.getField("HPAtual").storeValue(this.sheet.getField("HPMaximo").getValue());
		this.sheet.getField("MPAtual").storeValue(this.sheet.getField("MPMaximo").getValue());
		this.sheet.getField("HPLog").storeValue([]);
		this.sheet.getField("MPLog").storeValue([]);
		if (id !== "dfsCalcHealNoStam") {
			this.sheet.getField("StaminaAtual").storeValue(this.sheet.getField("StaminaMax").getValue());
		}
		if (this.inputs['dfsCalcSave'].checked) {
			window.app.ui.sheetui.controller.saveSheet()
		}
	} else if (id === "dfsCalcApplyExp" || id === 'dfsCalcApplyExpToAll') {
		var exp = parseInt(this.inputs['dfsCalcExp'].value);
		var reason = this.inputs['dfsCalcExpReason'].value;
		if (isNaN(exp, 10)) return;
		
		if (id !== "dfsCalcApplyExpToAll") {
			this.applyExp(exp, reason);
			return;
		}
		
		var targets = window.app.ui.chat.tracker.getTarget();
		var complained = false;
		for (var i = 0; i < targets.length; i++) {
			if (!this.hasSheet(targets[i].id)) {
				this.complainOfSheet(targets[i]);
				complained = true;
			}
		}
		if (complained) return;
		
		for (var i = 0; i < targets.length; i++) {
			var sheet = window.app.sheetdb.getSheet(targets[i].id);
			if (sheet.system !== this.id) continue;
			window.app.ui.sheetui.controller.openSheet(targets[i].id);
			this.applyExp(exp, reason);
		}
	} else if (button.visible.dataset.type === 'Custo') {
		if (!this.sheetInstance.editable) {
			// can't do this
			return;
		}
		var tipo = button.parent.getField("Tipo").getValue();
		var amount = button.parent.getField("Custo").getValue();
		var tech = button.parent.parent.parent.getField("Nome").getValue();
		
		// MP;HP;Stamina
		if (tipo === "MP") {
			this.removeMP(amount, tech);
		} else if (tipo === "HP") {
			this.removeHP(amount, tech);
		} else if (tipo === "Stamina") {
			this.removeStamina(amount);
		}
	} else if (button.visible.dataset.type === 'Efeito') {
		var eot = button.parent.getField("Tipo").getValue();
		if (eot === "Fim do meu turno") {
			eot = 1;
		} else {
			eot = 0;
		}
		
		var nome = button.parent.getField("Efeito").getValue();
		
		var targets = window.app.ui.chat.tracker.getTarget();
		for (var i = 0; i < targets.length; i++) {
			var message = new Message();
		    message.module = "buff";
		    message.setMessage(nome);
		    message.destination = window.app.chatapp.room.getStorytellers();
		    message.setSpecial("target", targets[i].id);
		    message.setSpecial("applier", this.sheetInstance.id);
		    message.setSpecial("eot", eot);
		    window.app.chatapp.fixPrintAndSend(message, true);
		}
	}
};

/**
 * this.getAtribCuteName(atributoAsItIs)
 * Retorna o nome do atributo de uma forma mais bonita.
 */

this.getAtribCuteName = function (atributoAsItIs) {
	var idx = this.atributosAsTheyAre.indexOf(atributoAsItIs);
	if (idx === -1) {
		return "Sem Tipo";
	} else {
		return this.atributos[idx];
	}
};


/**
 * getRD (atributo String)
 * Retorna o valor de RD total para algum atributo.
 * Atributos escrito latinizados e em maiuscúlo.
 */
this.getRD = function (atributo) {
	var resistencia = this.sheet.getValueFor('Resistencia')
	var rdgeral = this.sheet.getValueFor('GeralRD');
	var atributonivel = this.sheet.getValueFor(atributo + "NIVEL");
	var rdatributo = this.sheet.getValueFor(atributo + "RD");

	var rdbonus = this.sheet.getValueFor(atributo + "RDBONUS");
	rdbonus = isNaN(rdbonus, 10) ? 0 : rdbonus;
	var rdgbonus = this.sheet.getValueFor("RDGERALRDBONUS");
	rdgbonus = isNaN(rdgbonus, 10) ? 0 : rdgbonus;
	
	atributonivel = atributonivel > resistencia ? atributonivel : resistencia;
	
	return (atributonivel + rdgeral + rdatributo + rdbonus + rdgbonus);
};

/**
 * getRDGeral ()
 * Retorna o valor de RD para danos Sem Tipo
 */
this.getRDGeral = function () {
	var resistencia = this.sheet.getField('Resistencia').getValue();
	var rdgeral = this.sheet.getField('GeralRD').getValue();
	var rdgbonus = this.sheet.getValueFor("RDGERALRDBONUS");
	rdgbonus = isNaN(rdgbonus, 10) ? 0 : rdgbonus;
	return (resistencia + rdgeral + rdgbonus);
};

/**
 * Raça, Arquétipo, Desvantagens e Vantagens:
 * Adicionar Opções aos elementos para funcionar automaticamente.
 */
this.$visible.find("#dfsRaca").attr('data-options', window.racas.join(';')).attr("data-default", window.racas.indexOf("Humano"));
this.$visible.find("#dfsArquetipo").attr('data-options', window.arquetipos.join(';')).attr("data-default", window.arquetipos.indexOf("Guerreiro"));

var vantagens = [];
for (var i = 0; i < window.vantagensArray.length; i++) {
	vantagem = window.vantagensArray[i];
	vantagens.push(vantagem.nome);
}

this.$visible.find("#dfsVantagensList").find(".nameField").attr("data-options", vantagens.join(";"));

var desvantagens = [];
for (var i = 0; i < window.desvantagensArray.length; i++) {
	desvantagem = window.desvantagensArray[i];
	desvantagens.push(desvantagem.nome);
}

this.$visible.find("#dfsDesvantagensList").find(".nameField").attr("data-options", desvantagens.join(";"));


/**
 * Inputs para rolagens de dados
 * Anotar eles para não ser necessário fazer uma busca depois.
 */
this.inputs = {};

var findInputs = ["dfsBonusDano", "dfsBonusEsquiva", "dfsBonusAcerto", "dfsBonusCura", "dfsBonusOutro", "dfsNormalizarDano",
    /* Ferramentas */
    "dfsCalcAtributos",
    "dfsCalcDano",
    "dfsCalcDanoPerc",
    "dfsCalcDanoPent",
    "dfsCalcARTESMARCIAIS",
    "dfsCalcARMA",
    "dfsCalcTECNOLOGIA",
    "dfsCalcELEMENTO",
    "dfsCalcMAGIA",
    "dfsCalcLIDERANCA",
    "dfsCalcExp",
    "dfsCalcExpReason",
    "dfsCalcSave",
    "dfsCalcAnnounce",
    "dfsFerramentasHeader",
    "dfsFerramentas",
    "dfsFerramentasButton"
];

for (var i = 0; i < findInputs.length; i++) {
	this.inputs[findInputs[i]] = this.$visible.find("#" + findInputs[i])[0];
}

/**
 * *****************************************************
 * Botão para abrir a caixa de informações do personagem
 * *****************************************************
 */
var $infoButton = this.$visible.find('#dfsInformationTableExtraButton');
var $infoDiv = this.$visible.find('#dfsInformationTableExtra');

$infoButton[0].addEventListener('click', {
	style : this,
	$this : $infoButton,
	$obj : $infoDiv,
	handleEvent : function () {
		this.$obj.finish();
		if (this.$obj[0].style.display !== 'none') {
			this.$this.removeClass('toggled');
		} else {
			this.$this.addClass('toggled');
		}
		this.$obj.slideToggle(250);
		if (this.style.editing) this.style.sheet.resizeBoxes();
	}
});


/**
 * prepareDice (diceInfo, button)
 * Função chamada quando algum botão para rolagem de dados é pressionado.
 * diceInfo e button são passados como referência.
 */
this.prepareDice = function (diceInfo, button) {
	if (diceInfo.extra === 'GetTipo') {
		diceInfo.extra = button.parent.getField("Tipo").getValue();
	}
	
	if (diceInfo.extra === 'Pericia') {
		diceInfo.extra = "Outro";
		var atributos = ['Forca', 'Constituicao', 'Agilidade', 'Carisma', 'Sabedoria', 'Inteligencia', 'ForcaDeVontade', 'NA'];
		var atributo = button.parent.getField("Attribute").getObject();
		atributo = atributos[atributo]
		
		if (atributo !== "NA") {
			diceInfo.mod += this.sheet.getField(atributo).getValue();
			diceInfo.message = "1d10 + " + button.parent.getField('Name').getValue() + " + " + atributo;
		} else {
			diceInfo.message = "1d10 + " + button.parent.getField('Name').getValue()
		}
	}
	
	var preNormalizado = false;
	if (diceInfo.extra === 'Dano Normalizado') {
		diceInfo.extra = 'Dano';
		preNormalizado = true;
	}
	
	if (this.inputs['dfsBonus' + diceInfo.extra] !== undefined) {
		var bonus = parseInt(this.inputs['dfsBonus' + diceInfo.extra].value);
		if (bonus !== 0) {
			diceInfo.mod += bonus;
			diceInfo.message += (bonus > 0 ? " + " : " ") + bonus;
		}
	}
	
	// Técnicas
	if (diceInfo.extra === 'DanoTech') {
		diceInfo.extra = 'Dano';
		
		if (button.parent.getField("Cura").getValue()) {
			diceInfo.extra = "Cura";
			diceInfo.special.ConsomeStaminaAlvo = button.parent.getField("ConsomeStaminaAlvo").getValue();
			diceInfo.special.SumStaminaAlvo = button.parent.getField("SumStaminaAlvo").getValue();
		}
		
		preNormalizado = button.parent.getField("PreNormalizado").getValue();
		diceInfo.special.porcentagem = button.parent.getField("Porcentagem").getValue();
		diceInfo.special.penetracao = button.parent.getField("Penetracao").getValue();
	}
	
	if (diceInfo.extra === 'Dano') {
		if (this.inputs['dfsNormalizarDano'].checked && !preNormalizado) {
			diceInfo.message += ", normalizado " + (+(diceInfo.mod.toFixed(2))) + " -> " + (+((diceInfo.mod/2).toFixed(2)));
			diceInfo.mod = diceInfo.mod / 2;
		} else if (preNormalizado) {
			diceInfo.message += ", pré-normalizado";
		}

		diceInfo.special.porcentagem = diceInfo.special.porcentagem === undefined ? 100 : diceInfo.special.porcentagem;
		diceInfo.special.penetracao = diceInfo.special.penetracao === undefined ? 0 : diceInfo.special.penetracao;
		
		diceInfo.special.atributos = [];
		var danoRow = button.parent;
		if (danoRow.getField("AutoAttr") === null || danoRow.getField("AutoAttr").getValue()) {
			var danoMod = danoRow.getField(button.modTarget);
			var scope = danoMod.getScope();
			for (var key in scope) {
				var keyF = key.toUpperCase();
				if (this.atributosAsTheyAre.indexOf(keyF) !== -1 && diceInfo.special.atributos.indexOf(keyF) === -1) {
					diceInfo.special.atributos.push(keyF);
				} else if (keyF === 'SABEDORIADECOMBATE') {
					for (var i = 0; i < this.atributosAsTheyAre.length; i++) {
						var atributo = this.atributosAsTheyAre[i];
						if (this.sheet.getValueFor(atributo) > 0 && diceInfo.special.atributos.indexOf(atributo) === -1) {
							diceInfo.special.atributos.push(atributo);
						} 
					}
				}
			}
		} else {
			for (var i = 0; i < this.atributosAsTheyAre.length; i++) {
				var atributo = this.atributosAsTheyAre[i];
				if (danoRow.getField(atributo).getValue()) {
					diceInfo.special.atributos.push(atributo);
				}
			}
		}
		
		diceInfo.getTargets = true;
		diceInfo.special.tipo = 'Dano';
		this.registerDiceAutomation(diceInfo);
	} else if (diceInfo.extra === 'Cura') {
		diceInfo.getTargets = true;
		diceInfo.special.tipo = 'Cura';
		this.registerDiceAutomation(diceInfo);
	}
};


/**
 * Registrar Dice Listener para poder interceptar dados rolados no chat.
 * Exige que a função interceptDice seja criada.
 */
window.app.ui.chat.dc.registerDiceListener(this, {
	style : this,
	handleEvent : function (message, $message) {
		this.style.interceptDice(message, $message);
	}
});

/**
 * interceptDice (message, $message)
 * Intercepta uma rolagem de dado e cria a automatização dela.
 */
this.interceptDice = function (message, $message) {
	if (message.getSpecial('tipo', null) !== 'Dano'
		&& message.getSpecial('tipo', null) !== 'Cura') return;
	var tipo = message.getSpecial('tipo', null);
	
	var diceResults = message.getSpecial('rolls', []);
	if (diceResults.length > 0) {
		diceResults = diceResults.reduce(function(a, b) { return a + b });
	} else {
		diceResults = 0;
	}
	diceResults += message.getSpecial('mod', 0);
	
	var perc = message.getSpecial("porcentagem", 100);
	var pent = message.getSpecial('penetracao', 0);
	var atributos = message.getSpecial('atributos', []);
	
	//diceInfo.special.ConsomeStaminaAlvo = button.parent.getField("ConsomeStaminaAlvo").getValue();
	//diceInfo.special.SumStaminaAlvo = button.parent.getField("SumStaminaAlvo").getValue();

	var ConsomeStaminaAlvo = message.getSpecial("ConsomeStaminaAlvo", false);
	var SumStaminaAlvo = message.getSpecial("SumStaminaAlvo", false);
	
	var target = message.getSpecial('target', null);
	if (target === null) return;
	
	var sheet = window.app.sheetdb.getSheet(target.id);
	if (sheet !== null) {
		if (!sheet.editable || sheet.system !== this.id) return;
	} else if (!window.app.chatapp.room.getMe().isStoryteller()) {
		return;
	}
	
	
	var clickObj = {
		style : this,
		tipo: tipo,
		ConsomeStaminaAlvo: ConsomeStaminaAlvo,
		SumStaminaAlvo : SumStaminaAlvo,
		diceResult : diceResults,
		perc : perc,
		pent : pent,
		atributos : atributos,
		target : target,
		handleEvent : function () {
			if (!this.style.hasSheet(this.target.id)) {
				this.style.complainOfSheet(this.target);
				return;
			}
			if (window.app.sheetdb.getSheet(this.target.id).system !== this.style.id) return;
			window.app.ui.sheetui.controller.openSheet(this.target.id);
			if (this.tipo === "Dano") {
				this.style.applyDamage(this.diceResult, this.atributos, this.perc, this.pent);
			} else {
				this.style.applyHeal (this.diceResult, this.SumStaminaAlvo, this.ConsomeStaminaAlvo)
			}
		}
	};
	
	var $a = $('<a class="textLink" />').text(' (Aplicar) ');
	$a[0].addEventListener("click", clickObj);
	
	$message.find(".reason").append($a);
};