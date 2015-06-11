this.factor = 1;
this.lastFactor = 1;
this.centerX = 0;
this.centerY = 0;

/**
 * Show and hide things on edit
 */
this.mapToggleEdit = function () {
	if (this.editing) {
		this.elements.mapView.style.display = 'none';
		this.elements.mapEdit.style.display = '';
	} else {
		this.elements.mapView.style.display = '';
		this.elements.mapEdit.style.display = 'none';
	}
};


/**
 * Elements that are used elsewhere
 */
var elementsToFind = ['mapView', 'mapEdit', 'mapCanvas', 'mapPicture', 'mapContainer'];
this.elements = {};

for (var i = 0 ; i < elementsToFind.length; i++) {
	this.elements[elementsToFind[i]] = this.$visible.find("#" + elementsToFind[i])[0];
}