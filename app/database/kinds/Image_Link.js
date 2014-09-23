function Image_Link () {
    this.id = null;
    this.name = null;
    this.url = null;
    
    this.updateFromJSON = function (json) {
        var attributes = ['id', 'name', 'url'];
        for (var i = 0; i < attributes.length; i++) {
            if (json[attributes[i]] !== undefined) {
                this[attributes[i]] = json[attributes[i]];
            }
        }
    };
    
    this.getName = function () {
        return this.name;
    };
    
    this.getUrl = function () {
        return this.url;
    };
}