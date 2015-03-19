// Rolar iniciativa
sheet.$visible.find("#DFSIniciativaButton").on('click', this.emulateBind(function () {
	this.style.rollIniciativa();
}, {style : this}));

// Rolagens Especiais
var bindREsp = function (e, sheet) {
    sheet.$visible.find('.diceButton').on('click', 
        sheet.style.emulateBind(function() {
            this.sheet.style.rollEsp(this.sheet);
        }, {sheet : sheet})
    );
};

var resp = this.mainSheet.getField('rollEspRoll');
resp.$visible.on('newRow', bindREsp);

for (var i = 0; i < resp.list.length; i++) {
    bindREsp(null, resp.list[i]);
}

// Aplicar buffs/debuffs
var bindBuffs = function (e, sheet) {
    sheet.$visible.find('.diceButton').on('click', 
        sheet.style.emulateBind(function() {
            this.sheet.style.applyDebuff(this.sheet);
        }, {sheet : sheet})
    );
};

var efeitos = this.mainSheet.getField('Debuffs');
efeitos.$visible.on('newRow', bindBuffs);

for (var i = 0; i < efeitos.list.length; i++) {
    bindBuffs(null, efeitos.list[i]);
}


// Rolagens automatico
var bindRolagemAtributosAutomaticos = function (e, sheet) {
    sheet.getField('Automatic').$visible.on("changedVariable", function (e, variable) {
        variable.style.hideAutomaticos(variable.parent);
    });
    sheet.style.hideAutomaticos(sheet);
};

// Rolar Técnicas
var bindRolagem = function (e, sheet) {
    sheet.$visible.find('.diceButton').on('click', 
        sheet.style.emulateBind(function() {
            this.sheet.style.rollTecnica(this.sheet);
        }, {sheet : sheet})
    );
};

var rolagens = this.mainSheet.getField('Rolagens');
rolagens.$visible.on('newRow', bindRolagem);
rolagens.$visible.on("newRow", bindRolagemAtributosAutomaticos);

for (var i = 0; i < rolagens.list.length; i++) {
    bindRolagem(null, rolagens.list[i]);
    bindRolagemAtributosAutomaticos(null, rolagens.list[i]);
}

// // Rolar Perícias
// this.$visible.trigger('newRow', [newRow]);
// newRow are Sheet elements
var bindPericia = function (e, sheet) {
	sheet.$visible.find('.diceButton').on('click', 
		sheet.style.emulateBind(function() {
			this.sheet.style.rollPericia(this.sheet);
		}, {sheet : sheet})
	);
};

var pericias = this.mainSheet.getField('Pericias');
pericias.$visible.on('newRow', bindPericia);

for (var i = 0; i < pericias.list.length; i++) {
	bindPericia(null, pericias.list[i]);
}




// Rolar atributos-teste
var rollDice = function () {
	this.style.rollAtrib(this.stat);
};

var $testeLista = $(sheet.$visible.find("#testeLista")[0]);
var atributos = ["For", "Con", "Agi", "Car", "Sab", "Int", "FdV"];
for (var i = 0; i < atributos.length; i++) {
	$($testeLista.find(".teste" + atributos[i] + " > .diceButton")[0]).on("click", this.emulateBind(rollDice, {style : this, stat : i}))
}

sheet.$visible.find("#DFShealDiceButton").on('click', this.emulateBind(function () {
	this.style.rollHeal();
}, {style : this}));

// Sort tecnicas
this.sortTecnicas = function () {
	var newTechs = this.mainSheet.fields['Tecnicas'].getObject();
	newTechs.sort(function (a,b) {
		if (a.Tipo !== b.Tipo) {
			return a.Tipo - b.Tipo;
		}
		if (a.Nome.toUpperCase() < b.Nome.toUpperCase()) {
			return -1;
		} else if (b.Nome.toUpperCase() < a.Nome.toUpperCase()) {
			return 1;
		}
		return 0;
	});
	this.mainSheet.fields['Tecnicas'].update(newTechs);
};

$(sheet.$visible.find("#dfsTecnicasSort")[0]).on('click', this.emulateBind(function () {
	this.style.sortTecnicas();
}, {style : this}));

