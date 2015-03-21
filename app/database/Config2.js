function Config2 () {
    this.maxId = 20;
    this.maxLength = 1024; // This means 1024 characters, so at least 1kb and up to 8kb on UTF-8.
    this.maxLength = 102400; // Temporary solution to those holding Sounds
    
    this.config = {};
    this.registeredConfig = {};
    this.listeners = {};
    
    this.empty = function () {
        for (var id in this.config) {
            this.config[id] = this.registeredConfig[id].configDefault(id);
            this.registeredConfig[id].configChanged(id);
        }
    };
    
    this.get = function (id) {
        if (this.config[id] === undefined) {
            console.log("Failed attempt to get an unregistered Config at " + id);
            return null;
        }
        
        return this.config[id];
    };
    
    this.registerConfig = function (id, object) {
        if (typeof id !== 'string' || typeof object !== 'object' || 
                typeof object.configChanged !== 'function' || typeof object.configValidation !== 'function' ||
                typeof object.configDefault !== 'function') {
            console.log("Failed attempt to register Config, id and object:");
            console.log(id);
            console.log(object);
            return false;
        }
        
        if (this.config[id] !== undefined) {
            console.log("Failed attempt to overwrite Config registration on \"" + id + "\", object:");
            console.log(object);
            console.log("Config was already registered by:");
            console.log(this.registeredConfig[id]);
            return false;
        }
        
        if (id.length > this.maxId) {
            console.log("Failed attempt to register Config at \"" + id +"\". Ids can only be " + this.maxId + " characters long. Offending object:");
            console.log(object);
            return false;
        }
        
        this.config[id] = object.configDefault(id);
        this.registeredConfig[id] = object;
        return true;
    };
    
    this.store = function (id, value) {
        if (typeof id !== 'string') {
            console.log("Attempt to store a value to a Config ID which wasn't a string:");
            console.log(id);
            console.log(value);
            return false;
        }
        
        if (this.config[id] === undefined) {
            console.log("Attempt to store a value to an unregistered Config at " + id);
            console.log(value);
            return false;
        }
        
        if (value === null) {
            this.config[id] = this.registerConfig()[id].configDefault(id);
            this.registeredConfig[id].configChanged(id);
            return true;
        }
        
        // Is it valid? can we clean it?
        if (!this.registeredConfig[id].configValidation(id, value)) {
            console.log("Attempt to store invalid values to Config " + id + ", object:");
            console.log(value);
            if (typeof this.registeredConfig[id].configClean === 'function') {
                value = this.registeredConfig[id].configClean(id, value);
                if (!this.registeredConfig[id].configValidation(id, value)) {
                    return false;
                }
            } else {
                return false;
            }
        }
        
        var old = this.config[id];
        this.config[id] = value;
        
        if (typeof old !== typeof value
                || ((typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') && value !== old)) {
            this.registeredConfig[id].configChanged(id);
        } else if (!(typeof value === 'string' || typeof value === 'number') || typeof value === 'boolean') {
            this.registeredConfig[id].configChanged(id);
        }
        
        if (this.listeners[id] !== undefined) {
            for (var i = 0; i < this.listeners[id].length; i++) {
                this.listeners[id][i].configChanged(id);
            }
        }
        return;
    };
    
    this.updateFromJSON = function (json) {
        this.empty();
        for (var id in json) {
            this.store(id, json[id]);
        }
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
    
    this.addListener = function (id, object) {
        if (typeof id !== 'string') {
            console.log("FAILED ATTEMPT TO ADD LISTENER TO NON-STRING ID. ID AND OFFENDER:");
            console.log(id);
            console.log(object);
            return false;
        }
        
        if (typeof object !== 'object' || typeof object.configChanged !== 'function') {
            console.log("FAILED ATTEMPT TO ADD LISTENER TO BAD OBJECT ON " + id + ". OFFENDER:");
            console.log(object);
            return false;
        }
        
        if (this.listeners[id] === undefined) this.listeners[id] = [];
        this.listeners[id].push(object);
        return true;
    };
}