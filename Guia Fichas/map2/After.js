this.elements['fogDrawCanvas'].addEventListener("mousedown", {
	style : this,
	handleEvent : function (ev) {
		this.style.drawFog(ev, true);
	}
});

this.elements['fogDrawCanvas'].addEventListener("mousemove", {
	style : this,
	handleEvent : function (ev) {
		this.style.drawFog(ev, false);
	}
});

this.elements['fogDrawCanvas'].addEventListener("mouseup", {
	style : this,
	handleEvent : function (ev) {
		this.style.drawFog(null, false);
	}
});

this.elements['fogDrawCanvas'].addEventListener("mouseout", {
	style : this,
	handleEvent : function (ev) {
		this.style.drawFog(null, false);
	}
});

this.elements['mapGrade'].addEventListener("click", {
	style: this,
	handleEvent : function () {
		this.style.toggleGrade();
	}
});

this.elements['fogButton'].addEventListener("click", {
	style: this,
	handleEvent : function () {
		this.style.toggleFogDesigner();
	}
});

this.toggleGrade = function () {
	if (this.elements['gridCanvas'].style.display === 'block') {
		this.elements['mapCanvas'].style.display = 'block';
		this.elements['gridCanvas'].style.display = 'none';
		return;
	}
	if (this.elements['fogDrawCanvas'].style.display === 'block') {
		this.toggleFogDesigner();
	}
	this.elements['mapCanvas'].style.display = 'none';
	this.elements['gridCanvas'].style.display = 'block';
	this.elements['gridCanvas'].width = this.elements['mapPicture'].naturalWidth;
	this.elements['gridCanvas'].height = this.elements['mapPicture'].naturalHeight;
};

this.toggleFogDesigner = function () {
	if (this.elements['fogDrawCanvas'].style.display === 'block') {
		this.elements['fogDrawCanvas'].style.display = 'none';
		this.elements.fogOptions.style.display = 'none';
		return;
	}
	if (this.elements['gridCanvas'].style.display === 'block') {
		this.toggleGrade();
	}
	this.elements['fogDrawCanvas'].style.display = 'block';
	this.elements.fogOptions.style.display = 'block';
	this.elements['fogDrawCanvas'].width = this.elements['mapPicture'].naturalWidth;
	this.elements['fogDrawCanvas'].height = this.elements['mapPicture'].naturalHeight;
};

this.elements['gridCanvas'].addEventListener('mousedown', {
	style : this,
	handleEvent : function (e) {
		this.style.drawGrade(e.offsetX, e.offsetY, true);
	}
});

this.elements['gridCanvas'].addEventListener('mousemove', {
	style : this,
	handleEvent : function (e) {
		this.style.drawGrade(e.offsetX, e.offsetY, false);
	}
});

this.elements['gridCanvas'].addEventListener('mouseup', {
	style : this,
	handleEvent : function (e) {
		this.style.drawGrade(null, null, false);
	}
});

