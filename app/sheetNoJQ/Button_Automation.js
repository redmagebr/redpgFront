function Button_Automation (element, style, parent) {
	this.visible = element;
	this.style = style;
	this.parent = parent;
	
	var data = this.visible.dataset;
	this.viewingOnly = data.view === undefined ? true : (data.view === '1');
	
	this.clickHandler = {
		style : this.style,
		button : this,
		handleEvent : function () {
			this.style.automate(this.button);
		}
	};
	
	this.visible.addEventListener('click', this.clickHandler);
	
	this.originalDisplay = this.visible.style.display;
	if (!(!this.style.editing || !this.viewingOnly)) {
		this.visible.style.display = 'none';
	}
	
	this.update = function () {
		if (!this.style.editing || !this.viewingOnly) {
			this.visible.style.display = this.originalDisplay;
		} else {
			this.visible.style.display = 'none';
		}
	};
}

if (window.sheetButtonTypes === undefined || window.sheetButtonTypes === null)
	window.sheetButtonTypes = {};

window.sheetButtonTypes['automation'] = Button_Automation;