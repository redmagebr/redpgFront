function ConfigOption () {
    this.id = null;
    this.options = [];
    this.values = [];
    this.default = -1;
    this.name = "_MISSINGNAME_";
    this.description = "_MISSINGDESC_";
    
    this.addOption = function (name, value) {
        this.options.push(name);
        this.values.push(value);
    };
    
    this.setDefault = function (value) {
        this.default = this.values.indexOf(value);
    };
}