function ChatWsApp () {
    this.controller = new WsController();
    this.lastMessage = 0;
    this.typing = false;
    this.free = true;
    this.timeout = null;
    this.ackTimeout = null;
    this.focusFlag = true;
    this.idleFlag = false;
    this.notConnected = false;
    
    $(window).bind('focus', function (e) {
        window.app.chatapp.focusFlag = true;
        window.app.chatapp.sendFocus();
    });
    
    $(window).bind('blur', function (e) {
        window.app.chatapp.focusFlag = false;
        window.app.chatapp.sendFocus();
    });
    
    $(window).idle({
        onIdle : function () {
            window.app.chatapp.idleFlag = true;
            window.app.chatapp.sendIdle();
        },
        onActive : function () {
            window.app.chatapp.idleFlag = false;
            window.app.chatapp.sendIdle();
        },
        events : "mouseover mouseout click keypress mousedown mousemove blur focus",
        idle: 20000
    });
    
    /**
     * 
     * @param {Room} room
     * @param {type} cbs
     * @param {type} cbe
     * @returns {undefined}
     */
    this.start = function (room, cbs, cbe) {
        this.room = room;
        this.cbs = cbs;
        this.cbe = cbe;
        
        if (this.controller.connected) {
            this.onopen();
        } else {
            this.connect();
        }
    };
    
    this.connect = function () {
        this.clearAck();
        var onopen = function (event) {
            window.app.chatapp.onopen(event);
        };
        var onclose = function (event) {
            window.app.chatapp.onclose(event);
        };
        var onmessage = function (event) {
            window.app.chatapp.onmessage(event);
        };
        var onerror = function (event) {
            window.app.chatapp.onerror(event);
        };
        
        
        this.controller.connect("Chat", onopen, onclose, onmessage, onerror);
    };
    
    this.onopen = function (event) {
        this.clearAck();
        console.log("Connected - ");
        console.log(event);
        this.notConnected = true;
        this.waitForAck();
        this.sendAction("room", this.room.id);
        window.app.ui.chat.cc.firstPrint = false;
        var $html = $('<p class="chatSistema" />');
        $html.append($('<span class="language" data-langhtml="_CHATWSCONNECTING_" />'));
        window.app.ui.language.applyLanguageOn($html);
        window.app.ui.chat.appendToMessages($html);
    };
    
    this.onclose = function (event) {
        console.log("Disconnected - ");
        console.log(event);
        
        var $html = $('<p class="chatSistema" />');
        $html.append($('<span class="language" data-langhtml="_CHATWSDISCONNECTED_" />'));
        var $a = $('<a class="language" data-langhtml="_CHATWSRECONNECT_" />').on('click', function () {
            window.app.chatapp.connect();
        });
        $html.append(" ").append($a);
        window.app.ui.language.applyLanguageOn($html);
        window.app.ui.chat.appendToMessages($html);
        this.clearAck();
        
        window.app.loginapp.checkLogin();
    };
    
    this.onerror = function (event) {
        console.log("Error - ");
        console.log(event);
        this.clearAck();
        window.app.loginapp.checkLogin();
    };
    
    this.onmessage = function (event) {
        this.clearAck();
        console.log("Message received:");
        console.log(event.data);
        console.log("Response time: " + ((new Date().getTime()) - this.lastMessage));
        
        if (event.data === "1") {
            return;
        }
        
        var obj = JSON.parse(event.data);
        if (obj[0] === 'typing') {
            this.room.users.getUser(obj[1]).typing = (obj[2] === 1);
            window.app.ui.chat.cc.pc.checkUsers();
        } else if (obj[0] === 'focused') {
            this.room.users.getUser(obj[1]).focused = (obj[2] === 1);
            window.app.ui.chat.cc.pc.checkUsers();
        } else if (obj[0] === 'message') {
            if (obj[1].id < 0) {
                if (typeof obj[1].localid === 'undefined') {
                    var message = new Message();
                    message.updateFromJSON(obj[1]);
                    message.roomid = this.room.id;
                    window.app.ui.chat.cc.printMessage(message);
                }
            } else {
                this.room.updateFromJSON({'messages' : [obj[1]]});
                window.app.ui.chat.cc.printMessages();
            }
        } else if (obj[0] === 'idle') {
            this.room.users.getUser(obj[1]).idle = (obj[2] === 1);
            window.app.ui.chat.cc.pc.checkUsers();
        } else if (obj[0] === 'persona') {
            var user = this.room.users.getUser(obj[1]);
            if (typeof obj[2]['persona'] === 'undefined') {
                obj[2]['persona'] = null;
            }
            if (typeof obj[2]['avatar'] === 'undefined') {
                obj[2]['avatar'] = null;
            }
            user.updateFromJSON(obj[2]);
            window.app.ui.chat.cc.pc.checkUsers();
        } else if (obj[0] === 'joined') {
            var user = {};
            user[obj[1].id] = obj[1];
            this.room.users.updateFromJSONObject(user, true);
            window.app.ui.chat.cc.checkUsers();
            window.app.ui.chat.cc.pc.checkUsers();
        } else if (obj[0] === 'left') {
            this.room.users.getUser(obj[1]).online = false;
            window.app.ui.chat.cc.checkUsers();
            window.app.ui.chat.cc.pc.checkUsers();
        } else if (obj[0] === "inroom") {
            this.updateUsers (obj[1]);
        } else if (obj[0] === 'memory') {
            window.app.roomdb.getRoom(obj[1]).memory.updateFromJSON(obj[2]);
        } else if (obj[0] === 'getroom') {
            this.updateUsers(obj[1]);
            this.room.memory.updateFromJSON(obj[2]);
        }
    };
    
    this.updateUsers = function (json) {
        var users = this.room.users.users;
        for (var index in users) {
            users[index].online = false;
        }
        this.room.users.updateFromJSONObject(json, true);
        window.app.ui.chat.cc.checkUsers();
        window.app.ui.chat.cc.pc.checkUsers();
    };
    
    this.sendAction = function (action, message) {
            this.controller.sendMessage(action, message);
            this.lastMessage = new Date().getTime();
            console.log("Message sent:" + action + ';' + message);
    };
    
    this.sendMessage = function (message) {
        this.sendAction("message", JSON.stringify({
            localid : message.localid,
            destination : message.destination,
            message : message.msg,
            module : message.module,
            special : message.special,
            clone : message.clone
        }));
    };
    
    this.printAndSend = function (message, addlocal) {
        var mod = window.app.ui.chat.mc.getModule(message.module);
        if (mod === null) {
            return;
        }
        if (addlocal) {
            window.app.ui.chat.cc.room.addLocal(message);
        }
        var $html = mod.get$(message);
        message.set$($html);
        window.app.ui.language.applyLanguageOn($html);
        window.app.ui.chat.appendToMessages($html);
        this.sendMessage(message);
    };
    
    this.getAllMessages = function () {
        window.app.ui.chat.$chatMessages.empty();
        
        window.app.ui.chat.cc.firstPrint = true;
        window.app.ui.chat.cc.lastMessage = -1;
        
        var cbs = function (data) {
            window.app.chatapp.room.empty();
            window.app.chatapp.room.updateFromJSON({messages : data}, true);
            window.app.ui.chat.cc.printMessages();
            window.app.ui.chat.cc.clearUsers();
            window.app.ui.chat.cc.checkUsers();
            window.app.ui.chat.cc.pc.checkUsers();
            window.app.ui.chat.cc.firstPrint = false;
        };
        
        var cbe = function () {
            console.log("error");
        };
        
        var ajax = new AjaxController();
        
        var data = {
            roomid : this.room.id,
            action : 'messages'
        };
        
        ajax.requestPage({
            url : 'Room',
            data : data,
            success: cbs,
            error: cbe
        });
    };
    
    this.stop = function () {
        if (this.controller.connected) {
            this.controller.closeConnection();
        }
        this.clearAck();
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
            url : 'Room',
            data : {
                'roomid' : this.room.id,
                action : 'clear'
            },
            error: cbe,
            success: cbs
        });
    };
    
    this.updateTyping = function (typing) {
        if (typing !== this.typing) {
            this.typing = typing;
            this.sendAction("typing", this.typing ? '1' : '0');
            var user = this.room.getUser(window.app.loginapp.user.id);
            if (user != null && user.focused != this.focusFlag) {
                this.sendFocus();
            }
            if (user != null && user.idle != this.idleFlag) {
                this.sendIdle();
            }
        }
        
        console.log(this.typing);
    };
    
    this.clearAck = function () {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
            console.log("No longer waiting for server message.");
        }
        if (this.ackTimeout !== null) {
            clearTimeout(this.ackTimeout);
            this.ackTimeout = null;
        }
        
        if (this.notConnected) {
            var $html = $('<p class="chatSistema" />');
            $html.append($('<span class="language" data-langhtml="_CHATWSCONNECTED_" />'));
            var $a = $('<a class="language" data-langhtml="_CHATWSGETOLDERMESSAGES_" />').on('click', function () {
                window.app.chatapp.getAllMessages();
            });
            $html.append(" ").append($a);
            window.app.ui.language.applyLanguageOn($html);
            window.app.ui.chat.appendToMessages($html);
            this.notConnected = false;
        }
        
        this.ackTimeout = setTimeout(function () {
            window.app.chatapp.ack();
        }, 5000);
        
        $('#chatNotConnError').hide();
        $('#chatNotLoad').hide();
    };
    
    this.waitForAck = function () {
        console.log("Waiting for server message.");
        this.timeout = setTimeout(function () {
            $('#chatNotLoad').show();
            $('#chatNotConnError').hide();
            window.app.chatapp.controller.sendAck();
            window.app.chatapp.timeout = setTimeout(function () {
                $('#chatNotConnError').show();
                $('#chatNotLoad').hide();
            }, 10000);
        }, 5000);
    };
    
    this.ack = function () {
       this.waitForAck();
       this.controller.sendAck();
    };
    
    this.sendFocus = function () {
        if (this.controller.connected) {
            this.sendAction("focused", this.focusFlag ? '1' : '0');
        }
    };
    
    this.sendIdle = function () {
        if (this.controller.connected) {
            this.sendAction("idle", this.idleFlag ? '1' : '0');
        }
    };
    
    this.saveMemory = function () {
        console.log("GOTTA GO FAST");
        if(this.room.getMe().isStoryteller()) {
            this.sendAction("memory", JSON.stringify(this.room.memory.memory));
        }
    };
}