this.gradeStartX = null;
this.gradeEndX = null;
this.gradeStartY = null;
this.gradeEndY = null;
this.drawGrade = function (x, y, start) {
	if (start) {
		this.gradeStartX = x;
		this.gradeStartY = y;
		return;
	} else if (this.gradeStartX === null || this.gradeStartY === null) {
		return;
	}
	
	if (x === null || y === null) {
		var squireSize = Math.abs(this.gradeStartX - this.gradeEndX);
		if (squireSize > 2) {
			var sqx = this.gradeStartX;
			while (sqx > 0) sqx -= squireSize;
			if (sqx < 0) sqx += squireSize;
			
			var sqy = this.gradeStartY;
			while (sqy > 0) sqy -= squireSize;
			if (sqy < 0) sqy += squireSize;
	
			this.sheet.getField("offsetX").storeValue(sqx);
			this.sheet.getField("offsetY").storeValue(sqy);
			this.sheet.getField("squareSize").storeValue(squireSize);
			this.sheet.getField("Fog").storeValue("");
			
			this.gradeStartX = null;
			this.gradeStartY = null;
		}
		this.toggleGrade();
		window.app.ui.sheetui.controller.saveSheet();
		return;
	}
	
	var width = this.elements['gridCanvas'].width;
	var height = this.elements['gridCanvas'].height;
	
	var canvas = this.elements['gridCanvas'];
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "#00FF00";
	ctx.lineWidth = 1;	
	
	var squireSize = Math.abs(this.gradeStartX - x);
	if (squireSize > 2) {
		this.gradeEndX = x;
		this.gradeEndY = y;
		var sqx = this.gradeStartX;
		while (sqx > 0) sqx -= squireSize;
		if (sqx < 0) sqx += squireSize;
		
		var sqy = this.gradeStartY;
		while (sqy > 0) sqy -= squireSize;
		if (sqy < 0) sqy += squireSize;
		
		while (sqx < width) {
			ctx.beginPath();
			ctx.moveTo(sqx, 0);
			ctx.lineTo(sqx, height);
			ctx.stroke();
			sqx += squireSize;
		}
		
		while (sqy < height) {
			ctx.beginPath();
			ctx.moveTo(0, sqy);
			ctx.lineTo(width, sqy);
			ctx.stroke();
			sqy += squireSize;
		}
	}
}


this.updateEverything = function () {
	this.updateButtons();
	this.updateCanvas();
	this.updateFog();
	this.updateTokens();
	this.changeFactor(0);
	this.updateSizes();
};

var updateMyCanvas = {
	style : this,
	lastCount : null,
	handleEvent : function (who, count) {
		if (count === this.lastCount) return;
		this.lastCount = count;
		this.style.updateEverything();
	}
};
this.sheet.getField("hasGrid").addChangedListener(updateMyCanvas);
this.sheet.getField("offsetX").addChangedListener(updateMyCanvas);
this.sheet.getField("offsetY").addChangedListener(updateMyCanvas);
this.sheet.getField("squareSize").addChangedListener(updateMyCanvas);

this.elements['mapZoomIn'].addEventListener('click', {
	style : this,
	handleEvent : function () {
		this.style.changeFactor(0.2)
	}
});

this.elements['mapZoomOut'].addEventListener('click', {
	style : this,
	handleEvent : function () {
		this.style.changeFactor(-0.2)
	}
});

this.changeFactor = function (amount) {
	var nWidth = this.elements['mapPicture'].naturalWidth;
	var nHeight = this.elements['mapPicture'].naturalHeight;

	var aHeight = this.elements['mapView'].clientHeight;
	var aWidth = this.elements['mapView'].clientWidth;
	
	this.factor += amount;
	
	if (aWidth/nWidth > aHeight/nHeight) {
		var minF = aWidth/nWidth;
	} else {
		var minF = aHeight/nHeight;
	}
	
	if (this.factor < minF) this.factor = minF;
	if (this.factor > 4) this.factor = 4;

	this.elements.mapTokens.style.height = nHeight + "px";
	this.elements.mapTokens.style.width = nWidth + "px";
	
	this.updateSizes();
};

var updFog = {
		lastCount : null,
		style : this,
		handleEvent : function (who, count) {
			if (count === this.lastCount) return;
			this.lastCount = count;
			this.style.updateFog();
			this.style.updateTokens();
		}
	};

	this.sheet.getField('hasFog').addChangedListener(updFog);
	this.sheet.getField('Fog').addChangedListener(updFog);

