this.factor = 1;
this.lastFactor = 1;
this.centerX = 0;
this.centerY = 0;

this.fogMethod = 'add';

this.changeFogType = function (type) {
	this.fogMethod = type;
	
	if (this.fogMethod === 'remove') {
		this.elements.fogAddVision.classList.remove("toggled");
		this.elements.fogRemoveVision.classList.add("toggled");
	} else {
		this.elements.fogAddVision.classList.add("toggled");
		this.elements.fogRemoveVision.classList.remove("toggled");
	}
};

this.processFog = function (newFog) {
	var curFog = this.sheet.getField("Fog").getValue();
	
	var setFog = "";
	for (var i = 0; i < newFog.length; i++) {
		if (this.fogMethod === 'remove') {
			if (curFog.length <= i) {
				setFog += newFog.charAt(i);
				continue;
			}
			var fog = parseInt(newFog.charAt(i)) > parseInt(curFog.charAt(i)) ? newFog.charAt(i) : curFog.charAt(i);
		} else {
			var fogAdded = 9 - parseInt(newFog.charAt(i));
			if (curFog.length <= i) {
				setFog += fogAdded;
				continue;
			}
			var fog = fogAdded < parseInt(curFog.charAt(i)) ? fogAdded : curFog.charAt(i);
		}
		setFog += fog;
	}

	this.sheet.getField("Fog").storeValue(setFog);
	this.sheet.getField("hasFog").storeValue(true);
}

this.createToken = function () {
	var container = document.createElement("div");
	container.classList.add("token");
	
	var token = document.createElement("div");
	
	var picture = document.createElement("img");
	
	var arrow = document.createElement("a");
	
	container.appendChild(token);
	container.appendChild(arrow);
	token.appendChild(picture);
	
	var tokenObj = {
		container : container,
		arrow : arrow,
		token: token,
		picture : picture,
		setUrl : function (url) {
			this.picture.src = url;
			url = url.replace(/"/g, "\\\"");
			this.token.style.backgroundImage = "url(\"" + url + "\")";
		}
	};
	
	container.addEventListener("contextmenu", {
		token : tokenObj,
		style : this,
		handleEvent : function (ev) {
			ev.preventDefault();
			ev.stopPropagation();
			this.style.showTokenMenu(this.token, ev);
		}
	});
	
	container.addEventListener("click", {
		style : this,
		token : tokenObj,
		handleEvent : function (ev) {
			if (this.token.container.classList.contains('isDragging')) {
				this.token.container.classList.remove("isDragging");
				return;
			}
			this.style.showTokenMenu(this.token, ev);
		}
	});
	
	picture.addEventListener("error", {
		token : tokenObj,
		handleEvent : function () {
			this.token.token.style.backgroundImage = "url('img/tokenNotFound.png')";
		}
	});
	
	return tokenObj;
};

this.showTokenMenu = function (token, event) {
	this.currentToken = token.index;
	
	this.elements.mapTokenOptions.style.display = 'block';
	var sq = token.container.offsetWidth * this.factor;
	
	var sheetViewer = document.getElementById('sheetViewer');
	var maxWidth = sheetViewer.offsetWidth - (sq + 50);
	var maxHeight = sheetViewer.offsetHeight - (sq + 50);
	
	var x = token.container.offsetLeft * this.factor;
	x -= this.elements.mapView.scrollLeft;
	x += this.elements.mapView.offsetLeft;
	x -= 25;
	
	if (x < 0) {
		x = 0;
	} else if (x > maxWidth) {
		x = maxWidth;
	}
	
	var y = token.container.offsetTop * this.factor;
	y -= this.elements.mapView.scrollTop;
	y += this.elements.mapView.offsetTop;
	y -= 25;
	
	if (y < 0) {
		y = 0;
	} else if ((y) > maxHeight) {
		y = maxHeight;
	}

	$options = $(this.elements.mapTokenOptions).finish();

	this.elements.mapTokenOptions.style.left = (x + (sq + 50)/2) + "px";
	this.elements.mapTokenOptions.style.top = (y + (sq + 50)/2) + "px";
	this.elements.mapTokenOptions.style.width = "0px";
	this.elements.mapTokenOptions.style.height = "0px";
	
	$options.animate({
		width: (sq + 50),
		height: (sq + 50) + "px",
		left : x + "px",
		top : y + "px"
	}, 250);
};

/**
 * Show and hide things on edit
 */
this.mapToggleEdit = function () {
	if (this.editing) {
		this.elements.mapView.style.display = 'none';
		this.elements.mapButtons.style.display = 'none';
		this.elements.mapEdit.style.display = '';
	} else {
		this.elements.mapView.style.display = '';
		this.elements.mapButtons.style.display = '';
		this.elements.mapEdit.style.display = 'none';
	}
};


/**
 * Elements that are used elsewhere
 */
