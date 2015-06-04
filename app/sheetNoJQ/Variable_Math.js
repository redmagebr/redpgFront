if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['math'] = function (element, style, parent) {
	var varb = new Variable(element, style, parent, true, true);
	varb.takeMe(this);
	varb = null;
	
	var data = this.visible.dataset;
	this.integer = data.integer === undefined ? false : true;
	
	var parent = this.parent;
	
	this.lastLoaded = -1;
	
	var loadedObj = {
		math : this,
		handleEvent : function () {
			this.math.setDependencies();
			this.math.update();
		}
	};
	
	while (parent.parent !== null) parent = parent.parent;
	parent.addLoadedListener(loadedObj);
	
	this.setDependencies = function () {
		if (this.editable) { return; }
		var updObj = {
			math : this,
			handleEvent : function (who, count) {
				if (count !== this.math.lastLoaded || count === undefined) {
					this.math.lastLoaded = count;
					this.math.update();
				}
			}
		};
		
		var scope = this.getScope();
		var takeLists = false;
		var parent = this.parent;
		while (parent.parent !== null) parent = parent.parent;
		for (key in scope) {
			if (parent.getFieldByName(key) !== null) {
				parent.getFieldByName(key).addChangedListener(updObj);
			} else {
				takeLists = true;
			}
		}
		if (takeLists) {
			for (var i = 0; i < parent.lists.length; i++) {
				if (parent.lists[i].key === null || parent.lists[i].valueKey === null) continue;
				parent.lists[i].addChangedListener(updObj);
			}
		}
	};
	
	this.reParse = function () {
		var value = this.value.replace(/\s/g, "").latinize();
		try {
			this.parsed = math.parse(value);
			this.compiled = math.compile(value);
		} catch (e) {
			this.parsed = math.parse("0");
			this.compiled = math.compile("0");
		}
	};
	this.reParse();
	
	this.getScope = function () {
		var scope = {};
		
		var nodes = this.parsed.filter(function (node) {
		    return node.type == 'SymbolNode';
		});
		
		for (var i = 0; i < nodes.length; i++) {
			scope[nodes[i].name] = 0;
		}
		
		return scope;
	};
	
	this.getObject = function () {
		if (this.editable) {
			return this.value;
		} else {
			return null;
		}
	};
	
	this.lastValue = null;
	this.getValue = function () {
		var scope = this.getScope();
		this.style.fillScope(scope,this);
		
		try {
			var value = + this.compiled.eval(scope).toFixed(2);
			if (value !== this.lastValue) {
				this.lastValue = value;
				this.triggerChanged();
			}
			return value;
		} catch (e) {
			return NaN;
		}
	};
	
	this.reset2 = this.reset;
	this.reset = function () {
		this.reset2();
		this.update();
	};
	
	this.storeValue = function (value) {
		//value = value.replace(/\s/g, "").latinize();
		if (this.value !== value) {
			this.value = value;
			this.reParse();
			this.update();
			this.setChanged();
		}
	};
};