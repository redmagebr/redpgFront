function Variable (element, style, parent, createInput, createTextnode) {
	createInput = createInput === undefined ? true : createInput;
	createTextnode = createTextnode === undefined ? true : createTextnode;
	this.style = style;
	this.visible = element;
	this.$visible = $(element);
	this.parent = parent;
	
	this.editing = false;
	
	/**
	 * Listeners
	 */
	this.listeners = {
		"changedVariable" : []
	};
	
	/**
	 * Dataset from element
	 */
	var data = this.visible.dataset;
	this.id = data.id === undefined ? this.style.getCustomID() : data.id;
	this.placeholder = data.placeholder === undefined ? "" : data.placeholder;
	this.defaultValue = data['default'] === undefined ? "" : data["default"];
	this.editable = data.editable === undefined ? true : (data.editable === "1" || data.editable === 'true');
	this.value = this.defaultValue;
	
	
	/**
	 * Input Element
	 */
	if (createInput) {
		this.input = document.createElement("input");
		this.input.type = "text";
		this.input.value = this.defaultValue;
		this.input.placeholder = this.placeholder;
		
		if (!this.editable) {
			this.input.disabled = true;
		}
		
		this.inputListener = {
			variable : this,
			input : this.input,
			handleEvent : function () {
				this.variable.storeValue(this.input.value);
			}
		};
		
		this.input.addEventListener("change", this.inputListener);
	}
	
	/**
	 * Text Node
	 */
	if (createTextnode) {
		this.textNode = document.createTextNode(this.defaultValue);
		while (this.visible.firstChild) {
			this.visible.removeChild(this.visible.firstChild);
		}
		this.visible.appendChild(this.textNode);
	}
	
	
	/**
	 * Default update function
	 */
	this.update = function () {
		if (this.editing !== this.style.editing) this.toggleEdit();
		if (this.editing && this.editable) {
			this.input.value = this.value;
		} else {
			this.textNode.nodeValue = this.getValue();
		}
	};
	
	/**
	 * Makes either the Input or the TextNode visible
	 */
	this.toggleEdit = function () {
		while (this.visible.firstChild) this.visible.removeChild(this.visible.firstChild);
		this.editing = !this.editing;
		if (this.editing && this.editable) {
			this.visible.appendChild(this.input);
		} else {
			this.visible.appendChild(this.textNode);
		}
	}
	
	this.validate = function (value) { return true; };
	
	/**
	 * Stores a new value
	 */
	this.storeValue = function (value) {
		if (!this.validate(value)) return;
		if (this.value !== value) {
			this.value = value;
			this.update();
			this.setChanged();
		}
	};
	
	this.reset = function () {
		this.storeValue(this.defaultValue);
	};
	
	/**
	 * Get the object that will be stored
	 */
	this.getObject = function () {
		return this.value;
	};
	
	/**
	 * Get useable value, often the same as the actual value
	 */
	this.getValue = function () {
		return this.value;
	};
	
	/**
	 * Utilize functions to avoid magic strings
	 */
	this.addChangedListener = function (handler) {
		this.addEventListener('changedVariable', handler);
	};
	
	this.triggerChanged = function (count) {
		this.trigger('changedVariable', count);
	};
	
	this.setChanged = function () {
		this.style.triggerChanged(this);
	};
	
	/**
	 * Trigger function.
	 * Treat as private.
	 */
	this.trigger = function (id, extra) {
		var listr = this.listeners[id];
		for (var i = 0; i < listr.length; i++) {
			try {
				if (typeof listr[i] === 'function') {
					listr[i](this, extra);
				} else {
					listr[i].handleEvent(this, extra);
				}
			} catch (e) {
				alert("This style has a bugged " + id + " Event Handler. More information on console (if debug mode is active)");
				console.log("Error on event handler for " + this.id + " on Style " + this.style.styleInstance.name + " for event " + id + ". Offending handler:");
				console.log(listr[i]);
			}
		}
	};
	
	this.addEventListener = function (id, handler) {
		if (this.listeners[id] === undefined) {
			this.listeners[id] = [];
		}
		this.listeners[id].push(handler);
	};
	
	this.takeMe = function (newMe) {
		for (var key in this) {
			newMe[key] = this[key];
		}
		
		if (this.inputListener !== undefined) {
			this.inputListener.variable = newMe;
		}
	};
	
	this.seppuku = function () {
		
	};
};

if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['text'] = Variable;