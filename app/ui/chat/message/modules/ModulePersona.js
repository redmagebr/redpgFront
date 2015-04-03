if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'Persona',
    
    showHelp : false,
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/persona', '/nick', '/nome', '/personagem', '/nickhidden', '/personaescondida', '/personahidden', '/nomehidden', '/nomeescondido'],
    
    isValid : function (slashCMD, msg) {
        if (msg.length > 0) {
            return true;
        }
        return false;
    },
    
    /**
     * Runs a piece of code after receiving user input.
     * This is where any module commands that do not create an actual message should go.
     * If your module only deals with actual messages, this function does not need to be implemented.
     * @param {Message} msg
     * @returns {jQuery || null}
     */
    get$ : function (msg, slashCMD, message) {
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
        var hidden = ['/nickhidden', '/personaescondida', '/personahidden', '/nomehidden', '/nomeescondido'];
        window.app.ui.chat.pc.addPersona(message, "", hidden.indexOf(slashCMD) !== -1);
        
        return null;
    },
    
    get$error : function () {
        return null;
    }
});