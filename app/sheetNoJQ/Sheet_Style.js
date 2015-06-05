function Sheet_Style (sheetInstance, styleInstance) {
	var start = new Date().getTime();
	this.varFactory = new VariableFactory();
	this.butFactory = new ButtonFactory();
	
	this.sheetInstance = sheetInstance;
	this.styleInstance = styleInstance;
	this.id = styleInstance.id;
	this.editing = false;
	this.loading = true;
	
	this.visible = document.createElement('div');
	this.visible.id = 'sheetDiv';
	this.visible.innerHTML = styleInstance.html;
	
	this.css = document.createElement('style');
	this.css.type = 'text/css';
	this.css.innerHTML = styleInstance.css;
	
	this.$visible = $(this.visible);
	this.$css = $(this.css);
	
	this.emulateBind = function (f, context) {
        return function () {
            f.apply(context, arguments);
        };
        console.log("Please consider not using emulateBind.");
    };
    
    this.fillScope = function (scope, button) {
		for (var id in scope) {
			var closest = button.parent.getValueFor(id);
			scope[id] = closest === null || isNaN(closest, 10) ? this.sheet.getValueFor(id) : closest;
		}
	};

	this.automate = function (button) {};
	this.prepareDice = function (diceInfo, button) {};
    
    this.switchInstance = function (sheetInstance) {
    	var start = new Date().getTime();
    	if (this.editing) this.toggleEdit();
		//var parent = this.visible.parentNode;
		//if (parent !== null && parent !== undefined) parent.removeChild(this.visible);
		this.loading = true;
    	this.sheetInstance = sheetInstance;
    	this.sheet.updateSheetInstance();
    	this.loading = false;
    	this.triggerChanged(null);
    	//if (parent !== null && parent !== undefined) parent.appendChild(this.visible);
//		if (this.editing) {
//			this.sheet.resizeBoxes();
//		}
    	var finish = new Date().getTime();
    	console.log("SwitchInstance Process took " + (finish - start) + " ms to finish for Style " + this.id + ", " + this.styleInstance.name + ".");
    };
	
	this.toggleEdit = function () {
		var start = new Date().getTime();
		//var parent = this.visible.parentNode;
		//if (parent !== null && parent !== undefined) parent.removeChild(this.visible);
		this.editing = !this.editing;
		if (this.editing) {
			this.visible.classList.add('editToggled');
		} else {
			this.visible.classList.remove('editToggled');
		}
		this.sheet.update();
		//if (parent !== null && parent !== undefined) parent.appendChild(this.visible);
//		if (this.editing) {
//			this.sheet.resizeBoxes();
//		}
		var finish = new Date().getTime();
		this.sheet.triggerToggledEdit();
		console.log("ToggleEdit Process took " + (finish - start) + " ms to finish for Style " + this.id + ", " + this.styleInstance.name + ".");
	};
    
    this.getObject = function () {
        var obj = this.sheet.getObject();
        this.sheetInstance.values = obj;
        return obj;
    };
    
    this.counter = 0;
    this.getCustomID = function () {
    	return "field" + this.styleInstance.id + "_" + this.counter++;
    };
    
    /**
     * Triggers change going up a chain.
     */
    this.changedCount = 0;
    this.changedVariables = [];
    this.triggerChanged = function (varb) {
    	if (varb === null) {
    		var count = this.changedCount++;
    		for (var i = 0; i < this.changedVariables.length; i++) {
    			this.changedVariables[i].triggerChanged(count);
    		}
    		this.changedVariables = [];
    	} else {
    		if (!this.loading) var count = this.changedCount++;
	    	while (varb !== null) {
	    		if (!this.loading) {
	    			varb.triggerChanged(count);
	    		} else {
		    		if (this.changedVariables.indexOf(varb) !== -1)  break;
		    		this.changedVariables.push(varb);
	    		}
	    		varb = varb.parent;
	    	}
    	}
    };
    
    // SHEET
    try {
    	eval(this.styleInstance.beforeProcess);
    } catch (e) {
    	console.log("Before Process Error for Style " + this.id + ", " + this.styleInstance.name + ".");
    	console.log(e);
    	console.log(e.stack);
    	if (window.location.hash.substr(1).toUpperCase().indexOf("DEBUG") !== -1)
    		alert("Before Process Error for Style " + this.id + ", " + this.styleInstance.name + ".\nError: " + e.message + e.lineNumber + ".\n More details on Console.");
    }
	this.sheet = new Sheet([this.visible], this);
	try {
    	eval(this.styleInstance.afterProcess);
    } catch (e) {
    	console.log("After Process Error for Style " + this.id + ", " + this.styleInstance.name + ".");
    	console.log(e);
    	console.log(e.stack);
    	if (window.location.hash.substr(1).toUpperCase().indexOf("DEBUG") !== -1)
    		alert("After Process Error for Style " + this.id + ", " + this.styleInstance.name + ".\nError: " + e.message + ".\n More details on Console.");
    }
	this.sheet.updateSheetInstance();
	this.loading = false;
	this.triggerChanged(null);
	this.sheet.addChangedListener({
		style : this,
		sheet : this.sheet,
		handleEvent : function () {
			if (!this.style.loading) {
				var obj = this.style.sheet.getObject();
				this.style.sheetInstance.changed = true;
				this.style.sheetInstance.values = obj;
				//window.app.memory.setMemory("Sheet_" + this.style.sheetInstance.id, obj);
			}
		}
	});
	this.sheet.triggerLoaded();
	var finish = new Date().getTime();
	console.log("Sheet Generation Process took " + (finish - start) + " ms to finish for Style " + this.id + ", " + this.styleInstance.name + ".");
	
	this.updateSheetInstance = function () {
		this.loading = true;
		this.sheet.updateSheetInstance();
		this.loading = false;
		this.triggerChanged(null);
	};
	
	this.seppuku = function () {
		this.sheet.seppuku();
	};
	
	this.registerDiceAutomation = function (diceInfo) {
		diceInfo.special.style = this.id;
		diceInfo.special.styleName = this.styleInstance.name;
	};
	
	this.rollDice = function (button) {
		var dices = button.getDices();
		var mod = button.getMod();
		
		var message = dices.diceAmount + "d" + dices.diceFaces;
		message += " + (" + mod.exp + ")";
		
		var special = {
			persona : this.sheetInstance.name
		};
		
		var diceInfo = {
			message : message,
			dices : dices.dices,
			mod : mod.mod,
			special : special,
			extra : button.extra,
			getTargets : false
		};
		
		this.prepareDice(diceInfo, button);
		
		var modFinal = parseInt(diceInfo.mod);
		if (modFinal !== diceInfo.mod) {
			diceInfo.message += " (" + (+ (diceInfo.mod.toFixed(2))) + " -> " + modFinal + ")";
			diceInfo.mod = modFinal;
		}
		
		if (diceInfo.getTargets) {
			var targets = window.app.ui.chat.tracker.getTarget();
			var diceTargets = [];
			for (var i = 0; i < targets.length; i++) {
				diceTargets.push({
					id: targets[i].id,
					name : targets[i].name
				});
			}
			
			if (diceTargets.length > 0) {
				var originalMessage = diceInfo.message;
				for (var i = 0; i < diceTargets.length; i++) {
					diceInfo.message = originalMessage + " {" + diceTargets[i].name + "}";
					diceInfo.special.target = diceTargets[i];
					window.app.ui.chat.dc.rollDice(diceInfo);
				}
				return;
			}
		}
		
		window.app.ui.chat.dc.rollDice(diceInfo);
		
//		if (window.app.ui.chat.tracker.target !== -1 && (rollType === "Dano" || rollType === "Cura")) {
//	        var info = window.app.ui.chat.tracker.myStuff.ordered[window.app.ui.chat.tracker.target];
//	        extra = {
//	            target : window.app.ui.chat.tracker.target,
//	            name : info.name,
//	            id : info.id,
//	            type : rollType,
//	            damageType : types,
//				perc : sheet.getField("DanoPerc").getObject(),
//				pen : sheet.getField("Penetracao").getObject()
//	        };
//	    }
	};
}