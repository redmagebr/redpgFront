if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['select'] = function (element, style, parent) {
	var varb = new Variable(element, style, parent, false, true);
	varb.takeMe(this);
	varb = null;
	
	
	
	this.defaultValue = isNaN(this.defaultValue, 10) || this.defaultValue === "" ? 0 : parseInt(this.defaultValue);
	this.options = this.visible.dataset.options === undefined ? ["Undefined"] : this.visible.dataset.options.split(";");
	if (this.defaultValue < 0 || this.defaultValue > this.options.length) {
		this.defaultValue = 0;
	}
	this.value = this.defaultValue;
	
	this.input = document.createElement("select");
	this.updateOptions = function () {
		while (this.input.firstChild) this.input.removeChild(this.input.firstChild);
		for (var i = 0; i < this.options.length; i++) {
			var option = document.createElement("option");
			option.value = i;
			option.appendChild(document.createTextNode(this.options[i]));
			this.input.appendChild(option);
		}
		this.input.value = this.value;
	};
	this.updateOptions();
	
	this.inputListener = {
		variable : this,
		input : this.input,
		handleEvent : function () {
			this.variable.storeValue(this.input.value);
		}
	};
	
	this.input.addEventListener("change", this.inputListener);
	
	while (this.visible.firstChild) this.visible.removeChild(this.visible.firstChild);
	
	this.textNode.nodeValue = this.options[this.value];
	this.visible.appendChild(this.textNode);
	
	this.getValue = function () {
		return this.options[this.value];
	};

	this.textNode.nodeValue = this.getValue();

	this.update = function () {
		if (this.editing !== this.style.editing) {
			this.toggleEdit();
		}
		if (this.editing) {
			this.input.value = this.value.toString();
		} else {
			this.textNode.nodeValue = this.getValue();
		}
	};
	
	this.storeValue = function (idx) {
		if (typeof idx === 'string' && idx !== '' && isNaN(idx, 10)) {
			idx = this.options.indexOf(idx);
		}
		idx = idx === null || idx === ''? 0 : parseInt(idx);
		if (idx !== this.value && idx >= 0 && idx < this.options.length) {
			this.value = idx;
			this.update();
			this.setChanged();
		}
	};
	
	this.update();
}