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
    	
    	if (msg.getMessage() === 'openSheet') {
    		var sheetid = msg.getSpecial('sheetid', null);
    		var styleid = msg.getSpecial('styleid', null);
    		var gameid = msg.getSpecial('gameid', null);
    		var sheetname = msg.getSpecial("sheetname", "???");
    		if (sheetid !== null && styleid !== null && gameid !== null
    				&& !isNaN(sheetid, 10) && !isNaN(styleid, 10) && !isNaN(gameid, 10)) {
    			$p = $("<p class='chatSistema'></p>");
    			
    			$a = $("<a class='textLink language' data-langhtml='_SHEETCMDOPEN_'></a>");
    			$a[0].addEventListener('click', {
    				sheetid : sheetid,
    				styleid : styleid,
    				gameid : gameid,
    				handleEvent : function () {
    					window.app.ui.sheetui.openSheet(this.sheetid, this.styleid, this.gameid, false);
    				}
    			});
    			
    			var user = msg.getUser().getShortestName();
    			
    			$p.append(document.createTextNode(user + " "))
    			  .append("<span class='language' data-langhtml='_SHEETCMDREQUESTEDOPEN_'></span>")
    			  .append(document.createTextNode(" " + sheetname + ". "))
    			  .append($a);
    			
    			return $p;
    		}
    	}
    	
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