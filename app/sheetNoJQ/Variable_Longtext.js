if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['longtext'] = function (element, style, parent) {
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
	
	// P = {p : DOMElement, text : DOMtext}
	this.pool = [];
	this.p = [];
	
	this.createP = function (value) {
		// Add non-breaking space
		if (this.pool.length > 0) {
			var p = this.pool.pop();
			p.text.nodeValue = value;
		} else {
			var p = {
				p : document.createElement("p"),
				text : document.createTextNode(value)
			};
			p.p.appendChild(p.text);
		}
		return p;
	};
	
	this.input = document.createElement("textarea");
	this.fakeInput = document.createElement("textarea");
	this.fakeInput.style.height = 'auto';
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
		if (!this.editing) return;
		this.fakeInput.value = this.input.value;
		this.visible.appendChild(this.fakeInput);
		var foundHeight = this.fakeInput.scrollHeight;
		if (foundHeight < 20) {
			this.input.style.height = "";
		} else {
			this.input.style.height = foundHeight + "px";
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
	
	this.update = function () {
		if (this.editing !== this.style.editing) this.toggleEdit();
		if (this.editing) {
			if (this.value !== this.input.value) {
				this.input.value = this.value;
				this.resize();
			}
		} else {
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
			while (goodlines.length < this.p.length) {
				var p = this.p.pop();
				this.pool.push(p);
				this.visible.removeChild(p.p);
			}
			for (var i = 0; i < goodlines.length; i++) {
				var line = goodlines[i];
				if ((i+1) > this.p.length) {
					var p = this.createP(line);
					this.visible.appendChild(p.p);
					this.p.push(p);
				} else {
					this.p[i].text.nodeValue = line;
				}
			}
		}
	};
	
	this.toggleEdit = function () {
		while (this.visible.firstChild) this.visible.removeChild(this.visible.firstChild);
		this.editing = !this.editing;
		if (this.editing) {
			this.visible.appendChild(this.input);
		} else {
			for (var i = 0; i < this.p.length; i++) {
				this.visible.appendChild(this.p[i].p);
			}
		}
	};
}