function ImageDB () {
    this.images = {};
    
    this.empty = function () {
        this.images = {};
    };
    
    /**
     * 
     * @param {number} id
     * @returns {Image}
     */
    this.getImage = function (id) {
        if (typeof this.images[id] !== 'undefined') {
            return this.images[id];
        }
        return null;
    };
    
    this.deleteImage = function (id) {
        if (typeof this.images[id] !== 'undefined') {
            delete this.images[id];
            return true;
        }
        return false;
    };
    
    
    this.updateFromJSON = function (json, clean) {
        if (clean) this.empty();
        for (var i = 0; i < json.length; i++) {
            if (typeof this.images[json[i].id] === 'undefined') {
                this.images[json[i].id] = new Sheet_Instance();
            }
            this.images[json[i].id].updateFromJSON(json[i]);
        }
    };
}