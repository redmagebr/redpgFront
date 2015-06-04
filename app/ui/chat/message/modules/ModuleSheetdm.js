if (window.chatModules === undefined) window.chatModules = [];
/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'sheetdm',
    
    Slash : [],
    
    
    isValid : function (slashCMD, message) {
        return false;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg) {
        var user = msg.getUser();
        var $msg = $('<p class="chatDano" />');
        
        var tipo = msg.getSpecial('type', "HP");
        
//        if (tipo !== "HP" && tipo !== "Exp" && tipo !== "MP") {
//            tipo = "HP";
//        }
        
        $msg.addClass("tipo" + tipo);
        
        var $persona = $('<b />').text(msg.getSpecial('sheetname', '????'));
        $msg.
            append($('<span class="changeIcon" />')).
            append($persona).
            append(": ").
            append($('<span class="changeAmount" />').text(msg.getSpecial('amount', '0?') + ' ' + tipo));
        
//        if (msg.id !== null) {
//            $msg.attr('data-msgid', msg.id);
//        } else {
//            msg.bindSaved(window.app.emulateBind(
//                function () {
//                    this.$msg.attr('data-msgid', this.msg.id);
//                }, {$msg : $msg, msg : msg}
//            ));
//        }
        
        var log = msg.getSpecial("log", null);
        if (log !== null) {
        	window.app.ui.hover.makeHover($msg[0], log);
        }
        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        return null;
    }
});