/** 
 * JSON Message:
 * 
 * ID : {
 *      Origin : ID,
 *      Destination: ID|NULL,
 *      Message : String,
 *      Module : String,
 *      Special : {
 *          Persona : String,
 *          FakeLanguage : String,
 *          ...
 *      }
 * }
 * 
 * Default Modules (Action, OffGame, Speech, Story) will
 * be controlled server-side and will work in a very specific manner.
 * Their Special object will ALWAYS have certain values inside of it and they will follow rules.
 * 
 * Non-default modules are controller client-side. That means the server will only check
 */

/**
 * MessageController is the part of the UI that handles messages.
 * It grabs the messages and calls upon the message modules to process them.
 * @class MessageController
 * @constructor
 */
function MessageController () {
    this.messageHistory = [];
    this.lastMessage = -1;
    this.messageRoller = 0;
    
    this.$chatinput;
    
    this.slashToMod = {
        /* Tells which module gets which slash command. MC doesn't actually process anything.
         * '/me' : 0,
         * Generated automatically through reading window.chatModules.
         * No slash commands calls upon '' empty string.
         * Invalid slash command calls an error message.
         */
    };
    
    this.idToMod = {
        /* Just like slashToMod, but points an id to a module.
         * 'Action' : 0,
         * Generated automatically through reading window.chatModules.
         * If the module is not found, message is printed to the user.
         */
    };
    
    
    this.getModule = function (id) {
        id = id.toLowerCase();
        if (typeof this.idToMod[id] !== 'undefined') {
            return this.idToMod[id];
        }
        return null;
    };
    
    this.getModuleFromSlash = function (slash) {
        slash = slash.toLowerCase();
        if (typeof this.slashToMod[slash] !== 'undefined') {
            return this.slashToMod[slash];
        }
        return null;
    };
    
    /**
     * Reads every registered chat Module and stores it for later use.
     * If any modules are added at runtime, this needs to be called again
     * or the modules will not be usable.
     * @returns {undefined}
     */
    this.readModules = function () {
        var module;
        
        for (var i = 0; i < window.chatModules.length; i++) {
            /**
            * @type Module
            */
            module = window.chatModules[i];
            this.idToMod[module.ID.toLowerCase()] = module;
            
            for (var v = 0; v < module.Slash.length; v++) {
                this.slashToMod[module.Slash[v].toLowerCase()] = module;
            }
        };
    };
    
    this.init = function () {
        this.readModules();
        this.$chatinput = $('#chatMensagemInput');
    };
    
    /**
     * Empties the chatInput
     * @returns {undefined}
     */
    this.clearInput = function () {
        this.$chatinput.val('');
    };
    
    
    /**
     * Returns current chatInput value.
     * @returns {MessageController@pro;$chatinput@call;val}
     */
    this.getInput = function () {
        return this.$chatinput.val();
    };
    
    /**
     * Gets current chatInput and starts processing a message.
     * @param {Event} e
     * @returns {undefined}
     */
    this.eatMessage = function (e) {
        var msg = this.getInput().trim();
        // If this isn't a slash command, check for shortcuts
        if (msg.charAt(0) !== '/') {
            if (msg.indexOf('off:') === 0){
                msg = msg.replace('off:', '/off ');
            } else if (typeof e !== 'undefined') {
                if (e.shiftKey) {
                    msg = '/story ' + msg;
                } else if (window.app.ui.chat.cc.room.persona === null) {
                    msg = '/off ' + msg;
                } else if (e.ctrlKey) {
                    msg = '/me ' + msg;
                } else if (e.altKey) {
                    msg = '/off ' + msg;
                }
            }
        }
        this.processMessage(msg);
        this.clearInput();
    };
    
    /**
     * Replaces the value in chatInput by String msg and then selects it all.
     * @param {String} msg
     * @returns {undefined}
     */
    this.replaceInput = function (msg) {
        this.$chatinput.val(msg);
        this.$chatinput.select();
    };
    
    /**
     * Moves chatInput to an older message in the message history.
     * Empties chatInput if there aren't any older messages.
     * @returns {undefined}
     */
    this.messageRollUp = function () {
        var text = this.$chatinput.val().trim();
        if (text !== '' && this.messageRoller < this.messageHistory.length && this.messageHistory[this.messageRoller] !== text) {
            this.storeMessage(text);
            this.messageRoller -= 1;
        }
        if (this.messageRoller > 0 && (typeof this.messageHistory[this.messageRoller - 1] !== 'undefined')) {
            this.messageRoller -= 1;
            this.replaceInput(this.messageHistory[this.messageRoller]);
        } else {
            this.messageRoller = 0;
            this.clearInput();
        }
    };
    
    /**
     * Moves chatInput to a newer message in the message history.
     * Empties chatInput if there aren't any newer messages.
     * @returns {undefined}
     */
    this.messageRollDown = function () {
        var text = this.$chatinput.val().trim();
        if (text !== '' && this.messageRoller < this.messageHistory.length && this.messageHistory[this.messageRoller] !== text) {
            this.storeMessage(text);
        }
        if (this.messageRoller + 1 < this.messageHistory.length) {
            this.replaceInput(this.messageHistory[++this.messageRoller]);
        } else {
            this.messageRoller = this.messageHistory.length;
            this.clearInput();
        }
    };
    
    /**
     * Receives the message string and makes it go through the appropriate Module.
     * If no module can be found, appends an error to chat.
     * @param {String} msg
     * @returns {undefined}
     */
    this.processMessage = function (msg) {
        if (msg.charAt(0) === '/') {
            if (msg.indexOf(' ') !== -1) {
                var slashCMD = msg.substr(0,msg.indexOf(' '));
                var msgOnly = msg.substr(msg.indexOf(' ')+1);
            } else {
                var slashCMD = msg;
                var msgOnly = '';
            }
        } else {
            var slashCMD = '';
            var msgOnly = msg;
        }
        slashCMD = slashCMD.toLowerCase();
        msgOnly = msgOnly.trim();
        // Pass through module
        if (typeof this.slashToMod[slashCMD] !== 'undefined') {
            var mod = this.slashToMod[slashCMD];
            if (mod.isValid(slashCMD, msgOnly, window.app.ui.chat.cc.room.getUser(window.app.loginapp.user.id).isStoryteller())) {
                var msgObj = mod.getMsg(slashCMD, msgOnly);
                if (msgObj !== null) {
                    msgObj.roomid = window.app.ui.chat.cc.room.id;
                    msgObj.room = window.app.ui.chat.cc.room;
                    msgObj.origin = window.app.loginapp.user.id;
                    msgObj.module = mod.ID;
                    console.log(msgObj);
                }
                var $msg = mod.get$(msgObj, slashCMD, msgOnly);
                if ($msg !== null) {
                    window.app.ui.language.applyLanguageOn($msg);
                    if (msgObj !== null) {
                        window.app.ui.chat.cc.hoverizeSender($msg, msgObj);
                    }
                    window.app.ui.chat.appendToMessages($msg);
                }
                if (msgObj !== null) {
                    window.app.ui.chat.cc.room.addLocal(msgObj);
                    window.app.chatapp.sendMessage(msgObj);
                }
                
                if (msgObj !== null && $msg !== null) {
                    msgObj.set$($msg);
                }
            } else {
                var $error = mod.get$error(slashCMD, msgOnly, window.app.loginapp.user.isStoryteller());
                if ($error !== null) {
                    window.app.ui.language.applyLanguageTo($error);
                    window.app.ui.language.applyLanguageOn($error);
                    window.app.ui.chat.appendToMessages($error);
                } else {
                    var cleanSlash = $('<div />').text(slashCMD).html();
                    var cleanMsg = $('<div />').text(msgOnly).html();
                    var $html = $('<p class="chatSistema language" data-langhtml="_INVALIDSLASHMESSAGE_" />');
                    $html.attr('data-langp', cleanSlash);
                    $html.attr('data-langd', msgOnly);
                    window.app.ui.language.applyLanguageTo($html);
                    window.app.ui.chat.appendToMessages($html);
                }
            }
        } else {
            var cleanSlash = $('<div />').text(slashCMD).html();
            var $html = $('<p class="chatSistema language" data-langhtml="_INVALIDSLASHCOMMAND_" />');
            $html.attr('data-langp', cleanSlash);
            window.app.ui.language.applyLanguageTo($html);
            window.app.ui.chat.appendToMessages($html);
        }
        // Send Message object to database
        
        this.storeMessage(msg);
    };
    
    /**
     * Records a message in message history and resets the roller position.
     * @param {String} msg
     * @returns {undefined}
     */
    this.storeMessage = function (msg) {
        this.messageHistory.push(msg);
        this.messageRoller = this.messageHistory.length;
    };
}


/**
 * Holds every module we have.
 * Modules should implement every method of the TemplateModule Class, or they won't work.
 * @type Array
 */
window.chatModules = [];