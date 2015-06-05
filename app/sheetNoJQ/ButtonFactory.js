function ButtonFactory () {
	this.defaultType = "automation";
	
	this.createButton = function (element, style, parent) {
		type = element.dataset.type;
		if (type === undefined || window.sheetButtonTypes[type] === undefined) {
			 var type = this.defaultType;
		}
		
		return new window.sheetButtonTypes[type](element, style, parent);
	}
}

if (window.sheetButtonTypes === undefined || window.sheetButtonTypes === null)
	window.sheetButtonTypes = {};