// Sort perícias
this.sortPericias = function () {
	var newList = this.mainSheet.fields['Pericias'].getObject();
	newList.sort(function (a,b) {
		if (a.Attribute !== b.Attribute) {
			return a.Attribute - b.Attribute;
		}
		if (a.Name.toUpperCase() < b.Name.toUpperCase()) {
			return -1;
		} else if (b.Name.toUpperCase() < a.Name.toUpperCase()) {
			return 1;
		}
		return 0;
	});
	this.mainSheet.fields['Pericias'].update(newList);
};

$(sheet.$visible.find("#dfsPericiasSort")[0]).on('click', this.emulateBind(function () {
	this.style.sortPericias();
}, {style : this}));

// Sort rolagens
this.sortRolagens = function () {
	var newList = this.mainSheet.fields['Rolagens'].getObject();
	newList.sort(function (a,b) {
		if (a.RollType !== b.RollType) {
			return b.RollType - a.RollType;
		}
		if (a.Name.toUpperCase() < b.Name.toUpperCase()) {
			return -1;
		} else if (b.Name.toUpperCase() < a.Name.toUpperCase()) {
			return 1;
		}
		return 0;
	});
	this.mainSheet.fields['Rolagens'].update(newList);
};

$(sheet.$visible.find("#dfsRolagensSort")[0]).on('click', this.emulateBind(function () {
	this.style.sortRolagens();
}, {style : this}));

// Sort vantagens
this.sortVantagens = function (tipo) {
	var newList = this.mainSheet.fields[tipo].getObject();
	newList.sort(function (a,b) {
		if (a.Pontos !== b.Pontos) {
			return b.Pontos - a.Pontos;
		}
		if (a.Nome.toUpperCase() < b.Nome.toUpperCase()) {
			return -1;
		} else if (b.Nome.toUpperCase() < a.Nome.toUpperCase()) {
			return 1;
		}
		return 0;
	});
	this.mainSheet.fields[tipo].update(newList);
};

$(sheet.$visible.find("#dfsVantagensSort")[0]).on('click', this.emulateBind(function () {
	this.style.sortVantagens('Vantagens');
}, {style : this}));

$(sheet.$visible.find("#dfsDesvantagensSort")[0]).on('click', this.emulateBind(function () {
	this.style.sortVantagens('Desvantagens');
}, {style : this}));

// Sort anotações
this.sortAnotacoes = function () {
	var newList = this.mainSheet.fields['Anotacoes'].getObject();
	newList.sort(function (a,b) {
		if (a.Campo.toUpperCase() < b.Campo.toUpperCase()) {
			return -1;
		} else if (b.Campo.toUpperCase() < a.Campo.toUpperCase()) {
			return 1;
		}
		return 0;
	});
	this.mainSheet.fields['Anotacoes'].update(newList);
};

$(sheet.$visible.find("#dfsAnotacoesSort")[0]).on('click', this.emulateBind(function () {
	this.style.sortAnotacoes();
}, {style : this}));

// Sort inventario
this.sortInventario = function () {
	var newList = this.mainSheet.fields['Inventario'].getObject();
	newList.sort(function (a,b) {
            if (a.Nome.toUpperCase() < b.Nome.toUpperCase()) {
                    return -1;
            } else if (b.Nome.toUpperCase() < a.Nome.toUpperCase()) {
                    return 1;
            }
            return 0;
	});
        for (var i = 0; i < newList.length; i++) {
            newList[i].SubInventario.sort(function (a, b) {
                if (a.Nome.toUpperCase() < b.Nome.toUpperCase()) {
                        return -1;
                } else if (b.Nome.toUpperCase() < a.Nome.toUpperCase()) {
                        return 1;
                }
                return 0;
            });
        }
	this.mainSheet.fields['Inventario'].update(newList);
};

$(sheet.$visible.find("#dfsInventarioSort")[0]).on('click', this.emulateBind(function () {
	this.style.sortInventario();
}, {style : this}));



