if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'sheetcmd',
    
    Slash : [],
    
    
    isValid : function (slashCMD, message) {
        return false;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg) {
    	if (window.app.ui.chat.cc.firstPrint) return null;
    	
        var styleid = msg.getSpecial('styleid', 0);
        if (typeof window.app.ui.sheetui.controller.styles[styleid] === 'undefined') {
            return null;
        }
        
        try {
        	window.app.ui.sheetui.controller.styles[styleid].interpretCommand(msg);
        } catch (e) {
        	
        }
        return null;
    },
    
    getMsg : function (slashCMD, message) {
        return null;
    }
});