/**
 * @returns {ChatApp}
 */
function ChatApp () {
    this.timeout = null;
    this.timeoutTime = 500;
    this.updating = false;
    this.running = false;
    
    this.sendMessages = [];
    
    this.errors = 0;
    
    this.userTime = 0;
    this.afkTime = 10;
    
    /**
     * @type Room
     */
    this.room = null;
    
    this.increaseTimeout = function () {
        if (window.app.ui.hasFocus) {
            var limit = 700;
        } else {
            var limit = 1500;
        }
        this.timeoutTime += 100;
        if (this.timeoutTime > limit) {
            this.timeoutTime = limit;
        }
    };
    
    this.defaultTimeout = function () {
        this.timeoutTime = 300;
    };
    
    this.setRoom = function (room) {
        this.room = room;
    };
    
    this.stop = function () {
        this.room = null;
        clearTimeout(this.timeout);
        this.timeout = null;
    };
    
    this.sendMessage = function (message) {
        return this.sendMessages.push(message);
        if (!this.running) {
            this.stop();
            this.newTimeout();
        }
    };
    
    this.removeMessage = function (message) {
        this.sendMessages.splice(
            this.sendMessages.indexOf(message), 1
        );
    };
    
    this.start = function (room, cbs, cbe) {
        this.stop();
        this.room = room;
        this.room.requiresUsers = true;
        this.cbs = cbs;
        this.cbe = cbe;
        
        this.userTime = 0;
        
        this.defaultTimeout();
        
        this.newTimeout(true);
    };
    
    this.newTimeout = function (now) {
        if (typeof now === 'undefined') var now = false;
        now = now || (this.sendMessages.length > 0);
        if (!now) {
            this.timeout = setTimeout(window.app.emulateBind(
                function () {
                    this.app.fetchRoom();
                }, {app : this}
            ), this.timeoutTime);
        } else {
            this.fetchRoom();
        }
    };
    
    this.processSaved = function (json) {
        var message;
        for (var i = 0; i < json.length; i++) {
            if (typeof this.sendMessages[json[i].localid] !== 'undefined') {
                message = this.sendMessages[json[i].localid];
                message.id = json[i].serverid;
                for (var k = 0; k < message.onSaved.length; k++) {
                    message.onSaved[k]();
                }
            }
        }
    };
    
    this.processError = function (data) {
        if (typeof this.messages === 'undefined') return false;
        var message;
        for (var i = 0; i < this.messages.length; i++) {
            message = this.messages[i];
            for (var k = 0; k < message.onError.length; k++) {
                message.onError[k](data, message);
            }
        }
    };
    
    this.fetchRoom = function () {
        this.running = true;
        var cbs = this.cbs;
        var cbe = this.cbe;
        if (this.room === null) {
            cbe({status:400});
            this.running = false;
            return false;
        }
        cbs = window.app.emulateBind(
            function (json) {
                // Turn json into array so roomdb can understand it
                if (typeof json.messages === 'undefined') {
                    this.app.increaseTimeout();
                } else {
                    this.app.defaultTimeout();
                }
                
                this.app.errors = 0;
                
                if (typeof json.userTime !== 'undefined') {
                    this.app.userTime = json.userTime;
                }
                this.room.updateFromJSON(json, true);
                this.cbs();
                this.app.newTimeout(false);
                this.app.running = false;
            }, {cbs:cbs, room : this.room, app : this}
        );

        var data = {
            roomid : this.room.id,
            requireUsers : this.room.requiresUsers,
            userTime : this.userTime,
            lastMessage : this.room.getNewestMessageId()
        };
        
        if (window.app.configdb.get('showWhispers', true)) {
            data.typing = window.app.ui.chat.$chatinput.val() !== '';
            data.focused = window.app.ui.hasFocus;
        }
        
        if (!this.room.hidePersona && window.app.configdb.get('showWhispers', true)) {
            if ((this.room.persona !== null)) {
                data.persona = this.room.persona;
            } else {
                data.persona = '';
            }

            if (this.room.avatar !== null) {
                data.avatar = this.room.avatar;
            } else {
                data.avatar = '';
            }
        }
        
        /**
         * 
         * @type Array of Message
         */
        var sendNow = [];
        
        for (var i = 0; i < this.sendMessages.length; i++) {
            if (this.sendMessages[i].roomid === this.room.id) {
                sendNow.push(this.sendMessages[i]);
            }
        }
        
        var onError = window.app.emulateBind(this.processError, {messages : sendNow});
        
        cbe = window.app.emulateBind(
            function (data) {
                this.onError(data);
                this.app.running = false;
                if (++this.app.errors < 3) {
                    this.app.newTimeout(false);
                    return false;
                }
                this.cbe(data);
            }, {onError : onError, cbe : cbe, app : this}
        );
        
        if (sendNow.length > 0) {
            data.messages = [];
            for (var i = 0; i < sendNow.length; i++) {
                if (typeof sendNow[i].destination !== 'number' && sendNow[i].destination !== null && sendNow[i].destination.length === 1) {
                    sendNow[i].destination = sendNow[i].destination[0];
                }
                this.removeMessage(sendNow[i]);
                data.messages.push({
                    localid : sendNow[i].localid,
                    destination : sendNow[i].destination,
                    message : sendNow[i].msg,
                    module : sendNow[i].module,
                    special : sendNow[i].special
                });
            }
        }

        var ajax = new AjaxController();
        
        ajax.requestPage({
            url : 'ChatFetcher',
            data : data,
            success: cbs,
            error: cbe
        });
    };
    
    this.clear = function () {
        var cbe = function () {
            var $html = $('<p class="chatSistema language" data-langhtml="_CLEARFAIL_" />');
            window.app.ui.language.applyLanguageTo($html);
            window.app.ui.chat.appendToMessages($html);
        };
        
        var cbs = function () {
            window.app.chatapp.room.empty();
        };
        
        if (this.room === null) {
            cbe();
            return false;
        }
        
        var ajax = new AjaxController();
        ajax.requestPage({
            url : 'ClearChat',
            data : {
                'roomid' : this.room.id
            },
            error: cbe,
            success: cbs
        });
    };
}