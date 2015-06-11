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
	if (this.factor > 2) this.factor = 2;
	
	this.updateSizes();
};

this.updateCanvas = function () {
	this.elements['mapCanvas'].width = this.elements['mapPicture'].naturalWidth;
	this.elements['mapCanvas'].height = this.elements['mapPicture'].naturalHeight;

	var mapType = this.sheet.getField("mapType").getValue();
	var squareSize = this.sheet.getField("squareSize").getValue();
	var offsetX = this.sheet.getField("offsetX").getValue();
	var offsetY = this.sheet.getField("offsetY").getValue();
};


this.updateCenter = function () {
	var aHeight = this.elements['mapView'].clientHeight;
	var aWidth = this.elements['mapView'].clientWidth;

	
};

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
	}
});


/**
 * Update Canvas with picture
 */
this.elements['mapPicture'].addEventListener('load', {
	style : this,
	handleEvent : function () {
		this.style.updateCanvas();
	}
});

this.elements['mapPicture'].addEventListener('error', {
	style : this,
	handleEvent : function () {
		this.style.toggleEdit();
	}
});

/**
 * Drag the Map Around
 */
var mapDragStart = {
	style : this,
	handleEvent : function (e) {
		this.style.mapDrag(e.pageX, e.pageY, true);
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

/**
 * Bind on Edit
 */
this.sheet.addToggledEditListener({
	style : this,
	handleEvent : function () {
		this.style.mapToggleEdit();
	}
});