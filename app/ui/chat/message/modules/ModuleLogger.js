/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'Logger',
    
    showHelp : false,
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/log'],
    
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
        window.app.ui.chat.cc.exit();
        window.app.chatapp.clearAck();
        window.app.chatapp.room = new Room();
        window.app.ui.chat.cc.room = window.app.chatapp.room;
        window.app.ui.chat.cc.pc.room = window.app.chatapp.room;
//        window.app.chatapp.room.updateFromJSON(window.prompt("JSON:"), true);
        window.app.ui.chat.$chatMessages.empty();
        window.app.ui.chat.cc.firstPrint = true;
        window.app.ui.chat.cc.ignoreTooMany = true;
        window.app.ui.chat.cc.lastMessage = -1;
        window.app.ui.chat.cc.printMessages();
        window.app.ui.chat.cc.pc.clear();
        window.app.ui.chat.cc.firstPrint = false;
        return null;
    },
    
    get$error : function () {
        return null;
    }
});