if (window.sheetVariableTypes === undefined || window.sheetVariableTypes === null)
	window.sheetVariableTypes = {};

window.sheetVariableTypes['image'] = function (element, style, parent) {
	var varb = new Variable(element, style, parent, false, false);
	varb.takeMe(this);
	varb = null;
	
	this.defaultValue = ['0', null];
	this.value = ['0', null];
	
	this.input = document.createElement("select");
	this.updateOptions = function (lazy) {
		lazy = lazy === undefined ? false : lazy;
		if (lazy) {
			for (var i = 0; i < this.input.options.length; i++) {
				if (this.input.options[i].value === this.value[0]) {
					return;
				}
			}
		}
		while (this.input.firstChild) this.input.removeChild(this.input.firstChild);
		var option = document.createElement("option");
		option.className = "language";
		option.dataset['langhtml'] = "_SHEETCOMMONSPICKIMAGENONE_";
		option.value = '0';
		option.appendChild(document.createTextNode(window.app.ui.language.getLingo("_SHEETCOMMONSPICKIMAGENONE_")));
		this.input.appendChild(option);
		
		var folders = {};
		var foldersOrdered = [];
		var currentOption = null;
		for (var i = 0; i < window.app.imagedb.imagesOrdered.length; i++) {
            var image = window.app.imagedb.imagesOrdered[i];
            var imageo = document.createElement("option");
            imageo.value = image.getUrl();
            imageo.appendChild(document.createTextNode(image.getName()));
            if (folders[image.folder] === undefined) {
            	folders[image.folder] = document.createElement("optgroup");
            	if (image.folder === '') {
                	folders[image.folder].setAttribute('label', window.app.ui.language.getLingo("_SHEETCOMMONSPICKIMAGENOFOLDER_"));
            	} else {
            		folders[image.folder].setAttribute('label', image.folder);
            	}
            	foldersOrdered.push(image.folder);
            }
            folders[image.folder].appendChild(imageo);
            
            if (imageo.value === this.value[0]) {
            	currentOption = imageo;
            }
		}
		
		
		
		foldersOrdered.sort();
		
		for (var i = 0; i < foldersOrdered.length; i++) {
			this.input.appendChild(folders[foldersOrdered[i]]);
		}
		
		if (currentOption === null) {
			if (this.value[0] !== '0') {
				var imageo = document.createElement("option");
				imageo.value = this.value[0];
				imageo.appendChild(document.createTextNode(this.value[1]));
				if (this.input.childNodes.length > 1) {
					this.input.insertBefore(imageo, this.input.childNodes[1]);
				} else {
					this.input.appendChild(imageo);
				}
			}
		} else {
			currentOption.selected = true;
		}
		
		if (i === 0) {
			// LOAD IMAGES
		}
	};
	this.updateOptions();
	
	this.inputListener = {
		variable : this,
		input : this.input,
		handleEvent : function () {
			var index = this.input.selectedIndex;
			
			this.variable.storeValue([this.input.value, this.input.options[index].firstChild.nodeValue]);
		}
	};
	
	this.input.addEventListener("change", this.inputListener);
	
	while (this.visible.firstChild) this.visible.removeChild(this.visible.firstChild);
	
	this.textNode = document.createElement("img");
	if (this.value[0] !== "0") {
		this.textNode.src = this.value[0];
		this.textNode.style.display = '';
	} else {
		this.textNode.style.display = "none";
	}
	this.visible.appendChild(this.textNode);
	
//	this.textNode.nodeValue = this.options[this.value];
//	this.visible.appendChild(this.textNode);

	this.update = function () {
		if (this.editing !== this.style.editing) {
			this.toggleEdit();
		}
		if (this.editing) {
			this.input.value = this.value[0];
		} else {
			this.textNode.src = this.value[0];
			this.textNode.style.display = (this.value[0] !== '0') ? '' : 'none';
		}
	};
	
	this.storeValue = function (obj) {
		if (!Array.isArray(obj) || obj.length !== 2
				|| (obj[0] === this.value[0] && obj[1] === this.value[1])      ) {
			return false;
		}
		this.value = obj;
		this.updateOptions(true);
		this.update();
		this.setChanged();
	};
	
	this.imageListUpdateHandler = {
		variable : this,
		handleEvent : function () {
			this.variable.updateOptions();
		}
	};
	
	window.app.imagedb.addListener(this.imageListUpdateHandler);
	
	this.getObject = function () {
		if (this.value[1] === null) {
			return null;
		}
		return this.value;
	}
	
	this.seppuku = function () {
		window.app.imagedb.removeListener(this.imageListUpdateHandler);
	};
}