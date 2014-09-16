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
        
        var $persona = $('<b />').text(msg.getSpecial('sheetname', '????'));
        $msg.
            append($('<span class="damageIcon" />')).
            append($persona).
            append(": ").
            append($('<span class="damageAmount" />').text(msg.getSpecial('amount', '0?') + ' HP'));
        
        if (msg.id !== null) {
            $msg.attr('data-msgid', msg.id);
        } else {
            msg.bindSaved(window.app.emulateBind(
                function () {
                    this.$msg.attr('data-msgid', this.msg.id);
                }, {$msg : $msg, msg : msg}
            ));
        }
        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        return null;
    }
});