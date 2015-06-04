function Button_DeleteRow (element, style, parent) {
	this.visible = element;
	this.style = style;
	this.parent = parent;
	
	this.list = this.parent.parent;
	if (!(this.list instanceof Sheet_List)) {
		console.log("Delete Row button added outside of a row. Ignoring.");
		return;
	}
	
	this.clickHandler = {
		list : this.list,
		row : this.parent,
		handleEvent : function () {
			this.list.removeRowByRow(this.row);
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