function Storage (app) {
    this.app = app;
    
    this.maxId = 20;
    this.maxLength = 60000;
    
    this.storage = {};
    this.registeredStorage = {};
    
    this.empty = function () {
        for (var id in this.storage) {
            this.storage[id] = this.registeredStorage[id].storageDefault();
            this.registeredStorage[id].storageChanged();
        }
    };
    
    this.get = function (id) {
        if (this.storage[id] === undefined) {
            console.log("Failed attempt to get an unregistered Storage at " + id);
            return null;
        }
        
        return this.storage[id];
    };
    
    /**
     * Register a storage space to an object
     * @param {string} id
     * @param {object} object
     * @returns {Boolean}
     */
    this.registerStorage = function (id, object) {
        if (typeof id !== 'string' || typeof object !== 'object' || 
                typeof object.storageChanged !== 'function' || typeof object.storageValidation !== 'function' ||
                typeof object.storageDefault !== 'function') {
            console.log("Failed attempt to register Storage, id and object:");
            console.log(id);
            console.log(object);
            return false;
        }
        if (this.storage[id] !== undefined) {
            console.log("Failed attempt to overwrite Storage registration on \"" + id + "\", object:");
            console.log(object);
            console.log("Storage was already registered by:");
            console.log(this.registeredStorage[id]);
            return false;
        }
        if (id.length > this.maxId) {
            console.log("Failed attempt to register Storage at \"" + id +"\". Ids can only be " + this.maxId + " characters long. Offending object:");
            console.log(object);
            return false;
        }
        
        this.storage[id] = object.storageDefault();
        this.registeredStorage[id] = object;
        return true;
    };
    
    this.store = function (id, value) {
        if (typeof id !== 'string') {
            console.log("Attempt to store a value to an Storage id which wasn't a string:");
            console.log(id);
            console.log(value);
            return false;
        }
        
        if (this.storage[id] === undefined) {
            console.log("Attempt to store a value to an unregistered storage at " + id);
            console.log(value);
            return false;
        }
        
        if (value === null) {
            this.storage[id] = this.registeredStorage[id].storageDefault();
            this.registeredStorage[id].storageChanged();
            return true;
        }
        
        // Is it valid? can we clean it?
        if (!this.registeredStorage[id].storageValidation(value)) {
            console.log("Attempt to store invalid values to Storage: " + id + ", object:");
            console.log(value);
            if (typeof this.registeredStorage[id].storageClean === 'function') {
                value = this.registeredStorage[id].storageClean(value);
                if (!this.registeredStorage[id].storageValidation(value)) {
                    return false;
                }
            } else {
                return false;
            }
        }
        
        this.storage[id] = value;
        this.registeredStorage[id].storageChanged();
    };
    
    this.updateFromJSON = function (json) {
        for (var id in json) {
            this.store(id, json[id]);
        }
    };
}

/**
 * Storage Requester Interface
 * 
 * this.storageDefault () - returns an appropriate value to this storage
 * this.storageChanged () - undefined, called when the value stored is changed
 * this.storageValidation (value) - boolean, called before storing a new value to see if it's valid
 * this.storageClean (value) - returns an appropriate value to this storage, optional, called when the storageValidation fails, can be used to prune bad values and reuse what's left
 * 
 * Must call window.app.storage.registerStorage(id, this) to work
 */