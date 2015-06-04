if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['pointer'] = function (element, style, parent) {
	var varb = new Variable(element, style, parent, false, false);
	varb.takeMe(this);
	varb = null;
	
	this.update = function () {};
	
	var data = element.dataset;
	this.pointer = data.pointer === undefined ? null : data.pointer;

	var loadedObj = {
		pointer : this,
		handleEvent : function () {
			this.pointer.visible.parentNode.removeChild(this.pointer.visible);
			var obj = this.pointer.parent.getField(this.pointer.pointer);
			if (obj !== null) {
				var updObj = {
					pointer : this.pointer,
					handleEvent: function () {
						this.pointer.triggerChanged();
					}
				};
				
				obj.addChangedListener(updObj);
			}
		}
	};
	
	var parent = this.parent;
	while (parent.parent !== null) parent = parent.parent;
	parent.addLoadedListener(loadedObj);
	
	this.getObject = function () { return null; };
	this.getValue = function () {
		var obj = this.parent.getField(this.pointer);
		if (obj !== null) {
			return obj.getValue();
		}
		return null;
	};
};