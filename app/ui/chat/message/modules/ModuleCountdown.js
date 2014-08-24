/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'countdown',
    
    timeouts : [],
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/countdown', '/count', '/timer', '/stoptimer'],
    
    isValid : function (slashCMD, msg) {
        return !isNaN(msg, 10) || slashCMD === '/stoptimer';
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        if (msg === null) {
            return null;
        }
        var user = msg.getUser();
        if (user === null || !user.isStoryteller()) {
            return null;
        }
        
        var $msg = $('<p class="chatNarrativa" />');
        
        $msg.text('----- ' + msg.msg);
        
        var $tooltip = $('<span class="tooltip" />');
        if (user.isStoryteller()) {
            $tooltip.append($('<b class="language" data-langhtml="_STORYTELLERTOOLTIP_" />'));
        } else {
            $tooltip.append($('<b class="language" data-langhtml="_PLAYERTOOLTIP_" />'));
        }

        $tooltip.append(': ' + user.nickname + '#' + user.nicknamesufix);

        $msg.append($tooltip);
        
        return $msg;
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
        for (var i = 0; i < this.timeouts.length; i++) {
            clearTimeout(this.timeouts[i]);
        }
        this.timeouts = [];
        if (slashCMD === '/stoptimer') {
            return null;
        }
        var counter = parseInt(message);
        var timeout;
        var steps = 0;
        while (counter >= 0) {
            this.timeouts.push(
                setTimeout(window.app.emulateBind(
                    function () {
                        var message = new Message();
                        message.origin = window.app.loginapp.user.id;
                        message.module = 'countdown';
                        message.msg = this.count;
                        message.roomid = window.app.ui.chat.cc.room.id;
                        var $html = this.mod.get$(message);
                        window.app.ui.language.applyLanguageOn($html);
                        window.app.ui.chat.appendToMessages($html);
                        window.app.ui.chat.cc.room.addLocal(message);
                        window.app.chatapp.sendMessage(message);
                    }, {count : counter, mod : this}
                ), steps * 1000)
            );
            counter -= 1;
            steps += 1;
        }
        console.log(this.timeouts);
        return null;
    },
    
    get$error : function () {
        return null;
    }
});