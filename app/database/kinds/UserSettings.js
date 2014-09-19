function UserSettings () {
    this.memory = {};
    this.registeredFields = {
        // fieldName : {objectRegisterer, callOnUpdate }
    };
    this.changeListeners = [];
    this.changed = false;
    
    this.updateFromJSON = function (json) {
        this.changed = false;
        for (var i in json) {
            if (this.set(i, json[i])) {
                this.changed = true;
            }
        }
        for (var i = 0; i < this.changeListeners.length; i++) {
            this.changeListeners[i].changedSettings(this);
        }
    };
    
    this.get = function (id) {
        if (this.registeredFields[id] === undefined) {
            return null;
        }
        if (this.memory[id] === undefined) {
            return this.registeredFields[id].default;
        }
        return this.memory[id];
    };
    
    this.set = function (id, value) {
        if (this.registeredFields[id] === undefined) {
            console.log("Attempt to store value to undefined Setting " + id);
            console.log(value);
            return false;
        }
        var validation = this.registeredFields[id].validation;
        if (validation === 'string' && typeof value === 'string') {
            return this.storeValue(id, value);
        } else if (validation === 'number' && typeof value === 'number') {
            return this.storeValue(id, value);
        } else if (this.registeredFields[id].caller.validateSettings(value)) {
            return this.storeValue(id, value);
        }
        console.log("Attempt to store invalid value to Setting " + id);
        console.log(value);
        return false;
    };
    
    this.storeValue = function (id, value) {
        if ((typeof value === 'string' || typeof value === 'number') && value === this.memory[id]) {
            return false;
        }
        this.memory[id] = value;
        this.changed = true;
        for (var i = 0; i < this.changeListeners.length; i++) {
            this.changeListeners[i].changedSettings(this);
        }
    };
    
    this.registerListener = function (obj) {
        this.changeListeners.push(obj);
    };
    
    this.register = function (obj) {
        if (obj.id === undefined) {
            console.log("Bad Request to register User memory:");
            console.log(obj);
            return false;
        }
        if (obj.caller === undefined) {
            obj.caller = null;
            obj.triggerUpdates = false;
        }
        if (obj.triggerUpdates === undefined) {
            obj.triggerUpdates = false;
        }
        if (obj.default === undefined) {
            obj.default = null;
        }
        if (obj.validation === undefined) {
            obj.validation = 'object';
        } else if (['string', 'number'].indexOf(obj.validation) === -1) {
            obj.validation = 'object';
        }
        
        this.registeredFields[obj.id] = {
            id : obj.id,
            caller : obj.caller,
            triggerUpdates : obj.triggerUpdates,
            'default' : obj.default,
            validation : obj.validation
        };
    };
}