// Calculadora Exp
this.calcExp = function () {
	var $expinput = this.element['dfsExpForm'];
	var expform = $expinput.val();
	if (isNaN(expform , 10)) {
		return false;
	}
	$expinput.val('');
	expform  = parseInt(expform );
	var $motivoInput = this.element['dfsExpMotivo'];
	var motivo = $motivoInput.val().trim();
	if (motivo === null || motivo === '') {
		motivo = "Nenhum motivo especificado.";
	}
	$motivoInput.val('');
	
	var oldExp = this.mainSheet.fields['Exp'].getObject();
	var newExp = oldExp + expform;
	
	this.mainSheet.fields['Exp'].storeValue(newExp);
	
	var log = this.mainSheet.fields['ExpLog'];
	var newHistory = log.getNewRow();
	newHistory.fields['Quantidade'].storeValue(expform);
	newHistory.fields['Motivo'].storeValue(
		motivo + ' (Antiga Exp: ' + oldExp + ' - Nova Exp: ' + newExp + ')'
	);
	// Salvar?
	if (this.calcCheckbox['Save'][0].checked) {
		window.app.ui.sheetui.controller.saveSheet();
	}
	
	// Announce?
	if (this.calcCheckbox['Announce'][0].checked && window.app.ui.chat.cc.room !== null) {
		this.announceChange(expform, "Exp");
	}
};

this.element['dfsCalculadoraExp'].on('submit', this.emulateBind(function () {
	this.style.calcExp();
}, {style : this}));





// Calculadora MP
this.calcMp = function () {
	var $mpinput = this.element['dfsMPForm'];
	var mpform = $mpinput.val();
	if (isNaN(mpform, 10)) {
		return false;
	}
	$mpinput.val('');
	mpform = parseInt(mpform);
	var $motivoInput = this.element['dfsMPMotivo'];
	var motivo = $motivoInput.val().trim();
	if (motivo === null || motivo === '') {
		motivo = "Nenhum motivo especificado.";
	}
	$motivoInput.val('');
	
	var oldMP = this.mainSheet.fields['MPAtual'].getObject();
	var newMP = oldMP + mpform;
	
	this.mainSheet.fields['MPAtual'].storeValue(newMP);
	
	var log = this.mainSheet.fields['MPLog'];
	var newHistory = log.getNewRow();
	newHistory.fields['Quantidade'].storeValue(mpform);
	newHistory.fields['Motivo'].storeValue(
		motivo + ' (MP Antigo: ' + oldMP + ' - Novo MP: ' + newMP + ')'
	);

	// Salvar?
	if (this.calcCheckbox['Save'][0].checked) {
		window.app.ui.sheetui.controller.saveSheet();
	}
	
	// Announce?
	if (this.calcCheckbox['Announce'][0].checked && window.app.ui.chat.cc.room !== null) {
		this.announceChange(mpform, "MP");
	}
};

this.element['dfsCalculadoraMP'].on('submit', this.emulateBind(function () {
	this.style.calcMp();
}, {style : this}));



// Curar Tudo
this.healCompletely = function (doStamina) {
	if (doStamina) {
		var stamina = parseInt(this.element['dfsStaminaMaxima'].text());
		this.mainSheet.fields['StaminaAtual'].storeValue(stamina);
	}
	this.mainSheet.fields['HPAtual'].storeValue(this.mainSheet.fields['HPMaximo'].getObject());
	this.mainSheet.fields['MPAtual'].storeValue(this.mainSheet.fields['MPMaximo'].getObject());
	this.mainSheet.fields['CombatLog'].update([]);
	this.mainSheet.fields['MPLog'].update([]);
	// Salvar?
	if (this.calcCheckbox['Save'][0].checked) {
		window.app.ui.sheetui.controller.saveSheet();
	}
};

sheet.$visible.find('#dfsHealAll').on('click', this.emulateBind(function () {
	this.style.healCompletely(true);
}, {style : this}));
sheet.$visible.find('#dfsHealButton').on('click', this.emulateBind(function () {
	this.style.healCompletely(false);
}, {style : this}));





// Anunciador de Chat!
this.announceChange = function (modus, type) {
	var message = new Message();
	message.setOrigin(window.app.loginapp.user.id);
	message.roomid = window.app.ui.chat.cc.room.id;
	message.module = "sheetdm";
	message.setSpecial("sheetname", this.sheet.name);
	if (modus > 0) {
		modus = "+" + modus;
	}
	message.setSpecial("amount", modus);
	message.setSpecial("type", type);
	window.app.chatapp.printAndSend(message, true);
};





