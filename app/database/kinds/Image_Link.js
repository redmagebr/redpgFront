function Image_Link () {
    this.id = null;
    this.name = null;
    this.url = null;
    this.folder = '';
    
    this.updateFromJSON = function (json) {
        var attributes = ['id', 'name', 'url', 'folder'];
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
    
    this.getId = function () {
        return this.id;
    };
    
    this.isLink = function () {
        return true;
    };
}