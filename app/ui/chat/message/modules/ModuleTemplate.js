/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'Template',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/template'],
    
    isValid : function (slashCMD, msg) {
        
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
    },
    
    /**
     * Creates the HTML Element for an error message.
     * This is called after isValid returns false.
     * @param {String} slashCMD
     * @param {String} message
     * @returns {jQuery}
     */
    get$error : function (slashCMD, message) {
        
    }
});