function Message () {
    /**
     * Message ID on a relational database
     * @type int
     */
    this.id = null;
    this.localid = null;
    this.roomid = null;
    
    /**
     * Actual message content.
     * @type String
     */
    this.msg = 'Undefined';
    
    /**
     * Holds any kind of special value the module had to store.
     * @type object
     */
    this.special = {};
    
    /**
     * Sender ID in the relational database.
     * @type int
     */
    this.origin = null;
    
    
    
    /**
     * Receiver ID in the relational database.
     * If null the message was public.
     * @type int
     */
    this.destination = null;
    
    /**
     * ID String of the module which created the message.
     * @type String
     */
    this.module = null;
    
    
    this.onSaved = [];
    this.onError = [];
    
    this.date = '';
    
    this.isWhisp = function () {
        return (this.destination !== null && this.destination.length > 0);
    };
    
    this.updateFromJSON = function (json) {
        var attributes = [
            'destination', 'id', 'module', 'msg', 'origin', 'roomid', 'date'
        ];
        for (var i = 0; i < attributes.length; i++) {
            if (typeof json[attributes[i]] !== 'undefined') {
                this[attributes[i]] = json[attributes[i]];
            }
        }
        
        if (typeof json.special !== 'undefined') {
            this.special = JSON.parse(json.special);
        }
        
        if (typeof json.localid !== 'undefined') {
            console.log("Running saved");
            console.log(this.onSaved);
            for (var i = 0; i < this.onSaved.length; i++) {
                this.onSaved[i](this);
            }
        }
    };
    
    this.getSpecial = function (index, defaultValue) {
        if (typeof this.special[index] !== 'undefined') {
            return this.special[index];
        } else {
            return defaultValue;
        }
    };
    
    this.setSpecial = function (index, value) {
        this.special[index] = value;
    };
    
    /**
     * Getters and Setters
     */
    
    this.setOrigin = function (id) {
        this.origin = id;
    };
    
    this.setDestination = function (id) {
        this.destination = id;
    };
    
    this.getOrigin = function () {
        return this.origin;
    };
    
    this.getDestination = function () {
        return this.destination;
    };
    
    this.setId = function (id) {
        this.id = id;
    };
    
    this.setMessage = function (msg) {
        this.msg = msg;
    };
    
    this.getId = function () {
        return this.id;
    };
    
    this.getMessage = function () {
        return this.msg;
    };
    
    this.bindSaved = function (func) {
        this.onSaved.push(func);
    };
    
    this.bindError = function (func) {
        if (typeof func === 'function') {
            this.onError.push(func);
        }
    };
    
    /**
     * 
     * @returns {User}
     */
    this.getUser = function () {
        if (this.origin === null) {
            return null;
        }
        if (this.roomid === null) {
            return null;
        }
        
        return window.app.roomdb.getRoom(this.roomid).getUser(this.origin);
    };
    
    /**
     * 
     * @returns {User}
     */
    this.getDestinationUser = function () {
        if (this.destination === null) {
            return null;
        }
        if (this.roomid === null) {
            return null;
        }
        
        if (typeof this.destination === 'number')
            return window.app.roomdb.getRoom(this.roomid).getUser(this.destination);
        return window.app.roomdb.getRoom(this.roomid).getUser(this.destination[0]);
    };
    
}