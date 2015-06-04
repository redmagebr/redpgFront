if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['boolean'] = function (element, style, parent) {
	var varb = new Variable(element, style, parent, false, false);
	varb.takeMe(this);
	varb = null;
	
	var data = this.visible.dataset;
	if (data['default'] !== undefined) {
		this.defaultValue = data['default'] === "1" || data['default'].toUpperCase() === 'TRUE';
	} else {
		this.defaultValue = false;
	}
	this.value = this.defaultValue;
	
	this.personalid = this.style.getCustomID();
	
	
	this.checkbox = document.createElement("input");
	this.checkbox.type = "checkbox";
	this.checkbox.id = this.personalid;
	this.checkbox.checked = this.value;
	this.checkbox.disabled = true;
	this.visible.appendChild(this.checkbox);
	
	this.inputListener = {
		variable : this,
		checkbox : this.checkbox,
		handleEvent : function () {
			this.variable.storeValue(this.checkbox.checked);
		}
	};
	
	this.checkbox.addEventListener("change", this.inputListener);
	
	// Backwards compatibility
	if (data.labelhtml !== undefined) data.label = data.labelhtml;
	
	if (data.label !== undefined) {
		this.label = document.createElement("label");
		this.label.appendChild(document.createTextNode(data.label));
		this.label.setAttribute('for', this.personalid);
		this.visible.appendChild(this.label);
	}
	
	this.update = function () {
		this.checkbox.checked = this.value;
		if (this.editing !== this.style.editing) this.toggleEdit();
	};
	
	this.toggleEdit = function () {
		this.editing = !this.editing;
		this.checkbox.disabled = !this.editing && this.editable;
	}
	
	this.storeValue = function (value) {
		if (typeof value !== 'boolean') {
			value = (value === '1') || (value.toUpperCase() === "TRUE");
		}
		
		if (value !== this.value) {
			this.value = value;
			this.update();
			this.setChanged();
		}
	};
}