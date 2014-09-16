/**
 * 
 * If not making a Module for personal use, consider using the Language module to print any messages the module has.
 */
window.chatModules.push({

    ID : 'sheettr',
    
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
        var $msg = $('<p class="chatTurno" />');
        
        var $persona = $('<b />').text(msg.getSpecial('sheetname', '????'));
        $msg.
            append($('<span class="turnIcon" />')).
            append($persona).
            append(":");
        
        if (msg.id !== null) {
            $msg.attr('data-msgid', msg.id);
        } else {
            msg.bindSaved(window.app.emulateBind(
                function () {
                    this.$msg.attr('data-msgid', this.msg.id);
                }, {$msg : $msg, msg : msg}
            ));
        }
        
        var player = msg.getSpecial('player', 0);
        if (window.app.loginapp.user.id === player && !window.app.ui.chat.cc.firstPrint) {
            var audio = document.getElementById('yourTurnAudio');
            audio.currentTime = 0;
            audio.volume = 1;
            audio.play();
        }
        
        
        return $msg;
    },
    
    getMsg : function (slashCMD, message) {
        return null;
    }
});