// Calculadora geral
this.element['dfsCalculadoraDano'].on('submit', this.emulateBind(function () {
	this.style.calcCaller();
}, {style : this}));

this.calcCaller = function () {
	var dano = this.calcInput['Dano'].val();
	var stamina = dano.indexOf('S') !== -1 || this.calcCheckbox['Stamina'][0].checked;
	var damaging = this.calcCheckbox['Damagedeal'][0].checked;
	var healing = this.calcCheckbox['Heal'][0].checked || this.calcCheckbox['Stamina'][0].checked;
	
	if (dano.indexOf('D') !== -1) {
		damaging = true;
		healing = false;
    } else if (dano.indexOf('H') !== -1) {
		damaging = false;
		healing = true;
	}
	
	dano = dano.replace("D", '').replace("H", '').replace("S", '');
	
	if (damaging) {
		var modus = this.calcDano(dano, stamina);
	} else {
		var modus = this.calcHealing(dano, stamina);
	}
	
	if (this.calcCheckbox['Announce'][0].checked && modus !== 0 && window.app.ui.chat.cc.room !== null) {
		this.announceChange(modus, "HP");
	}
	
	// Salvar?
    if (this.calcCheckbox['Save'][0].checked) {
        window.app.ui.sheetui.controller.saveSheet();
    }
    
    // Limpar?
    if (this.calcCheckbox['Clear'][0].checked) {
        var saveOnSend = this.calcCheckbox['Save'][0].checked;
        var announceOnSend = this.calcCheckbox['Announce'][0].checked;
        for (var id in this.calcCheckbox) {
            this.calcCheckbox[id][0].checked = false;
        }
        this.calcCheckbox['Save'][0].checked = saveOnSend;
        this.calcCheckbox['Announce'][0].checked = announceOnSend;
        this.calcCheckbox['Damagedeal'][0].checked = true;
        this.calcCheckbox['Clear'][0].checked = true;
        for (var id in this.calcInput) {
            this.calcInput[id].val('');
        }
    }
};

// Calculadora Healing
this.calcHealing = function (dano, stamina) {
	if (isNaN(dano, 10)) { alert("Quantidade de HP a alterar digitada não é um número."); return 0; }
    dano = parseInt(dano);
	
	var hpField = this.mainSheet.getField('HPAtual');
    var oldHp = hpField.getObject();
    var maxHpField = this.mainSheet.getField('HPMaximo');
    
    var newHp = hpField.getObject() + dano;
    if (newHp > maxHpField.getObject()) {
        newHp = maxHpField.getObject();
    }
    hpField.storeValue(newHp);
	
	// Consumir Stamina
    if (stamina) {
        var staminaObj = this.mainSheet.getField('StaminaAtual');
        var oldStamina = staminaObj.getObject();
        staminaObj.storeValue(staminaObj.getObject() - 1);
        var newStamina = staminaObj.getObject();
    }
	
	var infoStamina = stamina ? ("\nStamina foi reduzida em 1, indo de " + oldStamina + " para " + newStamina + ".") : "";
	
	var log = this.mainSheet.fields['CombatLog'];
    var newRow = log.getNewRow();
    var motivo = this.calcInput['Motivo'].val().trim();
    if (motivo === null || motivo === '') {
        motivo = "Nenhum motivo especificado.";
    }

    newRow.fields['Quantidade'].storeValue(dano);
    newRow.fields['Motivo'].storeValue(motivo);
    newRow.fields['Explicacao'].storeValue(
		"Curado em " + dano + " HP. HP alterado de " + oldHp + " para " + newHp + "." + infoStamina
    );
	
	return newHp - oldHp;
};

