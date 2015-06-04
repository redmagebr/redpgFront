function Variable_Null () {
	this.getObject = function () {
		return null;
	};
	
	this.seppuku = function () {};
}

if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['null'] = Variable_Null;