/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'action',
    
    Slash : ['/me', '/eu', '/act', '/acao', '/açao', '/ação'],
    
    
    isValid : function (slashCMD, message) {
        return true;
    },

    /**
     * @param {Message} msg
     * @returns {jQuery}
     */
    get$ : function (msg) {
        var user = msg.getUser();
        var $msg = $('<p class="chatAcao" />');
        
        var $persona = $('<b />').text('* ' + msg.getSpecial('persona', '????'));
        var msgText = $('<p />').text(msg.msg).html();
        $msg.append($persona).append(' ' + msgText);
        
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
        var cc = window.app.ui.chat.cc;
        var room = cc.room;
        var msg = new Message();
        if (room.persona === null) {
            msg.setSpecial('persona', '?????');
        } else {
            msg.setSpecial('persona', room.persona);
        }
        msg.msg = message;
        
        
        return msg;
    }
});