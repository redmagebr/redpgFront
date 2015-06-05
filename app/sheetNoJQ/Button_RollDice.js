function Button_RollDice (element, style, parent) {
	this.visible = element;
	this.style = style;
	this.parent = parent;
	
	var data = this.visible.dataset;
	this.viewingOnly = data.view === undefined ? true : (data.view === '1');
	this.diceAmount = data.amount === undefined || isNaN(data.amount, 10) ? null : parseInt(data.amount);
	this.diceFaces = data.faces === undefined || isNaN(data.faces, 10) ? null : parseInt(data.faces);
	this.diceMod = data.mod === undefined || isNaN(data.mod, 10) ? null : parseInt(data.mod);
	this.extra = data.extra === undefined ? "" : data.extra;

	this.amountTarget = data.amounttarget === undefined ? 'DiceAmount' : data.amounttarget;
	this.facesTarget = data.facestarget === undefined ? 'DiceFaces' : data.facestarget;
	this.modTarget = data.modtarget === undefined ? 'DiceMod' : data.modtarget;
	
	this.clickHandler = {
		button : this,
		handleEvent : function () {
			try {
				this.button.style.rollDice(this.button);
			} catch (e) {
				console.log("Invalid RollDice.", e, this);
			}
		}
	};
	
	this.visible.addEventListener('click', this.clickHandler);
	this.originalDisplay = this.visible.style.display;
	if (!(!this.style.editing || !this.viewingOnly)) {
		this.visible.style.display = 'none';
	}
	
	this.update = function () {
		if (!this.style.editing || !this.viewingOnly) {
			this.visible.style.display = this.originalDisplay;
		} else {
			this.visible.style.display = 'none';
		}
	};

	this.getDices = function () {
		var diceAmount = this.diceAmount;
		if (diceAmount === null) {
			diceAmount = parseInt(this.parent.getField(this.amountTarget).getValue());
		}

		var diceFaces = this.diceFaces;
		if (diceFaces === null) {
			diceFaces = parseInt(this.parent.getField(this.facesTarget).getValue());
		}
		
		var dices = [];
		for (var i = 0; i < diceAmount; i++) dices.push(diceFaces);
		
		return {
			diceAmount : diceAmount,
			diceFaces : diceFaces,
			dices : dices
		};
	};
	
	this.getMod = function () {
		var mod = parseFloat(this.parent.getFieldByName(this.modTarget).getValue());
		var exp = this.parent.getFieldByName(this.modTarget).getObject();
		if ((exp === null && this.modTarget !== "DiceMod") || mod.toString() === exp.toString()) {
			exp = this.modTarget;
		} else if (exp === null) {
			exp = "";
		}
		var mod = {
			mod : mod + (this.diceMod !== null ? this.diceMod : 0),
			exp :  exp + (this.diceMod !== null ? (exp !== "" ? " + " : "") + this.diceMod : "")
		};
		return mod;
	};
}

if (window.sheetButtonTypes === undefined || window.sheetButtonTypes === null)
	window.sheetButtonTypes = {};

window.sheetButtonTypes['rolldice'] = Button_RollDice;