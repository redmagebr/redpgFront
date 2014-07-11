function ConfigDB () {
    this.config = {};
    this.changed = false;
    
    this.empty = function () {
        this.config = {};
        window.app.updateConfig();
    };
    
    this.updateFromJSON = function (json) {
        this.config = {};
        for (var i in json) {
            this.store(i, json[i]);
        }
        this.changed = false;
        window.app.updateConfig();
    };
    
    this.store = function (index, value) {
        if (typeof this.config[index] === 'undefined' || this.config[index] !== value) {
            this.changed = true;
        }
        this.config[index] = value;
    };
    
    this.get = function (index, defaultValue) {
        if (typeof this.config[index] === 'undefined') {
            this.store(index, defaultValue);
            return defaultValue;
        }
        return this.config[index];
    };
    
    this.sendToServer = function (cbs, cbe) {
        var ajax = new AjaxController();
        ajax.requestPage({
            url : 'Account',
            data: {
                action : 'StoreConfig',
                config : this.config
            },
            success: cbs,
            error: cbe
        });
    };
}