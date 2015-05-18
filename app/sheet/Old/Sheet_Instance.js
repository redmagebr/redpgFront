function Sheet_Instance () {
    this.id = null;
    this.editable = false;
    this.name = null;
    this.system = null;
    this.values = {};
    
    this.updateFromJSON = function (json) {
        if (typeof json.id !== 'undefined') this.id = json.id;
        if (typeof json.name !== 'undefined') this.name = json.name;
        if (typeof json.system !== 'undefined') this.system = json.system;
        if (typeof json.values !== 'undefined') {
            this.values = JSON.parse(json.values);
        }
    };
    
    this.setValues = function (obj) {
        this.values = obj;
    };
}