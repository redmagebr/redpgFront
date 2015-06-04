function Sheet (elements, style, parent) {
	this.style = style;
	this.visible = elements;
	this.$visible = $(elements);
	
	this.nameField = null;
	
	this.parent = parent === undefined ? null : parent;
	
	if (this.parent === null) {
		this.id = "Base Sheet";
	} else {
		this.id = "Sheet for list " + this.parent.id;
	}
	
	this.buttons = [];
	this.lists = [];
	this.fields = {};
	this.ciKeys = {};
	
	this.getField = function (id) {
		if (this.fields[id] === undefined) {
			return null;
		}
		return this.fields[id];
	};
	
	this.getFieldByName = function (id, prepared) {
		prepared = prepared === undefined ? false : prepared;
		if (!prepared) id = id.replace(/\s/g, "").latinize().toUpperCase();
		if (this.ciKeys[id] !== undefined) {
			return this.getField(this.ciKeys[id]);
		}
		return null;
	};
	
	this.listeners = {
		'changedVariable' : [],
		'toggledEdit' : [],
		'loaded' : [],
		"changedInstance" : []
	};
	
	/**
	 * Check whether this list is part of another list or not.
	 */
	this.isDeepList = function (element) {
		var parent = element.getParentElement;
		if (parent === null || parent === undefined) {
			return true;
		}
		if (parent.classList.contains('sheetList')) {
			return false;
		}
		return this.isDeepList(parent);
	};
	
	this.updateSheetInstance = function () {
		this.storeValue(this.style.sheetInstance.values);
		if (this.nameField !== null) {
			this.nameField.storeValue(this.style.sheetInstance.name);
		}
		this.triggerInstance();
	};
	
	this.reset = function () {
		for (var id in this.fields) {
			this.fields[id].reset();
		}
		for (var i = 0; i < this.buttons.length; i++) {
			this.buttons[i].update();
		}
	};
	
	this.storeValue = function (value) {
		if (typeof value !== 'object') return;
		for (var id in this.fields) {
			if (value[id] !== undefined) {
				this.fields[id].storeValue(value[id]);
			} else {
				this.fields[id].reset();
			}
		}
	};
	
	this.getObject = function () {
		var obj = {};
		for (var id in this.fields) {
			obj[id] = this.fields[id].getObject();
			if (obj[id] === null) {
				delete obj[id];
			}
		}
		return obj;
	};
	
	this.update = function () {
		for (var id in this.fields) {
			this.fields[id].update();
		}
		if (this.nameField !== null) {
			this.nameField.update();
		}
		
		for (var i = 0; i < this.buttons.length; i++) {
			this.buttons[i].update();
		}
	};
	
	this.triggerChanged = function (count) {
		this.trigger('changedVariable', count);
	};
	
	this.triggerInstance = function (count) {
		this.trigger('changedInstance', count);
	};
	
	this.triggerLoaded = function () {
		this.trigger('loaded');
	};
	
	this.triggerToggledEdit = function () {
		this.trigger('toggledEdit');
	};
	
	this.addLoadedListener = function (handler) {
		this.addEventListener('loaded', handler);
	};
	
	this.addChangedListener = function (handler) {
		this.addEventListener('changedVariable', handler);
	};
	
	this.addInstanceListener = function (handler) {
		this.addEventListener('changedInstance', handler);
	};
	
	this.addToggledEditListener = function (handler) {
		this.addEventListener('toggledEdit', handler);
	};
	
	this.addEventListener = function (id, handler) {
		if (this.listeners[id] === undefined) {
			this.listeners[id] = [];
		}
		this.listeners[id].push(handler);
	};
	
	this.trigger = function (id, extra) {
		var listr = this.listeners[id];
		for (var i = 0; i < listr.length; i++) {
			try {
				if (typeof listr[i] === 'function') {
					listr[i](this, extra);
				} else {
					listr[i].handleEvent(this, extra);
				}
			} catch (e) {
				alert("This style has a bugged " + id + " Event Handler. More information on console (if debug mode is active)");
				console.log("Error on event handler for " + this.id + " on Style " + this.style.styleInstance.name + " for event " + id + ". Offending handler:");
				console.log(listr[i]);
			}
		}
	};
	
	this.resizeBoxes = function () {
		for (var i in this.fields) {
			if (typeof this.fields[i].resize === 'function') {
				this.fields[i].resize();
			} else if (this.fields[i] instanceof Sheet_List) {
				this.fields[i].resizeBoxes();
			}
		}
	};
	
	this.seppuku = function () {
		for (var id in this.fields) {
			this.fields[id].seppuku();
		}
	};
	
	this.getValueFor = function (id) {
		id = id.replace(/\s/g, "").latinize().toUpperCase();
		var idTrue = this.ciKeys[id];
		if (idTrue !== undefined) {
			var value = this.getField(idTrue).getValue();
			if (Array.isArray(value)) return value;
			if (isNaN(value, 10)) return NaN;
			return parseFloat(value);
		} else {
			// look in lists...
			for (var i = 0; i < this.lists.length; i++) {
				var value = this.lists[i].getValueFor(id);
				if (value !== null) return value;
			}
		}
		return NaN;
	};
	
	// Search each Child Node for variables
	for (var i = 0; i < this.visible.length; i++) {
		var element = this.visible[i];
		
		// Skip if it's not an element
		if (element.nodeType !== 1) continue;
		
		if (element.classList.contains('sheetList')) {
			var newSheetList = new Sheet_List (element, this.style, this);
			this.fields[newSheetList.id] = newSheetList;
			this.lists.push(newSheetList);
			continue;
		} else if (element.classList.contains('deleteRow')) {
			var newButton = new Button_DeleteRow(element, this.style, this);
			this.buttons.push(newButton);
			continue;
		} else if (element.classList.contains('buttonAutomation')) {
			var newButton = new Button_Automation(element, this.style, this);
			this.buttons.push(newButton);
			continue;
		} else if (element.classList.contains('addRow')) {
			var newButton = new Button_AddRow(element, this.style, this);
			this.buttons.push(newButton);
			continue;
		} else if (element.classList.contains('rollDice')) {
			var newButton = new Button_RollDice(element, this.style, this);
			this.buttons.push(newButton);
			continue;
		} else if (element.classList.contains('sortList')) {
			var newButton = new Button_SortList(element, this.style, this);
			this.buttons.push(newButton);
			continue;
		} else if (element.classList.contains('sheetVariable')) {
			var newVariable = this.style.varFactory.createVariable(element, this.style, this);
			this.fields[newVariable.id] = newVariable;
			continue;
		} else if (element.classList.contains('sheetName')) {
			this.nameField = this.style.varFactory.createVariable(element, this.style, this);
			continue;
		}
		
		// Find and create Sheet_List objects
		var lists = element.getElementsByClassName('sheetList');
		for (var j = 0; j < lists.length; j++) {
			if (!this.isDeepList(lists[j])) continue;
			var newSheetList = new Sheet_List (lists[j], this.style, this);
			this.fields[newSheetList.id] = newSheetList;
			this.lists.push(newSheetList);
		}
		
		// Find and create Sheet_Button objects
		var deleteButtons = element.getElementsByClassName('deleteRow');
		for (var j = 0; j < deleteButtons.length; j++) {
			var newButton = new Button_DeleteRow(deleteButtons[j], this.style, this);
			this.buttons.push(newButton);
		}
		
		
		var autoButtons = element.getElementsByClassName('buttonAutomation');
		for (var j = 0; j < autoButtons.length; j++) {
			var newButton = new Button_Automation(autoButtons[j], this.style, this);
			this.buttons.push(newButton);
		}
		

		var addButtons = element.getElementsByClassName('addRow');
		for (var j = 0; j < addButtons.length; j++) {
			var newButton = new Button_AddRow(addButtons[j], this.style, this);
			this.buttons.push(newButton);
		}

		
		var diceButtons = element.getElementsByClassName('rollDice');
		for (var j = 0; j < diceButtons.length; j++) {
			var newButton = new Button_RollDice(diceButtons[j], this.style, this);
			this.buttons.push(newButton);
		}

		
		var diceButtons = element.getElementsByClassName('sortList');
		for (var j = 0; j < diceButtons.length; j++) {
			var newButton = new Button_SortList(diceButtons[j], this.style, this);
			this.buttons.push(newButton);
		}
		
		// Sheet_List will remove themselves from the DOM
		// It is now possible to search for variables
		var variables = element.getElementsByClassName("sheetVariable");
		for (var j = 0; j < variables.length; j++) {
			var newVariable = this.style.varFactory.createVariable(variables[j], this.style, this);
			this.fields[newVariable.id] = newVariable;
		}
		
		// Should I hold a name?
		if (this.parent === null && this.nameField === null) {
			var nameElement = element.getElementsByClassName('sheetName');
			if (nameElement.length > 0) {
				this.nameField = this.style.varFactory.createNameVariable(nameElement[0], this.style, this);
			}
		}
	};
	
	for (var key in this.fields) {
		this.ciKeys[key.replace(/\s/g, "").latinize().toUpperCase()] = key;
	};
}