function Hover () {
	
	this.hoverBox = document.getElementById("hoverBox");
	this.hoverBox.style.display = 'none';
	
	this.makeHover = function (element, text) {
		element.dataset.hoverText = text;
		element.addEventListener('mouseenter', function (e) {
			window.app.ui.hover.mouseEnter(e, this);
		});
		element.addEventListener('mouseleave', function (e) {
			window.app.ui.hover.mouseLeave(e, this);
		});
		element.addEventListener('mousemove', function (e) {
			window.app.ui.hover.mouseMove(e, this);
		});
	};
	
	this.mouseEnter = function (event, element) {
		while (this.hoverBox.firstChild) this.hoverBox.removeChild(this.hoverBox.firstChild);
		var text = element.dataset.hoverText;
		var lines = text.split(/\r\n|\r|\n/);
		for (var i = 0; i < lines.length; i++) {
			var p = document.createElement("p");
			var textNode = document.createTextNode(lines[i]);
			p.appendChild(textNode);
			this.hoverBox.appendChild(p);
		}
		this.hoverBox.style.display = 'block';
		this.height = this.hoverBox.scrollHeight;
		this.width = this.hoverBox.scrollWidth;
		this.mouseMove(event, element);
	};
	
	this.mouseLeave = function (event, element) {
		this.hoverBox.style.display = 'none';
	};
	
	this.mouseMove = function (event, element) {
		//pageX: 291 pageY: 366
		var x = event.pageX;
		var y = event.pageY - this.height - 6;
		if (y < 0) y = 0;

		var totalWidth = document.getElementsByTagName('body')[0].scrollWidth;
		var maxX = totalWidth - this.width;
		if (x > maxX) x = maxX;
		if (x < 0) x = 0;
		
		this.hoverBox.style.left = x + "px";
		this.hoverBox.style.top = y + "px";
	};
}