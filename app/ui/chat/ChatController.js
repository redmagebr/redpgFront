function ChatController (chat) {
    /**
     * @type Chat
     */
    this.chat = chat;
    
    this.mc = chat.mc;
    this.pc = new PlayerController();
    
    /**
     * @type Room
     */
    this.room = null;
    this.lastMessage = -1;
    this.firstPrint = true;
    
    this.printed = 0;
    this.clearInformed = false;
    this.lastDate = '';
    
    this.ignoreTooMany = false;
    
    this.onlineUsers = [];
    
    this.init = function () {
        
        
        this.setBindings();
    };
    
    this.openRoom = function (id) {
        if (this.room === null || id !== this.room.id) {
            this.room = window.app.roomdb.getRoom(id);
            this.pc.room = this.room;
            this.callSelf(true);
        } else {
            this.callSelf(false);
        }
    };
    
    this.callSelf = function (clean) {
        if (this.room === null) {
            window.app.ui.gameui.callSelf();
        } else {
            if (clean) {
                this.lastMessage = -1;
                this.lastDate = '';
                this.chat.$chatMessages.empty();
                this.pc.clear();
                this.chat.$roomName.text(this.room.name);
                this.chat.$roomDesc.text(this.room.description);
                this.chat.pc.$container.empty();
                this.chat.pc.restore();
                if (this.room.persona !== null) {
                    window.app.ui.chat.pc.addPersona(this.room.persona, this.room.avatar, this.room.hidePersona);
                }
                this.room.emptyLocal();
                this.printed = 0;
                this.clearInformed = false;
            }
            this.firstPrint = true;
            this.printMessages();
            this.firstPrint = true;
            
            this.onlineUsers = [];
            this.room.requiresUsers = true;
            
            var cbs = function () {
                window.app.ui.chat.cc.printMessages();
                window.app.ui.chat.cc.checkUsers();
                window.app.ui.chat.cc.pc.checkUsers();
            };
            
            var cbe = function (data) {
                window.app.ui.chat.cc.printError(data);
            };
            
            window.app.chatapp.start(this.room, cbs, cbe);
            window.app.ui.callLeftWindow('chatWindow');
        }
    };
    
    this.exit = function () {
        if (this.room !== null) {
            this.room.emptyLocal();
        }
        this.room = null;
        window.app.chatapp.stop();
    };
    
    this.setBindings = function () {
        $('#leaveChatBt').bind('click', function () {
            window.app.ui.chat.cc.exit();
            window.app.ui.gameui.callSelf();
        });
        
        $('#callChatWindowBt').bind('click', function () {
            if (window.app.chatapp.room !== null) {
                window.app.ui.callLeftWindow('chatWindow');
            } else {
                window.app.ui.gameui.callSelf();
            }
        });
    };
    
    
    this.printError = function (data) {
        var $html = $('<p class="chatSistema" />');
        $html.append($('<span class="language" data-langhtml="_CHATCONNERROR_" />'));
        
        $html.append(' ');
        
        var $aretry = $('<a class="language" data-langhtml="_CHATCONNERRORRETRY_" />');
        
        $html.append($aretry);
        
        $aretry.bind('click', function () {
            window.app.ui.chat.cc.callSelf(false);
            $(this).parent().remove();
            window.app.ui.chat.fixScrollpane();
        });
        
        
        window.app.ui.language.applyLanguageOn($html);
        window.app.ui.chat.appendToMessages($html);
    };
    
    
    this.printMessages = function () {
        if (this.room === null) {
            return false;
        }
        var messages = this.room.getMessagesFrom(this.lastMessage);
        if (messages === null || typeof messages === 'undefined') {
            return false;
        }
        
        var printedOne = false;
        
        /** @type Message */ var message;
        var module;
        /** @type User */ var user;
        
        var $target = this.chat.$chatMessages;
        var $html;
        if (messages.length > 0) {
            this.lastMessage = messages[messages.length - 1].id;
            for (var i = 0; i < messages.length; i++) {
                message = messages[i];
                if (message.localid !== null) {
                    continue;
                }
                if (this.lastDate !== message.date) {
                    $html = $('<p class="chatSistema language" data-langhtml="_CHATDATE_" />').attr('data-langp', message.date);
                    $target.append($html);
                    this.lastDate = message.date;
                    window.app.ui.language.applyLanguageOn($html);
                }
                module = window.app.ui.chat.mc.getModule(message.module);
                if (module === null) {
                    user = message.getUser();
                    $html = $('<p class="chatSistema language" data-langhtml="_INVALIDMODULE_" />');
                    $html.attr('data-langp', message.module);
                    if (user !== null) {
                        $html.attr('data-langd', user.nickname + '#' + user.nicknamesufix);
                    } else {
                        $html.attr('data-langd', "?????");
                    }
                } else {
                    $html = module.get$(message, null, null);
                    
                }
                if ($html !== null) {
                    printedOne = true;
                    window.app.ui.language.applyLanguageOn($html);
                    $target.append($html);
                }
                
            }
            
            if (!window.app.ui.hasFocus && printedOne) {
                window.app.ui.notifyMessages();
            }
            
            this.printed += messages.length;
            if (this.printed > 100 && !this.ignoreTooMany) {
                var $children = window.app.ui.chat.$chatMessages.children('p');
                this.printed = $children.length;
                if (this.printed > 100) {
                    $children.slice(0, this.printed - 50).remove();
                    var $html = $('<p class="chatSistema" />');
                    $html.append("<span class='language' data-langhtml='_CHATWSNOTALL_'></span>");
                    var $a = $('<a class="language" data-langhtml="_CHATWSGETOLDERMESSAGES_" />').on('click', function () {
                        window.app.chatapp.getAllMessages();
                    });
                    $html.append(' ').append($a);
                    window.app.ui.language.applyLanguageOn($html);
                    window.app.ui.chat.$chatMessages.prepend($html);
                }
            }
        }
        this.firstPrint = false;
    };
    
    this.printMessage = function (message) {
        if (this.room === null) {
            return false;
        }
        var printedOne = false;
        
        /** @type Message */ var message;
        var module;
        /** @type User */ var user;
        
        var $target = this.chat.$chatMessages;
        var $html;
        if (this.lastDate !== message.date) {
            $html = $('<p class="chatSistema language" data-langhtml="_CHATDATE_" />').attr('data-langp', message.date);
            $target.append($html);
            this.lastDate = message.date;
            window.app.ui.language.applyLanguageOn($html);
        }
        
        
        module = window.app.ui.chat.mc.getModule(message.module);
        if (module === null) {
            user = message.getUser();
            $html = $('<p class="chatSistema language" data-langhtml="_INVALIDMODULE_" />');
            $html.attr('data-langp', message.module);
            if (user !== null) {
                $html.attr('data-langd', user.nickname + '#' + user.nicknamesufix);
            } else {
                $html.attr('data-langd', "?????");
            }
        } else {
            $html = module.get$(message, null, null);
        }
        if ($html !== null) {
            printedOne = true;
            $target.append($html);
            window.app.ui.language.applyLanguageOn($html);
        }

        if (!window.app.ui.hasFocus && printedOne) {
            window.app.ui.notifyMessages();
        }
            
        window.app.ui.chat.fixScrollpane();
    };
    
    this.clearUsers = function () {
        this.onlineUsers = [];
    };
    
    this.checkUsers = function () {
        if (!window.app.configdb.get('showWhispers', true)) {
            return null;
        }
        var users = this.room.users.users;
        var $html;
        var innerIndex;
        for (var index in users) {
            innerIndex = this.onlineUsers.indexOf(users[index].id);
            if (users[index].isOffline(window.app.chatapp.userTime, window.app.chatapp.afkTime)) {
                if (innerIndex !== -1) {
                    // Disconnected
                    $html = $('<p class="chatSistema language" data-langhtml="_HASDISCONNECTED_" />');
                    $html.attr('data-langp', users[index].nickname + '#' + users[index].nicknamesufix);
                    window.app.ui.language.applyLanguageTo($html);
                    window.app.ui.chat.appendToMessages($html);
                    this.onlineUsers.splice(innerIndex, 1);
                }
            } else {
                if (innerIndex === -1) {
                    // Connected
                    $html = $('<p class="chatSistema language" data-langhtml="_HASCONNECTED_" />');
                    $html.attr('data-langp', users[index].nickname + '#' + users[index].nicknamesufix);
                    window.app.ui.language.applyLanguageTo($html);
                    window.app.ui.chat.appendToMessages($html);
                    this.onlineUsers.push(users[index].id);
                }
            }
        }
    };
}