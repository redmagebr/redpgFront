function Image () {
    /** @type String */ this.uuid;
    /** @type String */ this.ext;
    /** @type String */ this.name;
    /** @type String */ this.folder;
    /** @type number */ this.size;
    /** @type number */ this.uploader;
    
    this.updateFromJSON = function (json) {
        var attr = ['uuid', 'ext', 'name', 'folder', 'size', 'uploader'];
        var index;
        for (var i = 0; i < attr.length; i++) {
            index = attr[i];
            if (typeof json[index] !== 'undefined') {
                this[index] = json[index];
            }
        }
    };
    
    this.getUrl = function () {
        return window.app.imageHost + this.uploader + '_' + this.uuid + '.' + this.ext;
    };
}