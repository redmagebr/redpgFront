function Button_AddRow (element, style, parent) {
	this.visible = element;
	this.style = style;
	this.parent = parent;
	
	this.list = this.parent.getField(this.visible.dataset['for']);
	if (!(this.list instanceof Sheet_List)) {
		console.log("Invalid Add Row button, pointing at " + this.visible.dataset['for'] + ". Ignoring.");
		return;
	}
	
	this.clickHandler = {
		list : this.list,
		handleEvent : function () {
			this.list.addRow();
		}
	};
	
	this.visible.addEventListener('click', this.clickHandler);
	
	this.originalDisplay = this.visible.style.display;
	this.visible.style.display = 'none';
	
	this.update = function () {
		if (this.style.editing) {
			this.visible.style.display = this.originalDisplay;
		} else {
			this.visible.style.display = 'none';
		}
	};
}