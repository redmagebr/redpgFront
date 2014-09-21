function StyleDB () {
    this.styles = {};
    this.empty = function () {
        this.styles = {};
    };
    
    /**
     * 
     * @param {number} id
     * @returns {Style_Instance}
     */
    this.getStyle = function (id) {
        if (this.styles[id] !== undefined) {
            return this.styles[id];
        }
        return null;
    };
    
    /**
     * 
     * @param {type} id
     * @returns {Boolean}
     */
    this.deleteStyle = function (id) {
        if (this.styles[id] !== undefined ){
            delete this.styles[id];
            return true;
        }
        return false;
    };
    
    this.isLoaded = function (id) {
        var style = this.getStyle(id);
        return (style !== null && style.html !== null);
    };
    
    this.updateFromJSON = function (json, clean) {
        if (clean === undefined) var clean = false;
        if (clean) {
            this.empty();
        }
        for (var i = 0; i < json.length; i++) {
            if (typeof this.styles[json[i].id] === 'undefined') {
                this.styles[json[i].id] = new Style_Instance();
            }
            this.styles[json[i].id].updateFromJSON(json[i]);
        }
    };
}