// Calculadora god save me
this.calcDano = function (dano, stamina) {
	var atributosCute = ['Artes Marciais', 'Arma', 'Tecnologia', 'Elemento', 'Magia', 'Liderança'];
	var atributos = ['ArtesMarciais', 'Arma', 'Tecnologia', 'Elemento', 'Magia', 'Lideranca'];
	var tipos = [];
	var rds = [this.getRDBase()];
	
	// Pro style ou checkbox?
	if (dano.indexOf('-') !== -1) {
		dano = dano.split('-'); if (dano.length !== 2) { alert("Código inválido."); return; }
        for (var i = 0; i < atributosCute.length; i++) {
			if (dano[0].indexOf(i) !== -1) {
				tipos.push(atributosCute[i]);
				rds.push(this.getRD(i));
			}
        }
        dano = dano[1];
	} else {
		for (var i = 0; i < atributos.length; i++) {
			if (this.calcCheckbox[atributos[i]][0].checked) {
				tipos.push(atributosCute[i]);
				rds.push(this.getRD(i));
			}
        }
	}
	
	if (tipos.length == 0) {
		tipos.push("Sem tipo");
	}
	
	// Achar maior RD
	rds.sort(function (a,b) {
		if (a.RD > b.RD) {
			return -1;
		} else if (b.RD > a.RD) {
			return 1;
		}
		return 0;
	});
	
	// Outros valores
	var percent = this.calcInput['Percent'].val().trim();
	if (percent === '' || isNaN(percent, 10)) {
        percent = 1;
    } else {
        percent = parseInt(percent) / 100;
        if (percent < 0) {
            percent = 0;
        }
    }
	
	// Penetração
    var penetration = this.calcInput['Penetration'].val().trim();
    if (penetration === '' || isNaN(penetration, 10)) { penetration = 0; }
    penetration =  1 - (parseInt(penetration) / 100);
    // Máximo e Mínimo
    if (penetration < 0) {
        penetration = 0;
    } else if (penetration > 1) {
        penetration = 1;
    }
	
	// Multiplicar RD
	var rdUtilizada = rds[0].RD * penetration;
	
	// Dano Multiplicado
	var danoPassado = parseInt(dano) - rdUtilizada;
	var danoFinal = Math.round(danoPassado * percent);
	
	// Dano mínimo
	var minimo = false;
	if (danoFinal < 1) {
		danoFinal = 1;
		minimo = true;
	}
	
	// Aplicar dano
    var oldHP = this.mainSheet.fields['HPAtual'].getObject();
    var newHP = oldHP - danoFinal;

    this.mainSheet.fields['HPAtual'].storeValue(newHP);
	
	// Stamina?
	if (stamina) {
		var staminaObj = this.mainSheet.getField('StaminaAtual');
        var oldStamina = staminaObj.getObject();
        staminaObj.storeValue(staminaObj.getObject() - 1);
        var newStamina = staminaObj.getObject();
	}
	
	// Log
    var motivo = this.calcInput['Motivo'].val().trim();
    if (motivo === '') motivo = "Nenhum motivo especificado.";
	
	var info = {
		Rolagem : dano,
		TiposDano : tipos.join(", "),
		MaiorRDNome : rds[0].Nome,
		MaiorRDRD : rds[0].RD.toFixed(2),
		RDFinal : rdUtilizada.toFixed(2),
		Pen : ((1 - penetration) * 100).toFixed(0),
		RDMult : (penetration * 100).toFixed(0),
		Perc : (percent * 100).toFixed(0),
		DanoPassado : danoPassado.toFixed(2),
		danoFinal : danoFinal,
		oldHP : oldHP,
		newHP : newHP,
		nomePersonagem : this.nameField.getObject(),
		stamina : stamina ? ("\nEsse ataque reduziu Stamina em 1, de " + oldStamina + " para " + newStamina + ".") : ""
	};
	
	var log = this.mainSheet.fields['CombatLog'];
	var newRow = log.getNewRow();
	newRow.fields['Quantidade'].storeValue(danoFinal);
	newRow.fields['Motivo'].storeValue(motivo);
	newRow.fields['Explicacao'].storeValue(
		"Dano (" + info.TiposDano + "): " + info.Rolagem + " com multiplicação de " + info.Perc + "%, penetrando " + info.Pen + "%.\n" +
		"RD (" + info.MaiorRDNome + "): " + info.RDFinal + ", conta: " + info.RDMult + "% de " + info.MaiorRDRD + ".\n" +
		"Dano Recebido: " + info.danoFinal + ", encontrado por " + info.Perc + "% de " + info.DanoPassado + ", conta: ((" + info.Rolagem + " - " + info.RDFinal + ") * " + info.Perc + "%).\n" +
		"O HP de " + info.nomePersonagem + " era " + info.oldHP + " e agora é " + info.newHP + " (" + (info.newHP - info.oldHP) + " HP)." + info.stamina
    );
	
	return newHP - oldHP;
};





