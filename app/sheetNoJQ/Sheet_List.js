function Sheet_List (element, style, parent) {
	this.visible = element;
	this.$visible = $(element);
	this.style = style;
	this.parent = parent;
	
	this.listeners = {
		changedVariable : [],
		addedRow : [],
		removedRow : [],
		createdRow : []
	};
	
	var data = element.dataset;
	this.key = data.key === undefined ? null : data.key;
	this.valueKey = data.valuekey === undefined ? null : data.valuekey;
	this.order = data.order === undefined ? [] : data.order.split(';');
	
	this.sheetElements = [];
	
	while (this.visible.firstChild) {
		this.sheetElements.push(this.visible.firstChild);
		this.visible.removeChild(this.visible.firstChild);
	}
	
	this.id = this.visible.dataset.id === undefined ? this.style.getCustomID : this.visible.dataset.id;
	try {
		this.defaultValue = this.visible.dataset['default'] === undefined ? [] : JSON.parse(this.visible.dataset['default']);
	} catch (e) {
		alert("Invalid Default Value for List " + this.id + " on style " + this.style.id + ", " + this.style.styleInstance.name + ".");
		this.defaultValue = [];
	}
	
	this.sheetPool = [];
	this.sheets = [];
	
	this.addRow = function () {
		if (this.sheetPool.length === 0) {
			var newElements = [];
			for (var i = 0; i < this.sheetElements.length; i++) {
				var newNode = this.sheetElements[i].cloneNode(true);
				this.visible.appendChild(newNode);
				newElements.push(newNode);
			}
			var newSheet = new Sheet (newElements, style, this);
			newSheet.update();
			newSheet.triggerLoaded();
			this.triggerCreatedRow(newSheet);
		} else {
			// Lavou tá novo
			var newSheet = this.sheetPool.pop();
			for (var i = 0; i < newSheet.visible.length; i++) {
				this.visible.appendChild(newSheet.visible[i]);
			}
			newSheet.reset();
		}
		this.sheets.push(newSheet);
		this.triggerAddedRow(newSheet);
		this.setChanged();
		return newSheet;
	};
	
	this.removeLastRow = function () {
		this.removeRow(this.sheets.length - 1);
	};
	
	this.removeRowByRow = function (row) {
		this.removeRow(this.sheets.indexOf(row));
	};
	
	this.removeRow = function (index) {
		if (index >= 0 && index < this.sheets.length) {
            oldRow = this.sheets[index];
            this.sheets.splice(index, 1);
            for (var i = 0; i < oldRow.visible.length; i++) {
				this.visible.removeChild(oldRow.visible[i]);
			}
            this.sheetPool.push(oldRow);
            this.triggerRemovedRow(oldRow);
            this.setChanged();
        }
	};
	
	this.storeValue = function (value) {
		if (!Array.isArray(value)) return;
		if (this.sheets.length !== value.length) {
			this.setChanged();
		}
		for (var i = 0; i < value.length; i++) {
			if ((i + 1) > this.sheets.length) {
				this.addRow();
			}
			this.sheets[i].storeValue(value[i]);
		}
		while (this.sheets.length > value.length) {
			this.removeLastRow();
		}
	};
	
	this.reset = function () {
		this.storeValue(this.defaultValue);
	};
	
	this.update = function () {
		for (var i = 0; i < this.sheets.length; i++) {
			this.sheets[i].update();
		}
	};
	
	this.getObject = function () {
		var obj = [];
		for (var i = 0; i < this.sheets.length; i++) {
			obj.push(this.sheets[i].getObject());
		}
		return obj;
	};
	
	this.setChanged = function () {
		this.style.triggerChanged(this);
	};
	
	this.triggerChanged = function (count) {
		this.trigger('changedVariable', count);
	};
	
	this.triggerAddedRow = function (row) {
		this.trigger('addedRow', row);
	};
	
	this.triggerCreatedRow = function (row) {
		this.trigger('createdRow', row);
	};
	
	this.triggerRemovedRow = function (row) {
		this.trigger('removedRow', row);
	};
	
	this.addChangedListener = function (handler) {
		this.addEventListener('changedVariable', handler);
	};
	
	this.addAddedRowListener = function (handler) {
		this.addEventListener('addedRow', handler);
	};
	
	this.addCreatedRowListener = function (handler) {
		this.addEventListener('createdRow', handler);
	};
	
	this.addRemovedRowListener = function (handler) {
		this.addEventListener('removedRow', handler);
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
	
	this.sortFunction = function(a,b) {
		var order = a.parent.order;
		for (var i = 0; i < order.length; i++) {
			if (a.fields[order[i]] === undefined) continue;
			var vA = a.getField(order[i]).getValue();
			var vB = b.getField(order[i]).getValue();
			if (typeof vA === "string") {
				vA = vA.latinize().toUpperCase();
				vB = vB.latinize().toUpperCase();
			} else if (Array.isArray(vA)) {
				vA = vA.length > 0 ? vA.reduce(function(a, b) { return a + b }) : 0;
				vB = vB.length > 0 ? vB.reduce(function(a, b) { return a + b }) : 0;
			}
			if (vA < vB) return -1;
			if (vA > vB) return 1;
		}
		return 0;
	};
	
	this.sort = function () {
		while (this.visible.firstChild) this.visible.removeChild(this.visible.firstChild);
		
		this.sheets.sort(this.sortFunction);
		
		for (var i = 0; i < this.sheets.length; i++) {
			newSheet = this.sheets[i];
			for (var k = 0; k < newSheet.visible.length; k++) {
				this.visible.appendChild(newSheet.visible[k]);
			}
		}
		
		this.setChanged();
	};
	
	/** Return an Array of Numbers representing this List */
	this.getValue = function () {
		if (this.valueKey === null) {
			return NaN;
		}
		var results = [];
		for (var i = 0; i < this.sheets.length; i++) {
			results.push(this.sheets[i].getValueFor(this.valueKey))
		}
		
		if (results.length === 0) return 0;
		return results;
	};
	
	this.getValueFor = function (id) {
		if (this.key === null || this.valueKey === null) return null;
		try {
			for (var i = 0; i < this.sheets.length; i++) {
				var row = this.sheets[i];
				var name = row.getField(this.key).getValue();
				name = name.toString().replace(/\s/g, "").latinize().toUpperCase();
				if (name === id) {
					var value = row.getField(this.valueKey).getValue();
					if (Array.isArray(value)) return value;
					return parseFloat(value);
				}
			}
			return null;
		} catch (e) {
			console.log("Faulty key/valueKey for list " + this.id + ".");
			return null;
		}
//		for (var k = 0; k < this.lists[i].sheets.length; k++) {
//			var field = this.lists[i].sheets[k].getField(this.lists[i].key);
//			if (field === null) break;
//			if (field.getValue().toUpperCase() === id.toUpperCase()) {
//				var value = this.lists[i].sheets[k].getField[this.lists[i].valueKey];
//				if (value !== null) {
//					value = value.getValue();
//					if (isNaN(value, 10)) return NaN;
//					return parseFloat(value);
//				}
//			}
//		}
	};
	
	this.resizeBoxes = function () {
		for (var i = 0; i < this.sheets.length; i++) {
			this.sheets[i].resizeBoxes();
		}
	};
	
	this.seppuku = function () {
		for (var i = 0; i < this.sheets.length; i++) {
			this.sheets[i].seppuku();
		}
		for (var i = 0; i < this.sheetPool.length; i++) {
			this.sheetPool[i].seppuku();
		}
	};
}