this.updateFog = function () {
	var canvas = this.elements['fogCanvas'];
	
	canvas.width = this.elements['mapCanvas'].width;
	canvas.height = this.elements['mapCanvas'].height;
	
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	if (!this.sheet.getField("hasFog").getValue()) return;
	
	var fog = this.sheet.getField("Fog").getValue();
	
	var width = canvas.width;
	var height = canvas.height;
	
	var squareSize = this.sheet.getField("squareSize").getValue();
	var offsetX = this.sheet.getField("offsetX").getValue();
	var offsetY = this.sheet.getField("offsetY").getValue();

	var squaresX = parseInt((width - offsetX)/squareSize);
	var squaresY = parseInt((height - offsetY)/squareSize);
	
	ctx.fillStyle = "rgba(0,0,0,1)";
	ctx.fillRect(0,0,offsetX,height);
	ctx.fillRect((offsetX + (squaresX * squareSize)), 0, width, height);
	ctx.fillRect(0,0,width,offsetY);
	ctx.fillRect(0, (offsetY + (squaresY * squareSize)), width, height);
	ctx.stroke();
	
	var i = 0;
	for (var y = 0; y < squaresY; y++) {
		for (var x = 0; x < squaresX; x++) {
			if (fog.length > i) {
				var alpha = parseInt(fog.charAt(i)) / 9;
			} else {
				var alpha = 1;
			}
			
			if (this.sheetInstance.editable) {
				alpha = alpha / 1.25;
			}
			ctx.fillStyle = "rgba(0,0,0," + alpha + ")";
			posx = offsetX + (x * squareSize);
			posy = offsetY + (y * squareSize);
			ctx.fillRect(posx, posy, squareSize, squareSize);
			ctx.stroke();
			i++;
		}
	}
};

this.isFog = function (x, y) {
	if (!this.sheet.getField("hasFog").getValue()) return false;
	
	var width = this.elements['mapCanvas'].width;
	
	var squareSize = this.sheet.getField("squareSize").getValue();
	var offsetX = this.sheet.getField("offsetX").getValue();

	var squaresX = parseInt((width - offsetX)/squareSize);
	
	var fog = this.sheet.getField("Fog").getValue();
	
	var arrayPos = (squaresX * y) + x;
	
	return (fog.length <= arrayPos || parseInt(fog.charAt(arrayPos)) > 4);
};

this.updateCanvas = function () {
	this.elements['mapCanvas'].width = this.elements['mapPicture'].naturalWidth;
	this.elements['mapCanvas'].height = this.elements['mapPicture'].naturalHeight;
	
	if (this.elements.mapCanvas.width > 0) {
		this.elements.mapContainer.style.display = '';
	}
	
	var canvas = this.elements['mapCanvas'];
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1;

	if (!this.sheet.getField("hasGrid").getValue()) return;
	
	var width = this.elements['mapCanvas'].width;
	var height = this.elements['mapCanvas'].height;
	
	var squareSize = this.sheet.getField("squareSize").getValue();
	var offsetX = this.sheet.getField("offsetX").getValue();
	var offsetY = this.sheet.getField("offsetY").getValue();
	
	while (offsetX < width) {
		ctx.beginPath();
		ctx.moveTo(offsetX, 0);
		ctx.lineTo(offsetX, height);
		ctx.stroke();
		offsetX += squareSize;
	}
	
	while (offsetY < height) {
		ctx.beginPath();
		ctx.moveTo(0, offsetY);
		ctx.lineTo(width, offsetY);
		ctx.stroke();
		offsetY += squareSize;
	}
};

