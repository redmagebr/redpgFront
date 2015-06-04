if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['simplelongtext'] = function (element, style, parent) {
	var varb = new Variable(element, style, parent, false, false);
	varb.takeMe(this);
	varb = null;
	
	this.validate = function (value) {
		return (typeof value === 'string');
	};
	
	var data = this.visible.dataset;
	this.autoresize = data.autoresize === undefined ? true : (data.autoresize === "1" || data.autoresize === 'true');
	this.emptyParagraph = data.emptyparagraph === undefined ? true : (data.emptyparagraph === "1" || data.emptyparagraph === 'true');

	while (this.visible.firstChild) this.visible.removeChild(this.visible.firstChild);

	this.fakeInput = document.createElement("textarea");
	this.fakeInput.style.height = 'auto';
	this.input = document.createElement("textarea");
	this.input.value = this.defaultValue;
	this.input.placeholder = this.placeholder;
	
	this.inputListener = {
		variable : this,
		input : this.input,
		handleEvent : function () {
			this.variable.storeValue(this.input.value);
		}
	};
	
	this.input.addEventListener("change", this.inputListener);
	
	this.resize = function () {
		if (!this.autoresize) return;
		this.visible.appendChild(this.fakeInput);
		this.fakeInput.value = this.input.value;
		if (this.fakeInput.scrollHeight < 20) {
			this.input.style.height = "";
		} else {
			this.input.style.height = this.fakeInput.scrollHeight + "px";
		}
		this.visible.removeChild(this.fakeInput);
	};
	
	if (this.autoresize) {
		this.autoresizer = {
			variable : this,
			handleEvent : function () {
				this.variable.resize();
			}
		};
	
		this.input.addEventListener("change", this.autoresizer);
		this.input.addEventListener("keyup", this.autoresizer);
		this.input.addEventListener("click", this.autoresizer);
	}
	
	this.textNodes = [];
	this.brs = [];
	
	this.createTextNode = function (string) {
		var newNode = document.createTextNode(string);
		this.textNodes.push(newNode);
	};
	
	this.createBr = function () {
		this.brs.push(document.createElement("br"));
	};
	
	this.empty = function () {
		while (this.visible.firstChild) this.visible.removeChild(this.visible.firstChild);
	};
	
	this.update = function () {
		if (this.editing !== this.style.editing) this.toggleEdit();
		if (this.editing && this.editable) {
			this.input.value = this.value;
			this.resize();
		} else {
			this.empty();
			// ADD TEXT NODES
			var lines = this.value.split(/\r\n|\r|\n/);
			var goodlines = [];
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i].trim();
				if (line === "") {
					if (!this.emptyParagraph) continue;
					line = String.fromCharCode(160);
				}
				goodlines.push(line);
			}
			
			// Create BRs
			while (this.brs.length < (goodlines.length - 1)) this.createBr();
			var br = 0;
			for (var i = 0; i < goodlines.length; i++) {
				if (this.textNodes.length > i) {
					this.textNodes[i].nodeValue = goodlines[i];
				} else {
					this.createTextNode(goodlines[i]);
				}
				this.visible.appendChild(this.textNodes[i]);
				if ((i + 1) < goodlines.length) {
					this.visible.appendChild(this.brs[br++])
				}
			}
		}
	}
	
	this.toggleEdit = function () {
		while (this.visible.firstChild) this.visible.removeChild(this.visible.firstChild);
		this.editing = !this.editing;
		if (this.editing && this.editable) {
			this.visible.appendChild(this.input);
		}
	};
}