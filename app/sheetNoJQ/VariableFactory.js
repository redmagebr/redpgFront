function VariableFactory () {
	this.defaultType = "text";
	
	this.createVariable = function (element, style, parent) {
		type = element.dataset.type;
		if (type === undefined || window.sheetVariableTypes[type] === undefined) {
			 var type = this.defaultType;
		}
		
		return new window.sheetVariableTypes[type](element, style, parent);
	}
	
	this.createNameVariable = function (element, style, parent) {
		return new window.sheetVariableTypes['name'](element, style, parent);
	};
	
	this.createNull = function () {
		return new Variable_Null();
	};
}

if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};