this.tokens = [];
this.updateTokens = function () {
	while (this.tokens.length < this.sheet.getField("Tokens").sheets.length) {
		var newToken = this.createToken();
		newToken.index = this.tokens.push(newToken) - 1;
		newToken.isNew = true;
		$(newToken.container).draggable({
            containment : '#mapView',
            start : function (ev, ui) {
            	document.getElementById("mapTokenOptions").style.display = "none";
            	this.classList.add("isDragging");
            	ui.position.left = 0;
                ui.position.top = 0;
            },
            drag : function (ev, ui) {
            	var factor = parseFloat(this.parentNode.parentNode.dataset.factor);
            	
            	var changeLeft = ui.position.left - ui.originalPosition.left; // find change in left
                var newLeft = ui.originalPosition.left + changeLeft / factor; // adjust new left by our zoomScale
             
                var changeTop = ui.position.top - ui.originalPosition.top; // find change in top
                var newTop = ui.originalPosition.top + changeTop / factor; // adjust new top by our zoomScale
             
                ui.position.left = newLeft;
                ui.position.top = newTop;
            },
            stop : window.app.emulateBind(function (ev) {
                this.style.moveToken(this.token);
            }, {style : this, token : newToken})
        }).css("position", "absolute");
		this.elements['mapTokens'].appendChild(newToken.container);
	}
	
	while (this.tokens.length > this.sheet.getField("Tokens").sheets.length) {
		var oldToken = this.tokens.pop();
		this.elements['mapTokens'].removeChild(oldToken.container);
	}
	
	var width = this.elements['mapCanvas'].width;
	var height = this.elements['mapCanvas'].height;
	var squareSize = this.sheet.getField("squareSize").getValue();
	var offsetX = this.sheet.getField("offsetX").getValue();
	var offsetY = this.sheet.getField("offsetY").getValue();
	
	var tokens = this.sheet.getField("Tokens").sheets;
	for (var i = 0; i < tokens.length; i++) {
		var token = tokens[i];
		
		var angle = token.getField("Rotation").getValue() * 45;
		
		if (token.getField("Rotate").getValue()) {
			this.tokens[i].container.classList.add("rotate");
			this.tokens[i].token.style.transform = "rotate(" + angle + "deg)";
			this.tokens[i].arrow.style.transform = "";
		} else {
			this.tokens[i].container.classList.remove("rotate");
			this.tokens[i].token.style.transform = "";
			this.tokens[i].arrow.style.transform = "rotate(" + angle + "deg)";
		}
		
		this.tokens[i].setUrl(token.getField("TokenPicture").value[0]);
		
		var squareX = token.getField("X").getValue();
		var squareY = token.getField("Y").getValue();
		
		
		var x = (token.getField("X").getValue() * squareSize) + offsetX;
		var y = (token.getField("Y").getValue() * squareSize) + offsetY;
		var size = token.getField("TokenSize").getObject() + 1;
		

		var fogged = 0;
		var maxFog = size * size;
		for (var movX = 0; movX < size; movX++) {
			for (var movY = 0; movY < size; movY++) {
				if (this.isFog(squareX+movX, squareY+movY)) fogged++;
			}
		}
		
		var alpha = 1 - (fogged/maxFog);
		if (this.sheetInstance.editable && alpha < 0.5) {
			alpha = 0.5;
		}
		
		if (alpha < 0.1) {
			this.tokens[i].container.style.display = 'none';
		} else {
			this.tokens[i].container.style.display = 'block';
		}
		this.tokens[i].container.style.opacity = alpha;
		
		if ((x + (squareSize * size)) > width) {
			x = 0;
			y = 0;
		} else if (x < offsetX) {
			x = offsetX;
		}
		
		if ((y + (squareSize * size)) > height) {
			y = 0;
			x = 0;
		} else if (y < offsetY) {
			y = offsetY;
		}

		this.tokens[i].container.style.width = (squareSize * size) + "px";
		this.tokens[i].container.style.height = (squareSize * size) + "px";
		
		if (this.tokens[i].isNew) {
			this.tokens[i].container.style.left = x + "px";
			this.tokens[i].container.style.top = y + "px";
			this.tokens[i].isNew = false;
			this.tokens[i].$container = $(this.tokens[i].container);
		} else {
			this.tokens[i].$container.finish().animate({
				left : x + "px",
				top : y + "px"
			});
		}
		
		this.tokens[i].container.title = token.getField("TokenPicture").value[1];
	}
};

this.moveToken = function (token) {
	var squareSize = this.sheet.getField("squareSize").getValue();
	var offsetX = this.sheet.getField("offsetX").getValue();
	var offsetY = this.sheet.getField("offsetY").getValue();
	var x = token.container.offsetLeft - offsetX;
	var y = token.container.offsetTop - offsetY;

	var xTimes = Math.round(x / squareSize);
	var yTimes = Math.round(y / squareSize);
	
	if (xTimes < 0) {
		xTimes = 0;
	}
	
	if (yTimes < 0) {
		yTimes = 0;
	}
	
//	x = xTimes * squareSize + offsetX;
//	y = yTimes * squareSize + offsetY;
	
	if (!this.sheetInstance.editable) {
		this.sendCommand('moveToken', {
			x : xTimes,
			y : yTimes,
			index : token.index,
			sheetid : this.sheetInstance.id
		});
		this.updateTokens();
		window.app.chatapp.printSystemMessage("_SHEETMAPSMOVEMENTREQUESTED_");
		return;
	}
	
	var tokenSheet = this.sheet.getField("Tokens").sheets[token.index];
	tokenSheet.getField("X").storeValue(xTimes);
	tokenSheet.getField("Y").storeValue(yTimes);
	
	this.updateTokens();
	window.app.ui.sheetui.controller.saveSheet();
}

