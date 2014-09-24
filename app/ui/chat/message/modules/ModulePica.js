/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({
    /**
     * Defines the ID this module will have. It must not be the same as any other module ID.
     * @type String
     */
    ID : 'pica',
    
    
    /**
     * Defines the slash command that calls this module.
     * @type Array of Strings
     */
    Slash : ['/quadro', '/board', '/canvas'],
    
    isValid : function (slashCMD, msg) {
        return true;
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
        if (slashCMD !== undefined && slashCMD !== null) {
            return null;
        }
        
        if (window.app.ui.pictureui.locked) {
            var user = msg.getUser();
            if (!user.isStoryteller()) {
                return null;
            }
        }
        
        var src = msg.msg;
        
        var clear = msg.getSpecial('clear', false);
        if (clear === true) {
            var user = msg.getUser();
            if (!user.isStoryteller()) {
                return null;
            }
            window.app.ui.pictureui.clearDrawings(src);
        }
        
        var myArt = msg.getSpecial('art', []);
        
        
        if (!myArt instanceof Array) return null;
        
        var art = [];
        
        for (var i = 0; i < myArt.length; i++) {
            if (myArt[i].length < 2) continue;
            if (isNaN(myArt[i][0], 10) || isNaN(myArt[i][1], 10)) continue;
            art.push(myArt[i]);
        }
        
        window.app.ui.pictureui.addDrawings (src, art);
        
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
        // Open empty picture
        
        return null;
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