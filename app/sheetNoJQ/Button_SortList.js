function Button_SortList (element, style, parent) {
	this.visible = element;
	this.style = style;
	this.parent = parent;
	
	this.list = this.parent.getField(this.visible.dataset['for']);
	if (!(this.list instanceof Sheet_List)) {
		console.log("Invalid SortList button, pointing at " + this.visible.dataset['for'] + ". Ignoring.");
		return;
	}
	
	this.clickHandler = {
		list : this.list,
		handleEvent : function () {
			this.list.sort();
		}
	};
	
	this.visible.addEventListener('click', this.clickHandler);
	
	this.originalDisplay = this.visible.style.display;
	if (!this.style.sheetInstance.editable) this.visible.style.display = 'none';
	
	this.update = function () {
		if (this.style.sheetInstance.editable) {
			this.visible.style.display = this.originalDisplay;
		} else {
			this.visible.style.display = 'none';
		}
	};
}