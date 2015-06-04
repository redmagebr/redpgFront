if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['name'] = function (element, style, parent) {
	var varb = new Variable(element, style, parent);
	for (var key in varb) {
		this[key] = varb[key];
	}
	varb = null;


	/**
	 * Settings
	 */
	var data = this.visible.dataset;
	
	this.id = "SheetName_" + style.id;
	this.placeholder = data.placeholder === undefined ? "" : data.placeholder;
	this.defaultValue = data['default'] === undefined ? "" : data["default"];
	

	/**
	 * Input Element
	 */
	this.input = document.createElement("input");
	this.input.type = "text";
	this.input.value = this.defaultValue;
	this.input.placeholder = this.placeholder;

	/**
	 * Input Change Listener
	 */
	this.inputListener = {
		variable : this,
		input : this.input,
		handleEvent : function () {
			this.variable.storeValue(this.input.value);
		}
	};
	
	this.input.addEventListener("change", this.inputListener);

	/**
	 * Text Node
	 */
	this.textNode = document.createTextNode(this.defaultValue);
	while (this.visible.firstChild) {
		this.visible.removeChild(this.visible.firstChild);
	}
	this.visible.appendChild(this.textNode);
	
	this.editing = false;

	/**
	 * Updates the visible element
	 */
	this.update = function () {
		if (this.editing !== this.style.editing) this.toggleEdit();
		if (this.editing) {
			this.input.value = this.value;
		} else {
			this.textNode.nodeValue = this.value;
		}
	};
	
	/**
	 * Stores a new value
	 */
	this.storeValue = function (str) {
		if (this.value !== str) {
			this.value = str;
			this.update();
			this.style.sheetInstance.name = this.value;
			this.setChanged();
		}
	};
	
	/**
	 * Makes either the Input or the TextNode visible
	 */
	this.toggleEdit = function () {
		this.visible.removeChild(this.visible.firstChild);
		this.editing = !this.editing;
		if (this.editing) {
			this.visible.appendChild(this.input);
		} else {
			this.visible.appendChild(this.textNode);
		}
	};
}