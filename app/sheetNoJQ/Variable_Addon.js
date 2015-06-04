if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['addon'] = function (element, style, parent) {
	var varb = new Variable(element, style, parent, false, false);
	varb.takeMe(this);
	varb = null;
	
	this.superParent = this.parent.parent.parent; // Sheet that owns the list which has my owner
	
	this.options = [];
	this.input = document.createElement("select");
	this.inputListener = {
		variable : this,
		input : this.input,
		handleEvent : function () {
			this.variable.storeValue(this.input.value);
		}
	};
	
	this.input.addEventListener("change", this.inputListener);
	
	this.updateOptions = function () {
		while (this.input.firstChild) this.input.removeChild(this.input.firstChild);
		this.options = [];
		var tipo = this.superParent.getField("Tipo").getValue();
		tipo = this.tipos[tipo];
		for (var i = 0; i < window.techAddons.length; i++) {
			var addon = window.techAddons[i];
			if (addon.tipo === tipo) this.options.push(addon);
		}
		
		for (var i = 0; i < this.options.length; i++) {
			var option = document.createElement("option");
			option.value = this.options[i].nome;
			option.appendChild(document.createTextNode(this.options[i].nome));
			this.input.appendChild(option);
		}
		this.input.value = this.value;
	};
	
	this.imgNode = document.createElement('img');
	this.imgNode.style.width = '32px';
	this.imgNode.style.height = '32px';
	this.textNode = this.imgNode;
	
	this.imgNode.addEventListener("error", function () {
		this.src = "http://rules.redpg.com.br/img/icon/Unknown.png";
	});
	
	window.app.ui.addonui.addonize($(this.visible), this.value);
	
	while (this.visible.firstChild) this.visible.removeChild(this.visible.firstChild);
	this.visible.appendChild(this.textNode);
	
	var loadedObj = {
		addon : this,
		handleEvent : function () {
			this.addon.superParent.getField("Tipo").addChangedListener({
				addon : this.addon,
				handleEvent : function () {
					this.addon.updateOptions();
					this.addon.update();
				}
			});
			this.addon.updateOptions();
		}
	};
	
	var parent = this.parent;
	parent.addLoadedListener(loadedObj);
	
	this.tipos = {
		"Ataque" : "ataque",
		"Estilo de Luta" : "estilo",
		"Passiva" : "passiva",
		"Especial" : "especial",
		"Arma" : "arma",
		"Arma Defensiva" : "escudo",
		"Armadura" : "armadura",
		"Acessório" : "acessorio",
		"Item Consumível" : "consumivel"
	};
	
	this.update2 = this.update;
	this.update = function () {
		var tipo = this.superParent.getField("Tipo").getValue();
		tipo = this.tipos[tipo];
		var nome = tipo + "-" + this.value;
		nome = nome.toUpperCase().replace(/ *\([^)]*\) */, '').trim();
		this.visible.dataset.listid = nome;
		var addon = window.techAddonsHash[nome];
		if (addon !== undefined) {
			this.imgNode.src = 'http://rules.redpg.com.br/img/icon/' + addon.nomeLimpo + '.png';
		} else {
			this.imgNode.src = "http://rules.redpg.com.br/img/icon/Unknown.png";
		}
		this.update2();
	};
};