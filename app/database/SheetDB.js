function SheetDB () {
    this.sheets = {};
    
    this.empty = function () {
        this.sheets = {};
    };
    
    /**
     * 
     * @param {int} id
     * @returns {Sheet_Instance}
     */
    this.getSheet = function (id) {
        if (typeof this.sheets[id] !== 'undefined') {
            return this.sheets[id];
        }
        return null;
    };
    
    this.deleteSheet = function (id) {
        if (typeof this.sheets[id] !== 'undefined') {
            delete this.sheets[id];
            return true;
        }
        return false;
    };
    
    
    this.updateFromJSON = function (json, clean) {
        if (clean === undefined) var clean = false;
        if (clean) {
            this.empty();
        }
        for (var i = 0; i < json.length; i++) {
            if (typeof this.sheets[json[i].id] === 'undefined') {
                this.sheets[json[i].id] = new Sheet_Instance();
            }
            this.sheets[json[i].id].updateFromJSON(json[i]);
        }
    };
    
    this.isLoaded = function (id) {
        var sheet = this.getSheet(id);
        return (sheet !== null) && (sheet.values !== null);
    };
}