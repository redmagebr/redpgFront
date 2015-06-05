/**
 * Desvantagens
 * Somar apenas os 4 maiores
 */
this.sheet.getField("Desvantagens").getValue2 = this.sheet.getField("Desvantagens").getValue;
this.sheet.getField("Desvantagens").getValue = function () {
	var r = this.getValue2();
		if (Array.isArray(r)) {
		r.sort(function(a,b) {
			return b - a;
		});
		if (r.length > 4) {
			return [r[0], r[1], r[2], r[3]];
		}
	}
	return r;
};

// HIDE AND SHOW FERRAMENTAS
this.sheet.addInstanceListener(function(sheet) {
	var style = sheet.style;
	if (style.sheetInstance.editable) {
		style.inputs['dfsFerramentasHeader'].style.display = 'block';
	} else {
		style.inputs['dfsFerramentasHeader'].style.display = 'none';
		if (style.inputs['dfsFerramentas'].style.display !== 'none') {
			style.inputs['dfsFerramentas'].style.display = 'none';
			style.inputs['dfsFerramentasButton'].firstChild.nodeValue = "(+)";
		}
	}
	
});

/**
 * Perícias
 * Trocar cor
 */
this.sheet.getFieldByName('Pericias').addCreatedRowListener(function (list, row) {
	var updObj = {
		row : row,
		$row : $(row.visible),
		handleEvent : function (variable) {
			var attr = variable.getValue();
			for (var i = 0; i < variable.options.length; i++) {
				this.$row.removeClass('atributo' + variable.options[i]);
			}
			if (attr !== 'N/A') {
				this.$row.addClass('atributo' + attr);
			} else {
				this.$row.addClass('atributoFdV');
			}
		}
	};
	
	row.getField('Attribute').addChangedListener(updObj);
});


/**
 * Perícias
 * Pegar valor de Perícias
 */
/**
 * Perícias
 * Redução de custo para Perícias N/A
 */
this.sheet.getField("Pericias").getValue = function () {
	var results = [];
	for (var i = 0; i < this.sheets.length; i++) {
		var pericia = this.sheets[i];
		if (pericia.getField("Attribute").getValue() === "N/A") {
			results.push(Math.round(pericia.getField("Valor").getValue() / 2));
		} else {
			results.push(pericia.getField("Valor").getValue());
		}
	}
	if (results.length === 0) return 0;
	return results;
};

/**
 * Experiência, HP e MP
 * Preencher barras
 */
var updObj = {
	bar : this.$visible.find("#dfsExpBarFillings")[0],
	style : this,
	handleEvent : function () {
		var nivel = this.style.sheet.getField('Nivel').getValue();
		var expToCurrent = 10 * (nivel * nivel) + 10 * (nivel);
		nivel++;
		var expToNext = 10 * (nivel * nivel) + 10 * (nivel);
		expToNext -= expToCurrent;
		var exp = this.style.sheet.getField("Exp").getValue() - expToCurrent;
		var perc = (exp / expToNext) * 100;
		this.bar.style.width = perc + "%";
	}
};

this.sheet.getField("Nivel").addChangedListener(updObj);
this.sheet.getField("Exp").addChangedListener(updObj);

var hpUpdObj = {
	bar : this.$visible.find("#dfsHPBarFillings")[0],
	style : this,
	handleEvent : function () {
		var atual = this.style.sheet.getField("HPAtual").getValue();
		var maximo = this.style.sheet.getField("HPMaximo").getValue();
		var perc = (atual / maximo) * 100;
		if (perc < 0) perc = 0;
		if (perc > 100) perc = 100;
		this.bar.style.width = perc + "%";
	}
};

hpUpdObj.handleEvent();

this.sheet.getField('HPAtual').addChangedListener(hpUpdObj);
this.sheet.getField('HPMaximo').addChangedListener(hpUpdObj);

var mpUpdObj = {
	bar : this.$visible.find("#dfsMPBarFillings")[0],
	style : this,
	handleEvent : function () {
		var atual = this.style.sheet.getField("MPAtual").getValue();
		var maximo = this.style.sheet.getField("MPMaximo").getValue();
		var perc = (atual / maximo) * 100;
		if (perc < 0) perc = 0;
		if (perc > 100) perc = 100;
		this.bar.style.width = perc + "%";
	}
};

mpUpdObj.handleEvent();

this.sheet.getField('MPAtual').addChangedListener(mpUpdObj);
this.sheet.getField('MPMaximo').addChangedListener(mpUpdObj);

