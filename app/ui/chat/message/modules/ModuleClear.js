/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'Clear',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/clear', '/limpa', '/limpar', '/cls', '/apagar', '/apaga', '/limpar', '/limpa'],
    
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
        if (message === '1') {
            var $html = null;
        } else {
            var $html = $('<p class="chatSistema language" data-langhtml="_CHATCLEARED_" />');
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
        window.app.ui.chat.$chatMessages.empty();
        
        if (message === '1') {
            window.app.chatapp.clear();
            window.app.ui.chat.fixScrollpane();
        }
        return null;
    },
    
    get$error : function () {
        return null;
    }
});