var elementsToFind = ['centerButton', 'fogAddVision', 'fogRemoveVision', 'fogCanvas', 'fogHideAll', 'fogShowAll', 'fogOptions', 'fogButton', 'mapTokenOptions', 'mapView', "mapTokens", 'mapEdit', 'mapCanvas', 'mapPicture', 'mapContainer', 'mapButtons', 'mapGrade', 'gridCanvas', 'mapZoomIn', 'mapZoomOut', 'fogDrawCanvas'];
this.elements = {};

for (var i = 0 ; i < elementsToFind.length; i++) {
	this.elements[elementsToFind[i]] = this.$visible.find("#" + elementsToFind[i])[0];
}

/**
 * Buttons
 */
this.updateButtons = function () {
	var buttons = ['mapGrade', 'fogButton', 'centerButton'];
	for (var i = 0; i < buttons.length; i++) {
		this.elements[buttons[i]].style.display = this.sheetInstance.editable ? '' : 'none';
	}
};

this.elements.fogAddVision.addEventListener('click', {
	style : this,
	handleEvent : function () {
		this.style.changeFogType('add');
	}
});

this.elements.fogRemoveVision.addEventListener('click', {
	style : this,
	handleEvent : function () {
		this.style.changeFogType('remove');
	}
});

for (var i = 0; i < this.elements.mapTokenOptions.children.length; i++) {
	var child = this.elements.mapTokenOptions.children[i];
	child.addEventListener("click", {
		style : this,
		me : child,
		handleEvent : function () {
			this.style.rotateToken(this.me.dataset.direction);
		}
	});
}

this.rotateToken = function (direction) {
	this.elements.mapTokenOptions.style.display = 'none';
	if (!this.sheetInstance.editable) {
		window.app.chatapp.printSystemMessage("_SHEETMAPSMOVEMENTREQUESTED_");
		this.sendCommand('rotateToken', {
			index : this.currentToken,
			direction : direction,
			sheetid : this.sheetInstance.id
		});
		return;
	}
	this.sheet.getField("Tokens").sheets[this.currentToken].getField("Rotation").storeValue(direction);
	window.app.ui.sheetui.controller.saveSheet();
};

this.elements['fogHideAll'].addEventListener('click', {
	style : this,
	handleEvent : function () {
		this.style.sheet.getField("hasFog").storeValue(true);
		this.style.sheet.getField("Fog").storeValue('');
	}
});

this.elements['fogShowAll'].addEventListener('click', {
	style : this,
	handleEvent : function () {
		this.style.sheet.getField("hasFog").storeValue(false);
		this.style.sheet.getField("Fog").storeValue('');
	}
});


this.elements['centerButton'].addEventListener("click", {
	style : this,
	handleEvent : function () {
		this.style.askforCenter();
	}
});

this.askforCenter = function () {
	var aHeight = this.elements['mapView'].clientHeight;
	var aWidth = this.elements['mapView'].clientWidth;
    
    y = this.elements['mapView'].scrollTop + (aHeight / 2);
    y = y / this.factor;
	x = this.elements['mapView'].scrollLeft + (aWidth / 2);
    x = x / this.factor;
	
	this.sendCommand('center', {
		x : x,
		y : y,
		sheetid : this.sheetInstance.id
	});
};

this.hasSheet = function (id) {
	return (window.app.sheetdb.getSheet(id) !== null && window.app.sheetdb.getSheet(id).values !== null);
};

this.interpretCommand = function (message) {
	if (message.localid !== null) return;
	
	
	
	if (message.msg === 'center') {
		
		if (!message.getUser().isStoryteller()) return; // STORYTELLER ONLY
		
		if (!this.hasSheet(message.getSpecial('sheetid'))) {
			return;
		}
		window.app.ui.sheetui.controller.openSheet(message.getSpecial('sheetid'));
		
		this.centerOn(message.getSpecial("x", 0), message.getSpecial("y", 0));
	} else if (message.msg === 'moveToken') {
		if (!this.sheetInstance.editable || this.sheetInstance.id !== message.getSpecial('sheetid')) return;
		
		// Can we move directly?
		if (!this.sheet.getField("autoMove").getValue()) {
			// not implemented
			return;
		}
		
		// Move Directly
		var tokenSheet = this.sheet.getField("Tokens").sheets[message.getSpecial('index', null)];
		tokenSheet.getField("X").storeValue(message.getSpecial("x", 0));
		tokenSheet.getField("Y").storeValue(message.getSpecial("y", 0));
		this.updateTokens();
		window.app.ui.sheetui.controller.saveSheet();
	} else if (message.msg === 'rotateToken') {
		if (!this.sheetInstance.editable || this.sheetInstance.id !== message.getSpecial('sheetid')) return;
		
		// Can we move directly?
		if (!this.sheet.getField("autoMove").getValue()) {
			// not implemented
			return;
		}
		
		// Move Directly
		this.currentToken = message.getSpecial('index', 0);
		var direction = message.getSpecial("direction", 0);
		this.rotateToken(direction);
	}
};