this.sheet.getField("Tokens").addChangedListener({
	style : this,
	handleEvent : function () {
		this.style.updateTokens();
	}
});

this.centerOn = function (x, y) {
	var nWidth = this.elements['mapPicture'].naturalWidth;
	var nHeight = this.elements['mapPicture'].naturalHeight;
	
	var newWidth = nWidth * this.factor;
	var newHeight = nHeight * this.factor;
	
	var aHeight = this.elements['mapView'].clientHeight;
	var aWidth = this.elements['mapView'].clientWidth;
	
	var newX = (x * this.factor) - (aWidth / 2);
	var newY = (y * this.factor) - (aHeight / 2);
	
	if (newX > (newWidth - aWidth)) {
		newX = (newWidth - aWidth);
	}

	if (newY > (newHeight - aHeight)) {
		newY = (newHeight - aHeight);
	}
	
	this.elements['mapView'].scrollTop = newY;
	this.elements['mapView'].scrollLeft = newX;
	
	this.centerX = x;
	this.centerY = y;
}

this.updateSizes = function () {
	var aHeight = this.elements['mapView'].clientHeight;
	var aWidth = this.elements['mapView'].clientWidth;
	
	//var centerY = this.elements['mapView'].scrollTop + (aHeight / 2);
	//var centerX = this.elements['mapView'].scrollLeft + (aWidth / 2);
	
//	y = this.centerY / this.lastFactor;
//	x = this.centerX / this.lastFactor;
	
	this.lastFactor = this.factor;
	this.elements['mapContainer'].style.transform = "scale(" + this.factor + ")";
	this.elements['mapContainer'].dataset.factor = this.factor;
	this.centerOn(this.centerX, this.centerY);
};

/**
 * Update Factor
 */
this.elements['mapCanvas'].addEventListener('mousewheel', {
	style : this,
	handleEvent : function (e) {
		e.stopPropagation();
		e.preventDefault();
        var up = event.deltaY <= 0;
        var factor = up ? 0.1 : -0.1;
        this.style.changeFactor(factor);
        this.style.elements.mapTokenOptions.style.display = 'none';
	}
});


/**
 * Update Canvas with picture
 */
this.elements['mapPicture'].addEventListener('load', {
	style : this,
	handleEvent : function () {
		this.style.updateEverything();
	}
});

this.elements['mapPicture'].addEventListener('error', {
	style : this,
	handleEvent : function () {
		this.style.elements.mapPicture.src = 'img/404.png';
	}
});

this.sheet.getField("MapPic").addChangedListener({
	style : this,
	handleEvent : function () {
		var url = this.style.sheet.getField("MapPic").value[0];
		var src = this.style.elements.mapPicture.src;
		if (url === src) return;
		this.style.elements.mapPicture.src = url;
		this.style.elements.mapContainer.style.display = 'none';
	}
});

/**
 * Drag the Map Around
 */
var mapDragStart = {
	style : this,
	handleEvent : function (e) {
		this.style.mapDrag(e.pageX, e.pageY, true);
		this.style.elements.mapTokenOptions.style.display = 'none';
	}
};

var mapDragMove = {
	style : this,
	handleEvent : function (e) {
		this.style.mapDrag(e.pageX, e.pageY, false);
	}
};

var mapDragEnd = {
	style : this,
	handleEvent : function (e) {
		this.style.mapDrag(null, null);
	}
};

