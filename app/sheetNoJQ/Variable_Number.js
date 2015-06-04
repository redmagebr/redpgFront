if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['number'] = function (element, style, parent) {
	var varb = new Variable(element, style, parent, true, true);
	varb.takeMe(this);
	varb = null;
	
	var data = this.visible.dataset;
	this.defaultValue = data['default'];
	
	if (isNaN(this.defaultValue, 10) || this.defaultValue === '') {
		this.defaultValue = 0;
	} else {
		this.defaultValue = parseFloat(this.defaultValue);
	}
	
	this.value = this.defaultValue;
	
	this.update();
	
	this.storeValue = function (value) {
		if (typeof value === 'string') {
			value = value.replace(/,/g, '.');
		}
		if (value === null || isNaN(value, 10)) {
			this.update();
		} else {
			value = parseFloat(value);
			value = +(value.toFixed(2));
			if (value !== this.value) {
				this.value = value;
				this.update();
				this.setChanged();
			}
		}
	};
}