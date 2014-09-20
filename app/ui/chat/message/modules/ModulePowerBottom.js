/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'powerbottom',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/powerbottom'],
    
    isValid : function (slashCMD, msg) {
        return true;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
        window.app.ui.chat.powerBottom = !window.app.ui.chat.powerBottom;
        if (window.app.ui.chat.powerBottom) {
            var $html = $('<p class="chatSistema language" data-langhtml="_POWERBOTTON_" />');
        } else {
            var $html = $('<p class="chatSistema language" data-langhtml="_POWERBOTTOFF_" />');
        }
        
        return $html;
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
        return null;
    },
    
    get$error : function () {
        return null;
    }
});