// Mudar tipo de Técnica + Addons
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

		
		
		
		

// NPC/JOGADOR FICHA
this.turnNpc = function (kind) {
	if (kind === 'NPC') {
		this.element['dfsDiv'].removeClass('character').addClass('nonplayer');
	} else {
		this.element['dfsDiv'].removeClass('nonplayer').addClass('character');
	}
}

sheet.fields['Jogador'].$visible.on('changedVariable', function (e, variable) {
	variable.style.turnNpc(variable.getObject());
});

this.turnNpc(sheet.fields['Jogador'].getObject());


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


// SOMAR PERICIAS
this.sumPericias = function () {
	var pericias = this.mainSheet.fields['Pericias'];
	var sum = 0;

	for (var i = 0; i < pericias.list.length; i++) {
		sum += pericias.list[i].fields['Valor'].getObject();
	}

	this.element['SumPericias'].text('(' + sum + ')');
};

sheet.fields['Pericias'].$visible.on('changedVariable changedRows', function (e, variable) {
	variable.style.sumPericias();
});

this.sumPericias();






// Somar vantagens / desvantagens
this.sumVants = function (type) {
	var desvantagens = this.mainSheet.fields[type];
	var sum = 0;
	
	var pontos = [];
	for (var i = 0; i < desvantagens.list.length; i++) {
		pontos.push(desvantagens.list[i].fields['Pontos'].getObject());
	}
	pontos = pontos.sort();
	
	for (var i = 0; (i < pontos.length) && (type != 'Desvantagens' || (i < 4)); i++) {
		sum += pontos[pontos.length - (i + 1)];
	}
	
	this.element[type + 'Sum'].text(sum);
};

sheet.fields['Vantagens'].$visible.on('changedVariable changedRows', function (e, variable) {
	variable.style.sumVants('Vantagens');
});

sheet.fields['Desvantagens'].$visible.on('changedVariable changedRows', function (e, variable) {
	variable.style.sumVants('Desvantagens');
});

this.sumVants('Vantagens');
this.sumVants('Desvantagens');






// SOMAR ATRIBUTOS TESTE
this.sumAtribTeste = function () {
	var sheet = this.mainSheet;
	var atributosTeste = ['Forca', "Constituicao", "Agilidade", "Carisma", "Sabedoria", "Inteligencia", "ForcaDeVontade"];
	var sum = 0;
	
	for (i = 0; i < atributosTeste.length; i++) {
		sum += sheet.fields[atributosTeste[i]].getObject();
	}
	
	this.element['sumAtributosTeste'].text('(' + sum + ')');
};

var atributosTeste = ['Forca', "Constituicao", "Agilidade", "Carisma", "Sabedoria", "Inteligencia", "ForcaDeVontade"];        
for (i = 0; i < atributosTeste.length; i++) {
	sheet.fields[atributosTeste[i]].$visible.on('changedVariable', function (e, variable) {
		variable.style.sumAtribTeste();
	});
}
this.sumAtribTeste();






// BARRA DE EXP Atual
this.sabedoriaDeCombate = 0;
this.fixCurExpSab = function () {
	var sheet = this.mainSheet;
	var atributosCombate = ['ArtesMarciais', 'Arma','Tecnologia',"Elemento",'Magia','Lideranca','Defesa','Ataque'];
	var atributo;
	var sum = 0;
	var expThis;
	
	var expSabedoria = 0;
	for (var i = 0; i < atributosCombate.length; i++) {
		atributo = sheet.fields[atributosCombate[i] + 'Nivel'];
		expThis = this.getExp(atributo.getObject());
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
	
	for (var nivelSabedoria = 0; (nivelSabedoria * (5 + (nivelSabedoria * 5)) / 2) <= expSabedoria; nivelSabedoria++) {}
	
	--nivelSabedoria;
	
	var expRestante = expSabedoria - (nivelSabedoria * (5 + (nivelSabedoria * 5)) / 2);
	
	this.element['dfsSdCExp'].text(
		(expRestante) + '/' + ((nivelSabedoria + 1) * 5) + ' para Level Up (Total: ' + parseInt(expSabedoria) + ')'
	);

	this.element['dfsCura'].text(
		parseInt(nivelSabedoria + 2)
	);

	this.element['dfsStaminaMaxima'].text(
		parseInt(nivelSabedoria + 2)
	);
	
	if ((expRestante / ((nivelSabedoria + 1) * 5)) >= 0.5) {
		nivelSabedoria += 0.5;
	}
	
	this.element['dfsSdCNivel'].text(nivelSabedoria);
	this.sabedoriaDeCombate = nivelSabedoria;
	
	this.element['dfsResistenciaNivel'].text(
		(nivelSabedoria / 2).toFixed(1)
	);

	this.element['dfsExpAtual'].text(expAtual);
	if (expAtual > 0) {
		this.element['dfsExpAtualBar'].width(
				((expAtual / sheet.fields['Exp'].getObject()) * 100) + '%'
		);
	} else {
		this.element['dfsExpAtualBar'].width('0%');
	}
};

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
		
		// Chamar função para barra de exp
		variable.style.fixCurExpSab();
	});
	atributo.$visible.trigger('changedVariable', [atributo]);
}


