/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'Whisper',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/whisper', '/w', '/pm', '/private', '/mp', '/privada'],
    
    targets : [],
    
    storyteller : false,
    
    isValid : function (slashCMD, msg) {
        this.targets = [];
        var room = window.app.ui.chat.cc.room;
        var users = room.users.users;
        var split = msg.split(/,(.+)/);
        var target = split[0];
        
        if (target.toUpperCase() === 'MESTRE' || target.toUpperCase() === 'MESTRES') {
            this.storyteller = true;
            return true;
        }
        
        var testTarget = target.toUpperCase();
        /** @type User */ var user;
        for (var idx in users) {
            user = users[idx];
            if (user.id === window.app.loginapp.user.id) continue;
            if (testTarget === (user.nickname + '#' + user.nicknamesufix).toUpperCase()) {
                this.targets.push(user.id);
                return true;
            }
            if (user.nickname !== null && user.nickname.toUpperCase().indexOf(testTarget) !== -1) {
                this.targets.push(user.id);
            } else if (user.persona !== null) {
                if (user.persona.toUpperCase().indexOf(testTarget) !== -1) {
                    this.targets.push(user.id);
                }
            }
        }
        
        return (this.targets.length === 1);
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @param {String} slashCMD
     * @param {String} msgOnly
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, msgOnly) {
        if (!window.app.ui.isStreaming()) {
            var $html = $('<p class="chatWhisper" />');
            var user = msg.getUser();
        
            if (user === null) {
                user = new User();
                user.nickname = '?';
                user.nicknamesufix = '?';
            }
            
            var me = window.app.loginapp.user;
            
            if (user.id !== me.id) {
                window.app.ui.chat.cc.room.lastWhisper = user;
                var $origin = $('<span class="origin" />');
                $origin.append('( ');
                $origin.append($('<span class="language" data-langhtml="_WHISPERORIGIN_" />'));
                $origin.append(" ");
                $origin.append(user.nickname + '#' + user.nicknamesufix);
                $origin.append(' ) : ');
            
                $html.append($origin);
                
                if (user.nickname !== '?') {
                    $origin.bind('click', window.app.emulateBind(
                        function () {
                            window.app.ui.chat.$chatinput.val('/whisper ' + this.nick + ', ');
                            window.app.ui.chat.$chatinput.focus();
                        }, {nick : user.nickname + '#' + user.nicknamesufix}
                    ));
                }
            } else {
                if (typeof msg.destination === 'number' || msg.destination.length === 1) {
                    var destination = msg.getDestinationUser();
                    if (destination === null) {
                        destination = new User();
                        destination.nickname = '?';
                        destination.nicknamesufix = '?';
                    }
                    window.app.ui.chat.cc.room.lastWhisper = destination;

                    var $destination = $('<span class="origin" />');
                    $destination.append('( ');
                    $destination.append($('<span class="language" data-langhtml="_WHISPERDESTINATION_" />'));
                    $destination.append(" ");
                    $destination.append(destination.nickname + '#' + destination.nicknamesufix);
                    $destination.append(' ) : ');

                    $html.append($destination);

                    if (destination.nickname !== '?') {
                        $destination.bind('click', window.app.emulateBind(
                            function () {
                                window.app.ui.chat.$chatinput.val('/whisper ' + this.nick + ', ');
                                window.app.ui.chat.$chatinput.focus();
                            }, {nick : destination.nickname + '#' + destination.nicknamesufix}
                        ));
                    }
                } else {
                    var $destination = $('<span class="origin" />');
                    $destination.append('( ');
                    $destination.append($('<span class="language" data-langhtml="_WHISPERDESTINATION_" />'));
                    $destination.append(" <span class='language' data-langhtml'_WHISPERMANYDESTINATIONS_'></span>");
                    $destination.append(' ) : ');

                    $html.append($destination);
                }
            }
            
            
            
            var $msg = $('<span class="message" />');
            $msg.text(msg.getMessage());
            
            $html.append($msg);
            
            return $html;
        }
            
        return null;
    },
    
    /**
     * createObject must return a Message object.
     * 
     * You can create a Message like so:
     *   var msg = new Message ();
     *   msg.storeMessage (String mymessage);
     *   msg.storeValue (String index, String value);
     *   return msg;
     *   
     * @returns {Message || null}
     * @param {String} message
     */
    getMsg : function (slashCMD, message) {
        // message is the whole string after the slash command.
        // slashCMD is the slash command used.
        // If the user typed "/template 123", message would be "123" now and slashCMD would be "/template".
        var msg = new Message();
        
        var split = message.split(/,(.+)/);
        if (split.length > 1) {
            msg.setMessage(split[1]);
        }
        
        msg.setDestination(this.targets);
        
        return msg;
    },
    
    
    autoComplete : function (slashCMD, message) {
        if (this.targets.length === 1) {
            var split = message.split(/,(.+)/);
            if (split.length > 1) { 
                var cleanMessage = split[1];
            } else {
                var cleanMessage = '';
            }
            
            var username;
            var user = window.app.ui.chat.cc.room.getUser(this.targets[0]);
            if (user == null || user.nickname == null) {
                username = split[0];
            } else {
                username = user.nickname + '#' + user.nicknamesufix;
            }
            
            return "/whisper " + username + ', ' + cleanMessage;
        } else {
            return this.get$error(slashCMD, message);
        }
    },
    
    /**
     * Creates the HTML Element for an error message.
     * This is called after isValid returns false.
     * @param {String} slashCMD
     * @param {String} message
     * @returns {jQuery}
     */
    get$error : function (slashCMD, message) {
        var cleanSlash = $('<div />').text(slashCMD).html();
        var split = message.split(/,(.+)/);
        if (split.length > 1) { 
            var cleanMessage = split[1];
        } else {
            var cleanMessage = '';
        }
        
        var $html = $('<p class="chatSistema language" data-langhtml="_INVALIDWHISPER_" />');
        var $many = $('<p class="chatSistema" />');
        $many.append('<span class="language" data-langhtml="_TOOMANYWHISPER_"></span>');
        
        var $user;
        var hasAny = false;
        var nick;
        var user;
        var id;
        
        for (var i = 0; i < this.targets.length; i ++) {
            id = this.targets[i];
            user = window.app.ui.chat.cc.room.getUser(id);
            if (user !== null) {
                nick = user.nickname + '#' + user.nicknamesufix;
                if (user.persona !== null && user.persona !== '') {
                    nick = nick + ' - (' + user.persona + ')';
                }
                $user = $('<span class="target" />').text(nick);
                $user.bind('click', window.app.emulateBind(
                    function () {
                        window.app.ui.chat.$chatinput.val('/whisper ' + this.target + ', ' + this.message);
                        window.app.ui.chat.$chatinput.focus();
                    }, {target : user.nickname + '#' + user.nicknamesufix, message : cleanMessage}
                ))
                $many.append($user);
            }
            hasAny = true;
        }
        
        if (hasAny) {
            $many.append("<span class='language' data-langhtml='_WHISPERPICKONE_'></span>");
            return $many;
        }
        
        
        var split = message.split(/,(.+)/);
        var target = split[0];
        var cleanMsg = $('<div />').text(target).html();
        var $html = $('<p class="chatSistema language" data-langhtml="_INVALIDWHISPER_" />');
        $html.attr('data-langp', cleanMsg);
        
        return $html;
    }
});