/**
 * Inventário
 * Calcular peso
 */
this.sheet.getField('Inventario').getValue = function () {
	var pesos = [];
	
	for (var i = 0; i < this.sheets.length; i++) {
		var quantidade = this.sheets[i].getField('Quantidade').getValue();
		var peso = this.sheets[i].getField('Peso').getValue();
		var meuPeso = [(quantidade * peso)];
		var sub = this.sheets[i].getField('SubInventario');
		for (var k = 0; k < sub.sheets.length; k++) {
			var subItem = sub.sheets[k];
			var quantidade = subItem.getField('Quantidade').getValue();
			var peso = subItem.getField('Peso').getValue();
			meuPeso.push((peso * quantidade));
		}
		pesos.push(meuPeso);
	}
	
	return pesos.length === 0 ? 0 : pesos;
};

this.sheet.getField('Inventario').sort2 = this.sheet.getField('Inventario').sort;
this.sheet.getField('Inventario').sort = function () {
	this.sort2();
	
	for (var i = 0; i < this.sheets.length; i++) {
		this.sheets[i].sort();
	}
};


/**
 * Vantagens e Desvantagens
 * ADDONIZE
 */
// window.app.ui.addonui.turnVantagem(addonVar.$visible, addonVar.fields['Nome'].getObject());
// data-listid = nome da vantagem

this.sheet.getField('Vantagens').addCreatedRowListener(function (list, row) {
	var addon = row.visible[1];
	var $addon = $(addon);
	window.app.ui.addonui.turnVantagem($addon, row.getField('Nome').getValue());
	row.getField('Nome').addChangedListener({
		addon : addon,
		handleEvent : function (nome) {
			addon.dataset.listid = nome.getValue();
		}
	});
});

this.sheet.getField('Desvantagens').addCreatedRowListener(function (list, row) {
	var addon = row.visible[1];
	var $addon = $(addon);
	window.app.ui.addonui.turnDesvantagem($addon, row.getField('Nome').getValue());
	row.getField('Nome').addChangedListener({
		addon : addon,
		handleEvent : function (nome) {
			addon.dataset.listid = nome.getValue();
		}
	});
});

var vantagensSorter = function (a, b) {
	var ptA = a.getField('Pontos').getValue();
	var ptB = b.getField('Pontos').getValue();
	if (ptA > ptB) return -1;
	if (ptA < ptB) return 1;
	var nA = a.getField('Nome').getValue().latinize().toUpperCase();
	var nB = b.getField('Nome').getValue().latinize().toUpperCase();
	if (nA < nB) return -1;
	if (nA > nB) return 1;
	return 0;
};

this.sheet.getField('Vantagens').sortFunction = vantagensSorter;
this.sheet.getField('Desvantagens').sortFunction = vantagensSorter;

/**
 * TÉCNICAS
 * Adicionar classe do tipo
 */
this.sheet.getField('Tecnicas').sortFunction = function (a, b) {
	var tipoA = a.getField("Tipo").getObject();
	if (tipoA === 2) tipoA = -1;
	var tipoB = b.getField("Tipo").getObject();
	if (tipoB === 2) tipoB = -1;
	if (tipoA < tipoB) return -1;
	if (tipoA > tipoB) return 1;
	var nA = a.getField('Nome').getValue().latinize().toUpperCase();
	var nB = b.getField('Nome').getValue().latinize().toUpperCase();
	if (nA < nB) return -1;
	if (nA > nB) return 1;
	return 0;
};

this.sheet.getField('Tecnicas').addCreatedRowListener(function (list, row) {
	// Mudança de Cor
	var updObj = {
		$visible : $(row.visible),
		row : row,
		handleEvent : function () {
			var tipo = row.getField("Tipo").getValue().replace(/\s/g, "").toLowerCase();
			this.$visible.removeClass("ataque especial estilodeluta passiva").addClass(tipo);
		}
	};
	updObj.handleEvent();
	row.getField('Tipo').addChangedListener(updObj);
	
	// Mostrar esconder tipos de dano
	row.getField('Danos').addCreatedRowListener(function (list, row) {
		var $visible = $(row.visible);
		var updObj = {
			$visible : $visible,
			field : row.getField("AutoAttr"),
			handleEvent : function () {
				if (!this.field.getValue()) {
					this.$visible.find(".atributosManuais").unhide();
				} else {
					this.$visible.find(".atributosManuais").hide();
				}
			}
		};
		
		row.getField('AutoAttr').addChangedListener(updObj);
	});
});