// BARRA EXP
this.nivelAtual = 0;
this.fixExpBar = function () {
	var sheet = this.mainSheet;
	var exp = sheet.fields['Exp'];
	this.element['dfsExpTotal'].text(exp.getObject());
	var expTotal = exp.getObject();
	for (var i = 1; 
			(i * (5 + (i * 5)) * 2)
			<= expTotal; i++
		) {}
	var expNext = (i * (5 + (i * 5)) * 2);
	this.element['dfsLevelupXP'].text(expNext);
	if (expTotal > 0) {
		this.element['dfsExpTotalBar'].width(
			   ((expTotal / expNext) * 100) + '%'
		);
	} else {
		this.element['dfsExpTotalBar'].width('0%');
	}
	
        this.nivelAtual = i - 1;
        
	this.element['NivelAtual'].text(this.nivelAtual);
        this.element['dfsIniciativaValue'].text(Math.floor(this.nivelAtual + (this.mainSheet.getField("Agilidade").getObject() / 2)));
};

sheet.fields["Agilidade"].$visible.on('changedVariable', function (e, variable) {
    variable.style.element['dfsIniciativaValue'].text(Math.floor(variable.style.nivelAtual + (variable.style.mainSheet.getField("Agilidade").getObject() / 2)));
});

sheet.fields['Exp'].$visible.on('changedVariable', function (e, variable) {
	variable.style.fixExpBar();
	variable.style.fixCurExpSab();
});

this.fixExpBar();



// BARRA
this.fixBar = function (barType) {
	var sheet = this.mainSheet;
	var hpAtual = sheet.fields[barType + 'Atual'].getObject();
	var hpMaximo = sheet.fields[barType + 'Maximo'].getObject();
	sheet.$visible.find('#dfs' + barType + 'Atual').text(hpAtual);
	sheet.$visible.find('#dfs' + barType + 'Maximo').text(hpMaximo);
	
	if (hpAtual > 0 && hpMaximo > 0) {
		sheet.$visible.find('#dfs' + barType + 'Bar').width(
			((hpAtual / hpMaximo) * 100) + '%'
		);
	} else {
		sheet.$visible.find('#dfs' + barType + 'Bar').width('0%');
	}
};

var fixMPBarCallback = function (e, variable) {
	variable.style.fixBar('MP');
};

var fixHPBarCallback = function (e, variable) {
	variable.style.fixBar('HP');
};

sheet.fields['MPAtual'].$visible.on('changedVariable', fixMPBarCallback);
sheet.fields['MPMaximo'].$visible.on('changedVariable', fixMPBarCallback);
sheet.fields['HPAtual'].$visible.on('changedVariable', fixHPBarCallback);
sheet.fields['HPMaximo'].$visible.on('changedVariable', fixHPBarCallback);
this.fixBar('MP');
this.fixBar('HP');




// INVENTARIO E PESOS
this.calcularPesos = function () {
	var bags = this.mainSheet.fields["Inventario"];
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
	this.element['InventarioAtual'].text(pesoTotal);
};

sheet.fields['Inventario'].$visible.on('changedVariable changedRows', function (e, variable) {
	variable.style.calcularPesos();
});

this.calcularPesos();