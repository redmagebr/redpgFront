function Room () {
    this.users = new UserDB();
    this.gameid = null;
    this.id = null;
    this.name = null;
    this.creatorid = null;
    this.description = null;
    this.private = false;
    this.streamable = false;
    this.logger = false;
    this.pbp = false;
    this.lastWhisper = null;
    
    this.persona = null;
    this.hidePersona = false;
    this.avatar = null;
    
    this.messages = [];
    this.messageHash = {};
    this.localMessages = [];
    
    this.lastUserRefresh = 0;
    this.requiresUsers = true;
    
    this.empty = function () {
        this.messages = [];
        this.messageHash = {};
        this.localMessages = [];
    };
    
    this.isOwner = function () {
        return window.app.loginapp.user.id === this.creatorid;
    };
    
    this.addLocal = function (message) {
        message.localid = this.localMessages.push(message) - 1;
    };
    
    this.emptyLocal = function () {
        for (var i = 0; i < this.localMessages.length; i++) {
            this.localMessages[i].localid = null;
        }
        this.localMessages = [];
    };
    
    this.getLocal = function (id) {
        return this.localMessages[id];
    };
    
    this.updateFromJSON = function (json, chat) {
        console.log("Updating room from json");
        console.log(json);
        if (typeof chat === 'undefined') chat = false;
        var attributes = {
            pbp : 'playByPost',
            streamable : 'streamable',
            description : 'description',
            private : 'privateRoom',
            logger : 'logger',
            creatorid : 'creatorid',
            id : 'id',
            name :  'name',
            gameid :  'gameid'
        };
        var i;
        for (i in attributes) {
            if (typeof json[attributes[i]] !== 'undefined') {
                this[i] = json[attributes[i]];
            }
        }
        
        
        if (typeof json.messages !== 'undefined') {
            var message;
            for (var i = 0; i < json.messages.length; i++) {
                if (typeof this.messageHash[json.messages[i].id] === 'undefined') {
                    if (typeof json.messages[i].localid !== 'undefined' 
                            && typeof this.localMessages[json.messages[i].localid] !== 'undefined') {
                        message = this.localMessages[json.messages[i].localid];
                    } else {
                        message = new Message();
                        message.roomid = this.id;
                    }
                    message.updateFromJSON(json.messages[i]);
                    this.messageHash[message.getId()] = this.messages.push(message) - 1;
                } else {
                    this.messages[this.messageHash[message.getId()]].updateFromJSON(json.messages[i]);
                }
            }
        }
        if (typeof json.users !== 'undefined') {
            this.users.updateFromJSON(json.users);
            if (chat) {
                this.requiresUsers = false;
                if (typeof json.userTime !== 'undefined') {
                    this.lastUserRefresh = json.userTime;
                }
            }
        }
    };
    
    this.getUser = function (id) {
        var user = this.users.getUser(id);
        if (user === null || user.nickname === null) {
            this.requiresUsers = true;
        }
        return user;
    };
    
    this.getNewestMessageId = function () {
        if (this.messages.length === 0) {
            return -1;
        }
        return (this.messages[this.messages.length - 1].id);
    };
    
    this.getMessagePosition = function (id) {
        if (typeof this.messageHash[id] === 'undefined') {
            return -1;
        }
        return this.messageHash[id];
    };
    
    this.getMessagesFrom = function (lastid) {
        var idx = this.getMessagePosition(lastid);
        if (idx === -1) {
            return this.messages;
        } else {
            var messages = [];
            idx++;
            for (null; idx < this.messages.length; idx++) {
                messages.push(this.messages[idx]);
            }
            return messages;
        }
    };
    
    this.getStorytellers = function () {
        /** @type User */ var user;
        var result = [];
        for (var i in this.users.users) {
            user = this.users.users[i];
            if (user.isStoryteller()) {
                result.push(user.id);
            }
        }
        return result;
    };
}