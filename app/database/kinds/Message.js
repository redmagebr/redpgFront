function Message () {
    /**
     * Message ID on a relational database
     * @type int
     */
    this.id = null;
    this.localid = null;
    this.roomid = null;
    this.timeout = null;
    
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
            
            if (this.timeout !== null) {
                window.clearTimeout(this.timeout);
                this.timeout = null;
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
    
    this.set$ = function ($obj) {
        $obj.addClass('sendInProgress');
        
        this.bindSaved(window.app.emulateBind(
            function () {
                $obj.removeClass('sendInProgress');
            }, {$msg : $obj}
        ));

        this.bindError(window.app.emulateBind(
            function() {
                this.$message.removeClass('sendInProgress');
                this.$message.addClass('sendError');

                var $resend = $('<a class="retry language" data-langhtml="_CHATRESEND_" />');
                $resend.bind('click', window.app.emulateBind(
                    function () {
                        window.app.chatapp.sendMessage(this.message);
                        this.$message.removeClass('sendError').addClass('sendInProgress');
                        this.$resend.remove();
                    }, {message : this.message, $message : this.$message, $resend : $resend}
                ));

                window.app.ui.language.applyLanguageOn($resend);

                this.$message.append(' ');
                this.$message.append($resend);
            }, {$message : $obj, message : this}
        ));

        this.timeout = window.setTimeout(window.app.emulateBind(function () {
            var errors = this.message.onError;
            
            for (var i = 0; i < errors.length; i++) {
                errors[i]();
            }
        }, {message : this}), 5000);
    };
    
}