this.elements['mapCanvas'].addEventListener('mousedown', mapDragStart);
this.elements['mapCanvas'].addEventListener('mousemove', mapDragMove);
this.elements['mapCanvas'].addEventListener('mouseup', mapDragEnd);
this.elements['mapCanvas'].addEventListener('mouseout', mapDragEnd);

this.mapDrag = function (relX, relY, start) {
    if (start) {
        this.lastX = relX;
        this.lastY = relY;
        return;
    } else if (this.lastX === undefined) {
        return;
    }
    
    if (relX === null) {
        delete this.lastX;
        delete this.lastY;
        return;
    }
    
    this.elements['mapView'].scrollLeft -= (relX - this.lastX);
    this.elements['mapView'].scrollTop -= (relY - this.lastY);
    
    this.lastX = relX;
    this.lastY = relY;
    
    var aHeight = this.elements['mapView'].clientHeight;
	var aWidth = this.elements['mapView'].clientWidth;
    
    this.centerY = this.elements['mapView'].scrollTop + (aHeight / 2);
    this.centerY = this.centerY / this.factor;
	this.centerX = this.elements['mapView'].scrollLeft + (aWidth / 2);
    this.centerX = this.centerX / this.factor;
};

this.lastFogX = null;
this.lastFogY = null;
this.fogCtx = this.elements['fogDrawCanvas'].getContext('2d');
this.drawFog = function (ev, start) {
	if (start) {
		this.lastFogX = ev.offsetX;
		this.lastFogY = ev.offsetY;
		var canvas = this.elements['fogDrawCanvas'];
		this.fogCtx.clearRect(0, 0, canvas.width, canvas.height);
		this.fogCtx.strokeStyle = "#00FF00";
		this.fogCtx.lineCap="round";
		var pencilSize = this.sheet.getField("squareSize").getValue() * 2;
		if (pencilSize < 10) {
			pencilSize = 10;
		}
		this.fogCtx.lineWidth = pencilSize;
		return;
	}
	
	if (this.lastFogX === null || this.lastFogY === null) {
		return;
	}
	
	if (ev === null) {
		// Finish up
		this.lastFogX = null;
		this.lastFogY = null;
		
		var squareSize = this.sheet.getField("squareSize").getValue();
		var offsetX = this.sheet.getField("offsetX").getValue();
		var offsetY = this.sheet.getField("offsetY").getValue();
		
		var canvas = this.elements['fogDrawCanvas'];
		
		var width = canvas.width;
		var height = canvas.height;
		
		var ctx = canvas.getContext('2d');
		var x = offsetX;
		var y = offsetY;
		
		var maxOp = squareSize * squareSize;
		
		var string = "";
		
		var p = ctx.getImageData(0, 0, width, height);
		
		while ((y + squareSize) < height) {
			while ((x + squareSize) < width) {
				
				var op = 0;

				for (var posx = x; posx < (x + squareSize); posx++) {
					for (var posy = y; posy < (y + squareSize); posy++) {
						var pos = (((width * posy) + posx) * 4);
						if (p.data[pos + 3] === 255) {
							op++;
						}
					}
				}
				
				op = parseInt((op * 10) / maxOp);
				if (op > 9) op = 9;
				string += op;
				x += squareSize;
			}
			y += squareSize;
			x = offsetX;
		}
		
		this.processFog(string);
		
		this.fogCtx.clearRect(0, 0, canvas.width, canvas.height);
		
		this.updateFog();
		window.app.ui.sheetui.controller.saveSheet();
		return;
	}
	
	this.fogCtx.beginPath();
	this.fogCtx.moveTo(this.lastFogX, this.lastFogY);
	this.fogCtx.lineTo(ev.offsetX, ev.offsetY);
	this.fogCtx.stroke();
	
	this.lastFogX = ev.offsetX;
	this.lastFogY = ev.offsetY;
}

/**
 * Bind on Edit
 */
this.sheet.addToggledEditListener({
	style : this,
	handleEvent : function () {
		this.style.mapToggleEdit();
	}
});